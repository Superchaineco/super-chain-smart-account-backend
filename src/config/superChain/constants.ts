import dotenv from 'dotenv';
dotenv.config();

import SuperChainModuleABI from './abi/SuperChainModule.json';
export const SUPER_CHAIN_MODULE_ABI = SuperChainModuleABI;
export const SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS = '0x47BE9A404B531A224c2118bc10a007350e586560'
export const SUPER_CHAIN_ATTESTATION_SCHEMA = '0xce12246c39b440c01a6fefb334a235bd1f04673b0279d5055d98f5869246fd1b'
export const JSON_RPC_PROVIDER = process.env.JSON_RPC_PROVIDER

export const EAS_CONTRACT_ADDRESS =
  '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
export const ATTESTATOR_SIGNER_PRIVATE_KEY =
  process.env.ATTESTATOR_SIGNER_PRIVATE_KEY!;

