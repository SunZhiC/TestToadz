require('dotenv').config();
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import '@openzeppelin/hardhat-upgrades';
import { chains, ArbitrumSepolia, BaseSepolia, EthereumSepolia, BNBChainTestnet } from "@particle-network/chains";

const config: HardhatUserConfig = {
  solidity: "^0.8.24",
};

const hardhatAccounts = [process.env.PRIVATE_KEY]

module.exports = {
  networks: {
    hardhat: {
      ... {
        // Normal Config
        accounts: {
          accountsBalance: "10000000000000000000000000",
          //   mnemonic: MNEMONIC,
        },
        allowUnlimitedContractSize: true,
        chainId: 31337,
      },
    },
    sepolia: {
      url:
        getParticleRpc(EthereumSepolia.id),
      accounts: hardhatAccounts,
      chainId: EthereumSepolia.id,
    },
    baseSepolia: {
      url:
        getParticleRpc(BaseSepolia.id),
      accounts: hardhatAccounts,
      chainId: BaseSepolia.id,
    },
    arbitrumSepolia: {
      url:
        getParticleRpc(ArbitrumSepolia.id),
      accounts: hardhatAccounts,
      chainId: ArbitrumSepolia.id,
    },
    bnbTestnet: {
      url:
        getParticleRpc(BNBChainTestnet.id),
      accounts: hardhatAccounts,
      chainId: BNBChainTestnet.id,
    }
  },
  etherscan: {
    apiKey: {
      sepolia: process.env.ETHEREUM_ETHERSCAN_API_KEY,
      baseSepolia: process.env.BASE_ETHERSCAN_API_KEY,
      arbitrumSepolia: process.env.ARBITRUM_ETHERSCAN_API_KEY,
      bnbTestnet: process.env.BNB_ETHERSCAN_API_KEY
    },
    customChains: [
      {
        network: "sepolia",
        chainId: EthereumSepolia.id,
        urls: {
          apiURL: "https://api-sepolia.etherscan.io/api",
          browserURL: "https://sepolia.etherscan.io",
        }
      },
      {
        network: "baseSepolia",
        chainId: BaseSepolia.id,
        urls: {
          apiURL: "https://api-sepolia.basescan.org/api",
          browserURL: "https://sepolia.basescan.org",
        }
      },
      {
        network: "arbitrumSepolia",
        chainId: ArbitrumSepolia.id,
        urls: {
          apiURL: "https://api-sepolia.arbiscan.io/api",
          browserURL: "https://sepolia.arbiscan.io/",
        }
      },
      {
        network: "bnbTestnet",
        chainId: BNBChainTestnet.id,
        urls: {
          apiURL: "https://api-testnet.bscscan.com/api",
          browserURL: "https://testnet.bscscan.com/",
        }
      }
    ]
  },
  solidity: {
    compilers: [
      {
        version: "0.8.24",
        settings: { optimizer: { enabled: true, runs: 200 } },
      }
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 40000
  }

}

function getParticleRpc(chainId: number): string {
  const projectId = process.env.PARTCLE_PROJECT_ID as string;
  const clientKey = process.env.PARTCLE_CLIENT_KEY as string;
  return chains.getParticleNode(chainId, projectId, clientKey)
}

export default config;

