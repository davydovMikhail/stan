require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");

// const { API_URL, PRIVATE_KEY } = process.env;


module.exports = {
  solidity: "0.8.4",
  networks: {
    // bsctestnet: {
    //   url: "https://data-seed-prebsc-2-s2.binance.org:8545/",
    //   chainId: 97,
    //   accounts: [`0x${PRIVATE_KEY}`]
    // },

    // bscmainnet: {
    //   url: "https://bsc-dataseed.binance.org/",
    //   chainId: 56,
    //   accounts: [`0x${PRIVATE_KEY}`]
    // }
  }
};
