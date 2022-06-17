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
  });
});
