import dotenv from 'dotenv';
dotenv.config();

enum ENVIRONMENTS {
  development = 'development',
  production = 'production'
}

const ENV = process.env.NODE_ENV as ENVIRONMENTS || ENVIRONMENTS.development;

const requiredEnvVars = [
  'ATTESTATOR_SIGNER_PRIVATE_KEY',
  'JSON_RPC_PROVIDER_TESTNET',
  'JSON_RPC_PROVIDER',
  'ETHERSCAN_API_KEY_TESTNET',
  'ETHERSCAN_API_KEY'
];

requiredEnvVars.forEach((varName) => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

const config = {
  development: {
    SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS: '0xe847Aa5c25eC18571511C7ADE94a3Aee85668268',
    SUPER_CHAIN_ATTESTATION_SCHEMA: '0x9305597ae2fecd5cedf36d79620e39816ed51d6d35cefa3e720104041add015c',
    EAS_CONTRACT_ADDRESS: '0xC2679fBD37d54388Ce493F1DB75320D236e1815e',
    JSON_RPC_PROVIDER: process.env.JSON_RPC_PROVIDER_TESTNET,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY_TESTNET
  },
  production: {
    SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS: '',
    SUPER_CHAIN_ATTESTATION_SCHEMA: '',
    EAS_CONTRACT_ADDRESS: '',
    JSON_RPC_PROVIDER: process.env.JSON_RPC_PROVIDER,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY
  }
}[ENV];

import SuperChainModuleABI from './abi/SuperChainModule.json';
export const SUPER_CHAIN_MODULE_ABI = SuperChainModuleABI;
export const SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS = config.SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS;
export const SUPER_CHAIN_ATTESTATION_SCHEMA = config.SUPER_CHAIN_ATTESTATION_SCHEMA;
export const EAS_CONTRACT_ADDRESS = config.EAS_CONTRACT_ADDRESS;
export const ATTESTATOR_SIGNER_PRIVATE_KEY = process.env.ATTESTATOR_SIGNER_PRIVATE_KEY!;
export const JSON_RPC_PROVIDER = config.JSON_RPC_PROVIDER!;
export const ETHERSCAN_API_KEY = config.ETHERSCAN_API_KEY!;