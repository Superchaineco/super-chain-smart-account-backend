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
    const ethAdapter = new EthersAdapter({
      ethers: ethers,
      signerOrProvider: new JsonRpcProvider(JSON_RPC_PROVIDER),
    });
    const protocolKit = await Safe.create({ ethAdapter, safeAddress: address });
    return await protocolKit.getOwners();
  }
  async getIsLevelUp(recipent: string, points: number): Promise<boolean> {
    return await this.superChainAccount.simulateIncrementSuperChainPoints(points, recipent)
  }
}
const superChainAccountService = new SuperChainAccountService();
export { superChainAccountService };
