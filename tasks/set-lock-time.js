const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

task("setLockTime", "setting lock time")
    .setAction(async function (taskArgs, hre) {
        const token = await hre.ethers.getContractAt("TokenV3", process.env.ADDRESS);
        try {
            await token.setLockTime(process.env.TIMESTAMP)
            console.log(`${process.env.TIMESTAMP} - this timestamp is unlock time`);
        } catch (e) {
            console.log('error',e)
        }
    });