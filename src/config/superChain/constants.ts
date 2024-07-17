import dotenv from 'dotenv';
dotenv.config();

import SuperChainModuleABI from './abi/SuperChainModule.json';
export const SUPER_CHAIN_MODULE_ABI = SuperChainModuleABI;
export const SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS = '0xBEa05d948A8270Fee613297E7FaCBaD6352b260f'
export const SUPER_CHAIN_ATTESTATION_SCHEMA = '0x1717cbf6250052bec43fcb81da7a6f597e5611c5d52b3b28cd8cd00da70733d4'
export const JSON_RPC_PROVIDER = process.env.JSON_RPC_PROVIDER

export const EAS_CONTRACT_ADDRESS =
  '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
export const ATTESTATOR_SIGNER_PRIVATE_KEY =
  process.env.ATTESTATOR_SIGNER_PRIVATE_KEY!;

