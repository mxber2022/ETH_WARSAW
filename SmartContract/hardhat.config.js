require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
/** @type import('hardhat/config').HardhatUserConfig */

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: "0.8.9",

  networks: {

    'mantle-testnet': {
      url: 'https://rpc.testnet.mantle.xyz',
      accounts: [PRIVATE_KEY],
    },

  },

  etherscan: {
    apiKey: {
      "mantle-testnet": "YourKEY",
    },

    customChains: [
      {
        network: "mantle-testnet",
        chainId: 5001,
        urls: {
          apiURL: "https://explorer.testnet.mantle.xyz/api",
          browserURL: '',
        },

      },
    ],

  },
}
