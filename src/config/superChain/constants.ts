import dotenv from 'dotenv';
dotenv.config();

import SuperChainModuleABI from './abi/SuperChainModule.json';
export const SUPER_CHAIN_MODULE_ABI = SuperChainModuleABI;
export const SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS = '0x43Be40007aD9f448a037E09c6eE4Da980e5afb1f'
export const SUPER_CHAIN_ATTESTATION_SCHEMA = '0x52829c57e8f80d95483155567c5bb32f0f3aadf694a804791ab784d01b7211bc'
export const JSON_RPC_PROVIDER = process.env.JSON_RPC_PROVIDER

export const EAS_CONTRACT_ADDRESS =
  '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
export const ATTESTATOR_SIGNER_PRIVATE_KEY =
  process.env.ATTESTATOR_SIGNER_PRIVATE_KEY!;


export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!