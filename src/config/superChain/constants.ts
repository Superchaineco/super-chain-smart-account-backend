import dotenv from 'dotenv';
dotenv.config();

enum ENVIRONEMNTS {
  development = 'development',
  production = 'production'
}

const ENV = process.env.NODE_ENV
import SuperChainModuleABI from './abi/SuperChainModule.json';
export const SUPER_CHAIN_MODULE_ABI = SuperChainModuleABI;
export const SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS = ENV === ENVIRONEMNTS.development ? '0xe847Aa5c25eC18571511C7ADE94a3Aee85668268' : ''
export const SUPER_CHAIN_ATTESTATION_SCHEMA = ENV === ENVIRONEMNTS.development ? '0x9305597ae2fecd5cedf36d79620e39816ed51d6d35cefa3e720104041add015c' : ''
export const EAS_CONTRACT_ADDRESS = ENV === ENVIRONEMNTS.development ?
  '0xC2679fBD37d54388Ce493F1DB75320D236e1815e' : '';
export const ATTESTATOR_SIGNER_PRIVATE_KEY =
  process.env.ATTESTATOR_SIGNER_PRIVATE_KEY!;


export const JSON_RPC_PROVIDER = ENV === ENVIRONEMNTS.development ? process.env.JSON_RPC_PROVIDER_TESTNET : process.env.JSON_RPC_PROVIDER
export const ETHERSCAN_API_KEY = ENV === ENVIRONEMNTS.development ? process.env.ETHERSCAN_API_KEY_TESTNET! : process.env.ETHERSCAN_API_KEY!