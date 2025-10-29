import dotenv from 'dotenv';
dotenv.config();

export enum ENVIRONMENTS {
  development = 'development',
  production = 'production',
  staging = 'staging',
}

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // requerido en Railway
  },
});

export const ENV = Object.values(ENVIRONMENTS).includes(
  process.env.NODE_ENV as ENVIRONMENTS
)
  ? (process.env.NODE_ENV as ENVIRONMENTS)
  : ENVIRONMENTS.development;

const config = {
  //   development: {
  //     SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS:
  //       "0x1Ee397850c3CA629d965453B3cF102E9A8806Ded",
  //     SUPER_CHAIN_ATTESTATION_SCHEMA:
  //       "0xb77b597c6b8404139df340a738e9252ff7e758564562d34694ebfd8270270865",
  //     EAS_CONTRACT_ADDRESS: "0x4200000000000000000000000000000000000021",
  //     JSON_RPC_PROVIDER: process.env.JSON_RPC_PROVIDER,
  //     ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  //     DOMAIN: process.env.DOMAIN,//"http://localhost:3000",
  //     REDIS: process.env.REDIS_PUBLIC_URL,
  //     SAFE_ADDRESS: "0x54efe9c4d7D91E2690f257A7855AAD4b21e20745"
  //   },
  //   production: {
  SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS:
    process.env.SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS, //    "0x1Ee397850c3CA629d965453B3cF102E9A8806Ded",
  SUPER_CHAIN_ATTESTATION_SCHEMA: process.env.SUPER_CHAIN_ATTESTATION_SCHEMA, //      "0xb77b597c6b8404139df340a738e9252ff7e758564562d34694ebfd8270270865",
  EAS_CONTRACT_ADDRESS: process.env.EAS_CONTRACT_ADDRESS, // "0x4200000000000000000000000000000000000021",
  JSON_RPC_PROVIDER: process.env.JSON_RPC_PROVIDER,
  ETHERSCAN_API_KEY: process.env.ETHERSCAN_API_KEY,
  BADGES_RPC_URL: process.env.BADGES_RPC_URL,
  DOMAIN: process.env.DOMAIN, // "https://account.superchain.eco",
  REDIS: process.env.REDIS_URL,
  SUNNY_AIRDROP_ADDRESS: '0x89622D291439Bf4deD4264169AD4530363a023Cb',

  SUNNY_TOKEN_ADDRESS: '0x2ee45205567ae257e9a21755d4db02afacb555e4',
  SAFE_ADDRESS: process.env.SAFE_ADDRESS, //"0x54efe9c4d7D91E2690f257A7855AAD4b21e20745"
}; //,
// }[ENV];

import SuperChainModuleABI from './abi/SuperChainModule.json';
import SunnyAirdropABI from './abi/SunnyAirdrop.json';
import { Pool } from 'pg';
import RedeemPerkABI from './abi/RedeemPerk.json';
import SA_AirdropABI from './abi/SA_Airdrop.json';
export const SUPER_CHAIN_MODULE_ABI = SuperChainModuleABI;
export const SUNNY_AIRDROP_ABI = SunnyAirdropABI;
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
export const DOMAIN = config.DOMAIN.split(',').map((origin) => origin.trim());
export const SESSION_SECRET = process.env.SESSION_SECRET!;
export const DUNE_API_KEY = process.env.DUNE_API_KEY;
export const SAFE_ADDRESS = config.SAFE_ADDRESS;
export const PIMLICO_API_KEY = process.env.PIMLICO_API_KEY;
export const SUNNY_TOKEN_ADDRESS = config.SUNNY_TOKEN_ADDRESS;
export const SUNNY_AIRDROP_ADDRESS = config.SUNNY_AIRDROP_ADDRESS;
export const SUBGRAPH_URI = process.env.SUBGRAPH_URI!;
export const ROUTESCAN_API_KEY = process.env.ROUTESCAN_API_KEY!;
export const BADGES_RPC_URL = config.BADGES_RPC_URL;
export const INK_BLOCKSCOUT_API_KEY = process.env.INK_BLOCKSCOUT_API_KEY!;
export const OP_BLOCKSCOUT_API_KEY = process.env.OP_BLOCKSCOUT_API_KEY!;
export const BASE_BLOCKSCOUT_API_KEY = process.env.BASE_BLOCKSCOUT_API_KEY!;
export const SONEIUM_BLOCKSCOUT_API_KEY =
  process.env.SONEIUM_BLOCKSCOUT_API_KEY!;
export const UNICHAIN_BLOCKSCOUT_API_URL =
  process.env.UNICHAIN_BLOCKSCOUT_API_URL!;
export const RPC_PROVIDER = process.env.RPC_PROVIDER!;
export const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;
export const TURNSTILE_SITE_KEY = process.env.TURNSTILE_SITE_KEY;

export const TURNSTILE_RAFFLE_SECRET_KEY =
  process.env.TURNSTILE_RAFFLE_SECRET_KEY;
export const TURNSTILE_RAFFLE_SITE_KEY = process.env.TURNSTILE_RAFFLE_SITE_KEY;

export const WORLD_ID_APP_ID = process.env.WORLD_ID_APP_ID ?? '';
export const WORLD_ID_ACTION = process.env.WORLD_ID_ACTION ?? '';
export const WORLD_ID_SIGNAL = process.env.WORLD_ID_SIGNAL ?? '';
export const DATABASE_URL = process.env.DATABASE_URL ?? '';

export const WORLD_ID_APP_ID = process.env.WORLD_ID_APP_ID ?? ''
export const WORLD_ID_ACTION = process.env.WORLD_ID_ACTION ?? ''
export const WORLD_ID_SIGNAL = process.env.WORLD_ID_SIGNAL ?? ''
export const DATABASE_URL = process.env.DATABASE_URL ?? ''
export const ECO_ACCOUNTS_PERKS_ADDRESS = process.env.ECO_ACCOUNTS_PERKS_ADDRESS;
export const REDEEM_PERK_ABI = RedeemPerkABI;
export const SUPERCHAIN_ECO_AIRDROP_ADDRESS =  process.env.SUPERCHAIN_ECO_AIRDROP_ADDRESS;
export const SUPERCHAIN_ECO_AIRDROP_ABI = SA_AirdropABI;