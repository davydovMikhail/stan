const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");
const keccak256 = require("keccak256");


describe("Token", function () {
  it("Token", async function () {
    console.log("1. Contract creation and users");
    [owner, controller, user1, user2, user3] = await ethers.getSigners()
    const Token = await ethers.getContractFactory("TokenV3");
    const token = await Token.connect(owner).deploy("Token", "TKN", parseEther("10000"));
    await token.deployed();
    

    console.log("2. Checking view funcs");
    expect(await token.name()).to.equal("Token");
    expect(await token.symbol()).to.equal("TKN");
    expect(await token.decimals()).to.equal(18);
    expect(await token.getOwner()).to.equal(owner.address);

    console.log("3. Setting new owner");
    const controllerRole = keccak256("TOKEN_CONTROLLER").toString('hex');
    console.log("Role in hash:", controllerRole);
    await token.connect(owner).setNewOwner(user2.address);
    expect(await token.getOwner()).to.equal(user2.address);

    console.log("4. Adding new controller by AccessControl");
    await token.connect(owner).addController(controller.address);
    await token.connect(controller).setNewOwner(user3.address);
    expect(await token.getOwner()).to.equal(user3.address);

    console.log("5. Minting");
    // await expect(token.connect(user1).mint(user1.address, parseEther("2000"))).to.be.revertedWith("This function can only be called by the contract owner");

    await token.connect(owner).addController(user2.address);
    await token.connect(user2).mint(user2.address, parseEther("2000"));
    expect(await token.totalSupply()).to.equal(parseEther('12000'));
    expect(await token.balanceOf(user2.address)).to.equal(parseEther('2000'));

    console.log("6. Burning");
    // await expect(token.connect(user1).burn(owner.address ,parseEther("2000"))).to.be.revertedWith("This function can only be called by the contract owner");
    await token.connect(user2).burn(owner.address ,parseEther("2000"));
    expect(await token.totalSupply()).to.equal(parseEther('10000'));
    expect(await token.balanceOf(owner.address)).to.equal(parseEther('8000'));
    await token.connect(owner).removeController(user2.address);
    // await token.connect(user2).burn(owner.address ,parseEther("2000"));
  });
});
