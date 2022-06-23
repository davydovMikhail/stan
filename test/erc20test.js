const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");



describe("Token tests", function () {
  beforeEach(async() => {
    [owner, user1, user2, user3] = await ethers.getSigners()
    let TokenF = await ethers.getContractFactory("TokenV3")
    primaryTotalSupply = parseEther("10000")
    token = await TokenF.connect(owner).deploy("Token", "TKN", primaryTotalSupply)
  })

  it("constant checking", async function () {
    expect(await token.name()).to.equal("Token");
    expect(await token.symbol()).to.equal("TKN");
    expect(await token.decimals()).to.equal(18);
  });

  it("allowance, balanceOf and transferFrom", async function () {
    expect(await token.balanceOf(owner.address)).to.equal(primaryTotalSupply);
    expect(await token.allowance(owner.address, user1.address)).to.equal(0);
    const valueForApprove = parseEther("100")
    const valueForTransfer = parseEther("30")
    await token.connect(owner).approve(user1.address, valueForApprove)
    expect(await token.allowance(owner.address, user1.address)).to.equal(valueForApprove);
    // await expect(token.connect(user1).transferFrom(owner.address, user2.address, valueForTransfer.mul(10))).to.be.revertedWith("transferred amount exceeds the allowed")
    await token.connect(user1).transferFrom(owner.address, user2.address, valueForTransfer);
    expect(await token.balanceOf(user2.address)).to.equal(valueForTransfer);
    expect(await token.balanceOf(owner.address)).to.equal(primaryTotalSupply.sub(valueForTransfer));
    expect(await token.allowance(owner.address, user1.address)).to.equal(valueForApprove.sub(valueForTransfer));
  })

  it("increase, decrease Allowance", async function() {
    expect(await token.allowance(owner.address, user1.address)).to.equal(0);
    expect(await token.allowance(user2.address, user3.address)).to.equal(0);
    const valueForApprove1 = parseEther("100")
    const valueForApprove2 = parseEther("200")
    await token.connect(owner).approve(user1.address, valueForApprove1)
    await token.connect(user2).approve(user3.address, valueForApprove2)
    expect(await token.allowance(owner.address, user1.address)).to.equal(valueForApprove1);
    expect(await token.allowance(user2.address, user3.address)).to.equal(valueForApprove2);
    const valueForIncrease1 = parseEther("50")
    const valueForIncrease2 = parseEther("75")
    await token.connect(owner).increaseAllowance(user1.address, valueForIncrease1)
    await token.connect(user2).increaseAllowance(user3.address, valueForIncrease2)
    expect(await token.allowance(owner.address, user1.address)).to.equal(valueForApprove1.add(valueForIncrease1));
    expect(await token.allowance(user2.address, user3.address)).to.equal(valueForApprove2.add(valueForIncrease2));
    const valueForDecrease1 = parseEther("75")
    const valueForDecrease2 = parseEther("100")
    // await expect(token.connect(owner).decreaseAllowance(user1.address, valueForDecrease1.mul(10))).to.be.revertedWith("the subtracted value must be less than the current Allowance")
    await token.connect(owner).decreaseAllowance(user1.address, valueForDecrease1)
    await token.connect(user2).decreaseAllowance(user3.address, valueForDecrease2)
    expect(await token.allowance(owner.address, user1.address)).to.equal(valueForApprove1.add(valueForIncrease1).sub(valueForDecrease1));
    expect(await token.allowance(user2.address, user3.address)).to.equal(valueForApprove2.add(valueForIncrease2).sub(valueForDecrease2));
  })

  it("mint and burn", async function () {
    const valueForMint1 = parseEther("50")
    const valueForMint2 = parseEther("75")
    const valueForBurn1 = parseEther("20")
    const valueForBurn2 = parseEther("40")
    await token.connect(owner).mint(user1.address, valueForMint1)
    // await expect(token.connect(user1).mint(user2.address, valueForMint1)).to.be.revertedWith("this feature is only available to the owner of the contract")
    expect(await token.balanceOf(user1.address)).to.equal(valueForMint1);
    await token.connect(owner).mint(user2.address, valueForMint2)
    expect(await token.balanceOf(user2.address)).to.equal(valueForMint2);
    expect(await token.totalSupply()).to.equal(primaryTotalSupply.add(valueForMint1).add(valueForMint2));
    const balanceAnyUser = await token.balanceOf(user1.address)
    // await expect(token.connect(owner).burn(user1.address, balanceAnyUser.mul(2))).to.be.revertedWith("the withdrawn amount must be less than the balance of the specified address")
    await token.connect(owner).burn(user1.address, valueForBurn1)
    // await expect(token.connect(user1).burn(user2.address, valueForBurn1)).to.be.revertedWith("this feature is only available to the owner of the contract")
    expect(await token.balanceOf(user1.address)).to.equal(valueForMint1.sub(valueForBurn1));
    await token.connect(owner).burn(user2.address, valueForBurn2)
    expect(await token.balanceOf(user2.address)).to.equal(valueForMint2.sub(valueForBurn2));
  })

  it("transfer", async function () {
    const valueForRequire = parseEther("200")
    const valueForTransfer1 = parseEther("100")
    const valueForTransfer2 = parseEther("80")
    const valueForTransfer3 = parseEther("60")
    await token.connect(owner).transfer(user1.address, valueForTransfer1)
    expect(await token.balanceOf(owner.address)).to.equal(primaryTotalSupply.sub(valueForTransfer1));
    expect(await token.balanceOf(user1.address)).to.equal(valueForTransfer1);
    // await expect(token.connect(user1).transfer(user2.address, valueForRequire)).to.be.revertedWith("transfer amount must be equal or less than your balance")
    await token.connect(user1).transfer(user2.address, valueForTransfer2)
    expect(await token.balanceOf(user1.address)).to.equal(valueForTransfer1.sub(valueForTransfer2));
    expect(await token.balanceOf(user2.address)).to.equal(valueForTransfer2);
    // await expect(token.connect(user2).transfer(user3.address, valueForRequire)).to.be.revertedWith("transfer amount must be equal or less than your balance")
    await token.connect(user2).transfer(user3.address, valueForTransfer3)
    expect(await token.balanceOf(user2.address)).to.equal(valueForTransfer2.sub(valueForTransfer3));
    expect(await token.balanceOf(user3.address)).to.equal(valueForTransfer3);
  })
});