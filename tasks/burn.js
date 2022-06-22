const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-web3");

task("burn", "burn of tokens")
    .addParam("to", "recipient of tokens")
    .addParam("amount", "amount of mint")
    .setAction(async function (taskArgs, hre) {
        const token = await hre.ethers.getContractAt("TokenV2", process.env.ADDRESS);
        try {
            await token.burn(taskArgs.to, web3.utils.toWei(taskArgs.amount, 'ether'))
            console.log(`you burned ${taskArgs.amount} tokens from ${taskArgs.to}`);
        } catch (e) {
            console.log('error',e)
        }
    });