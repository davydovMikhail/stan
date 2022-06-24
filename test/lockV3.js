const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");
const keccak256 = require("keccak256");


describe("Token", function () {
  it("Token", async function () {
    console.log("1. Contract creation and users");
    [owner, controller, controller2, user1, user2, user3, user4] = await ethers.getSigners()
    const startTime = Math.floor(Date.now() / 1000);
    const lockTime = 500;
    const unlockTime = startTime + lockTime;
    console.log(startTime);
    const Token = await ethers.getContractFactory("TokenV3");
    const token = await Token.connect(owner).deploy("Token", "TKN", parseEther("10000"));
    await token.deployed();
    
    console.log("2. Transfer without lock");
    await token.connect(owner).transfer(user1.address, parseEther("2000"));
    await token.connect(user1).transfer(user2.address, parseEther("500"))
    expect(await token.balanceOf(user1.address)).to.equal(parseEther("1500"));
    await token.connect(user1).approve(user3.address, parseEther("500"));
    await token.connect(user3).transferFrom(user1.address, user3.address, parseEther("250"));
    expect(await token.balanceOf(user3.address)).to.equal(parseEther("250"));


    console.log("3. Setting lock");
    await token.connect(owner).addController(controller.address);
    await token.connect(controller).setLockTime(unlockTime);
    await expect(token.connect(user1).transfer(user2.address, parseEther("500"))).to.be.revertedWith("Transfer is temporarily locked");
    await expect(token.connect(user1).approve(user2.address, parseEther("500"))).to.be.revertedWith("Transfer is temporarily locked");
    await expect(token.connect(user3).transferFrom(user1.address, user3.address, parseEther("250"))).to.be.revertedWith("Transfer is temporarily locked");
    await token.connect(owner).addController(controller2.address);
    await token.connect(owner).transfer(controller2.address, parseEther("2000"));

    console.log("4. Setting controller");
    await token.connect(controller2).transfer(user2.address, parseEther("500"));
    expect(await token.balanceOf(controller2.address)).to.equal(parseEther("1500"));
    await token.connect(controller2).approve(user2.address, parseEther("500"));
    await token.connect(owner).addController(user2.address);
    await token.connect(user2).transferFrom(controller2.address, user3.address, parseEther("250"));
    expect(await token.balanceOf(user3.address)).to.equal(parseEther("500"));
    
    console.log("5. Unsetting lock");
    await ethers.provider.send("evm_increaseTime", [lockTime])
    await ethers.provider.send("evm_mine")
    await token.connect(owner).transfer(user4.address, parseEther("2000"));
    await token.connect(user4).transfer(user2.address, parseEther("500"))
    expect(await token.balanceOf(user4.address)).to.equal(parseEther("1500"));
    await token.connect(user4).approve(user3.address, parseEther("500"));
    await token.connect(user3).transferFrom(user4.address, user3.address, parseEther("250"));
    expect(await token.balanceOf(user3.address)).to.equal(parseEther("750"));

    // const controllerRole = keccak256("TOKEN_CONTROLLER").toString('hex');
    // console.log("Role in hash:", controllerRole);
    
  });
});
