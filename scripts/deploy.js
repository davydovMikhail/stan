require("@nomiclabs/hardhat-web3");

async function main() {

  const Token = await ethers.getContractFactory("Token");
  const totalSupply = web3.utils.toWei('10000', 'ether');
  const name = "Stan Token 2";
  const symbol = "STT2";
  const token = await Token.deploy(name, symbol, totalSupply);

  console.log("Token address:", token.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
