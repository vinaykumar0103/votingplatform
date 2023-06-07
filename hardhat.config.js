require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const INFURA_API_KEY = process.env.INFURA_API_KEY;
const LINEA_PRIVATE_KEY = process.env.LINEA_PRIVATE_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    linea: {
      url: `https://linea-goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [LINEA_PRIVATE_KEY]
    }
  }
};
