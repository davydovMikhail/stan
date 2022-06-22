const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

task("removeController", "removing controller")
    .addParam("address", "controller's address")
    .setAction(async function (taskArgs, hre) {
        const token = await hre.ethers.getContractAt("TokenV2", process.env.ADDRESS);
        try {
            await token.removeController(taskArgs.address);
            console.log("Done");
        } catch (e) {
            console.log('error',e)
        }
    });