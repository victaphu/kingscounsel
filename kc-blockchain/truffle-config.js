const HDWalletProvider = require('@truffle/hdwallet-provider');
require("dotenv").config();
const { INFURA_API_KEY, PRIVATE_KEY, ETHERSCAN_API_KEY } = process.env;
module.exports = {
  networks: {
    development: {
     host: "127.0.0.1",
     port: 8545,
     network_id: "*"
    },
    dashboard: {
    },
    linea_testnet: {
      provider: () => {
        return new HDWalletProvider({ privateKeys: [PRIVATE_KEY], providerOrUrl: `https://linea-goerli.infura.io/v3/${INFURA_API_KEY}`})
      },
      network_id: "59140"
    },
    linea_mainnet: {
      provider: () => { 
        return new HDWalletProvider({ privateKeys: [PRIVATE_KEY], providerOrUrl: `https://linea-mainnet.infura.io/v3/${INFURA_API_KEY}`})
      },
      network_id: "59144",
    },
    polygon_mainnet: {
      provider: () => { 
        return new HDWalletProvider({ privateKeys: [PRIVATE_KEY], providerOrUrl: `https://polygon-mainnet.infura.io/v3/${INFURA_API_KEY}`})
      },
      network_id: "137",
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true
    }
  },
  api_keys: {
    etherscan: ETHERSCAN_API_KEY
  },
  compilers: {
    solc: {
      version: "0.8.13",
    }
  },
  db: {
    enabled: false,
    host: "127.0.0.1",
  },
  plugins: ['truffle-plugin-verify']
};
