const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

task("setLock", "Setting lock on transfer")
    .setAction(async function (taskArgs, hre) {
        const token = await hre.ethers.getContractAt("TokenV2", process.env.ADDRESS);
        try {
            await token.setLock()
            console.log("Done");
        } catch (e) {
            console.log('error',e)
        }
    });