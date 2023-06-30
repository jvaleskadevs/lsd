import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  networks: {
    mumbai: {
      url: process.env.ALCHEMY_MUMBAI_URL,
      accounts: [ process.env.PK ]
    }
  },
  etherscan: {
    apiKey: {
      polygonMumbai: process.env.MUMBAI_SCAN
    }
  }
};

export default config;
