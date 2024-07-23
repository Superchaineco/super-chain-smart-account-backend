import dotenv from 'dotenv';
dotenv.config();

import SuperChainModuleABI from './abi/SuperChainModule.json';
export const SUPER_CHAIN_MODULE_ABI = SuperChainModuleABI;
export const SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS = '0xe847Aa5c25eC18571511C7ADE94a3Aee85668268'
export const SUPER_CHAIN_ATTESTATION_SCHEMA = '0x9305597ae2fecd5cedf36d79620e39816ed51d6d35cefa3e720104041add015c'
export const JSON_RPC_PROVIDER = process.env.JSON_RPC_PROVIDER

export const EAS_CONTRACT_ADDRESS =
  '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
export const ATTESTATOR_SIGNER_PRIVATE_KEY =
  process.env.ATTESTATOR_SIGNER_PRIVATE_KEY!;


export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY!