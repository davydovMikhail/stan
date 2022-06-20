const { expect } = require("chai");
const { ethers } = require("hardhat");
const { parseEther } = require("ethers/lib/utils");

describe("Token", function () {
  it("Token", async function () {
    [owner, user1, user2, user3] = await ethers.getSigners()
    const Token = await ethers.getContractFactory("Token");
    const token = await Token.connect(owner).deploy("Token", "TKN", parseEther("10000"));
    await token.deployed();
    expect(await token.name()).to.equal("Token");
    expect(await token.symbol()).to.equal("TKN");
    expect(await token.decimals()).to.equal(18);
    expect(await token.getOwner()).to.equal(owner.address);
    await expect(token.connect(user1).setNewOwner(user2.address)).to.be.revertedWith("This function can only be called by the contract owner");
    await token.connect(owner).setNewOwner(user2.address);
    expect(await token.getOwner()).to.equal(user2.address);
    await expect(token.connect(user1).mint(user1.address, parseEther("2000"))).to.be.revertedWith("This function can only be called by the contract owner");
    await token.connect(user2).mint(user2.address, parseEther("2000"));
    expect(await token.totalSupply()).to.equal(parseEther('12000'));
    expect(await token.balanceOf(user2.address)).to.equal(parseEther('2000'));
    await expect(token.connect(user1).burn(owner.address ,parseEther("2000"))).to.be.revertedWith("This function can only be called by the contract owner");
    await token.connect(user2).burn(owner.address ,parseEther("2000"));
    expect(await token.totalSupply()).to.equal(parseEther('10000'));
    expect(await token.balanceOf(owner.address)).to.equal(parseEther('8000'));
  });
});
