const { task } = require("hardhat/config");
require("@nomiclabs/hardhat-waffle");
require('dotenv').config();

task("setNewOwner", "changing of owner")
    .addParam("owner", "new contract's owner")
    .setAction(async function (taskArgs, hre) {
        const token = await hre.ethers.getContractAt("TokenV2", process.env.ADDRESS);
        try {
            await token.setNewOwner(taskArgs.owner)
            console.log(`${taskArgs.owner} - this address is now the new owner of the contract`);
        } catch (e) {
            console.log('error',e)
        }
    });