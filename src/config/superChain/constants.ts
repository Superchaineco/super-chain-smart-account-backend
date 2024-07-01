import dotenv from 'dotenv';
dotenv.config();

import SuperChainSetupABI from './abi/SuperChainSetup.json';
import SuperChainModuleABI from './abi/SuperChainModule.json';
export const SUPER_CHAIN_MODULE_ABI = SuperChainModuleABI;
export const SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS = '0x20e671bB7285AECA2f7d318cd4F5Aa61041A2e5F'
export const SUPER_CHAIN_ATTESTATION_SCHEMA = '0x0c3f4c1ad0bc7048f405838bd315e8e64c2ab4cd71d06209e47d9d952da66b3a'
export const JSON_RPC_PROVIDER = process.env.JSON_RPC_PROVIDER

export const EAS_CONTRACT_ADDRESS =
  '0xC2679fBD37d54388Ce493F1DB75320D236e1815e';
export const ATTESTATOR_SIGNER_PRIVATE_KEY =
  process.env.ATTESTATOR_SIGNER_PRIVATE_KEY!;

