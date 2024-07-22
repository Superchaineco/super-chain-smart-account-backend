import { Contract, ethers, JsonRpcProvider } from 'ethers';
import {
  JSON_RPC_PROVIDER,
  SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS,
  SUPER_CHAIN_MODULE_ABI,
} from '../config/superChain/constants';
import Safe, { EthersAdapter } from '@safe-global/protocol-kit';

export class SuperChainAccountService {
  superChainAccount: Contract;

  constructor() {
    this.superChainAccount = new Contract(
      SUPER_CHAIN_ACCOUNT_MODULE_ADDRESS,
      SUPER_CHAIN_MODULE_ABI,
      new JsonRpcProvider(JSON_RPC_PROVIDER)
    );
  }

  async getEOAS(address: string): Promise<string[]> {
    try {
      const ethAdapter = new EthersAdapter({
        ethers: ethers,
        signerOrProvider: new JsonRpcProvider(JSON_RPC_PROVIDER),
      });
      const protocolKit = await Safe.create({ ethAdapter, safeAddress: address });
      return await protocolKit.getOwners();
    }
    catch (error) {
      console.error(error);
      throw new Error('Error getting EOAS');
    }
  }
  async getIsLevelUp(recipent: string, points: number): Promise<boolean> {
    return await this.superChainAccount.simulateIncrementSuperChainPoints(points, recipent)
  }
  async getSuperChainSmartAccount(address: string): Promise<string> {
    console.debug({address})
    const response = await this.superChainAccount.getSuperChainAccount(address);
    console.debug({ response })
    return response
  }



}
const superChainAccountService = new SuperChainAccountService();
export { superChainAccountService };
