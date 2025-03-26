import dotenv from "dotenv";
dotenv.config();

export enum ENVIRONMENTS {
  development = "development",
  production = "production",
}

export const ENV =
  (process.env.NODE_ENV as ENVIRONMENTS) || ENVIRONMENTS.development;

const config = {
  development: {
    SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS:
      "0xD783b279A7DbF2065125adB40259aA87319da1Eb",
    SUPER_CHAIN_ATTESTATION_SCHEMA:
      "0xab97e616017629cf4fd368aa4f12178b2e3f63e9432aea854d4d05e009571f85",
    EAS_CONTRACT_ADDRESS: "0x4200000000000000000000000000000000000021",
    JSON_RPC_PROVIDER: process.env.JSON_RPC_PROVIDER,//"https://optimism-mainnet.infura.io/v3/64c04ffe8acb4177ba78d32779f2e0c4",
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    DOMAIN: "http://localhost:3000",
    REDIS: process.env.REDIS_PUBLIC_URL,
    SAFE_ADDRESS: "0x54efe9c4d7D91E2690f257A7855AAD4b21e20745"
  },
  production: {
    SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS:
      "0x1Ee397850c3CA629d965453B3cF102E9A8806Ded",
    SUPER_CHAIN_ATTESTATION_SCHEMA:
      "0xb77b597c6b8404139df340a738e9252ff7e758564562d34694ebfd8270270865",
    EAS_CONTRACT_ADDRESS: "0x4200000000000000000000000000000000000021",
    JSON_RPC_PROVIDER: process.env.JSON_RPC_PROVIDER,
    ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
    DOMAIN: "https://account.superchain.eco",
    REDIS: process.env.REDIS_URL,
    SAFE_ADDRESS: "0x54efe9c4d7D91E2690f257A7855AAD4b21e20745"
  },
}[ENV];

import SuperChainModuleABI from "./abi/SuperChainModule.json";
export const SUPER_CHAIN_MODULE_ABI = SuperChainModuleABI;
export const SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS =
  config.SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS;
export const SUPER_CHAIN_ATTESTATION_SCHEMA =
  config.SUPER_CHAIN_ATTESTATION_SCHEMA;
export const EAS_CONTRACT_ADDRESS = config.EAS_CONTRACT_ADDRESS;
export const ATTESTATOR_SIGNER_PRIVATE_KEY =
  process.env.ATTESTATOR_SIGNER_PRIVATE_KEY!;
export const JSON_RPC_PROVIDER = config.JSON_RPC_PROVIDER!;
export const ETHERSCAN_API_KEY = config.ETHERSCAN_API_KEY!;
export const REDIS_URL = config.REDIS;
export const PRIVY_APP_ID = process.env.PRIVY_APP_ID!;
export const PRIVY_APP_SECRET = process.env.PRIVY_APP_SECRET!;
export const COINGECKO_API_KEY = process.env.COINGECKO_API_KEY!;
export const GELATO_API_KEY = process.env.GELATO_API_KEY!;
export const SUBGRAPH_API_KEY = process.env.SUBGRAPH_API_KEY!;
export const WC_PROJECT_ID = process.env.WC_PROJECT_ID!;
export const DOMAIN = config.DOMAIN;
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const DUNE_API_KEY = process.env.DUNE_API_KEY!;
export const SAFE_ADDRESS =  config.SAFE_ADDRESS
export const PIMLICO_API_KEY =  process.env.PIMLICO_API_KEY
