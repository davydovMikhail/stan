const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-web3");

task("mint", "mint of tokens")
    .addParam("to", "recipient of tokens")
    .addParam("amount", "amount of mint")
    .setAction(async function (taskArgs, hre) {
        const token = await hre.ethers.getContractAt("Token", process.env.ADDR_TEST2);
        try {
            await token.mint(taskArgs.to, web3.utils.toWei(taskArgs.amount, 'ether'))
            console.log(`you minted ${taskArgs.amount} tokens at ${taskArgs.to}`);
        } catch (e) {
            console.log('error',e)
        }
    });