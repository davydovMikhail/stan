const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();
require("@nomiclabs/hardhat-web3");

task("transfer", "transfer of tokens")
    .addParam("to", "recipient of tokens")
    .addParam("amount", "transfer amount")
    .setAction(async function (taskArgs, hre) {
        const token = await hre.ethers.getContractAt("Token", process.env.ADDR_CONTRACT);
        try {
            await token.transfer(taskArgs.to, web3.utils.toWei(taskArgs.amount, 'ether'))
            console.log(`you transferred ${taskArgs.amount} tokens to ${taskArgs.to}`);
        } catch (e) {
            console.log('error',e)
        }
    });