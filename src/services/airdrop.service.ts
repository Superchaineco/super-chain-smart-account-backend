import { JsonRpcProvider } from 'ethers';
import { Contract } from 'ethers';
import { redisService } from './redis.service';
import {
  JSON_RPC_PROVIDER,
  SUNNY_AIRDROP_ABI,
  SUNNY_AIRDROP_ADDRESS,
} from '@/config/superChain/constants';

export class AirdropService {
  airdropContract: Contract;

  constructor() {
    this.airdropContract = new Contract(
      SUNNY_AIRDROP_ADDRESS,
      SUNNY_AIRDROP_ABI,
      new JsonRpcProvider(JSON_RPC_PROVIDER)
    );
  }

  public async getAirdropData(account: string): Promise<any> {
    const airdropData = await redisService.JSONGet(
      'airdrop-allowlist',
      account
    );
    return airdropData;
  }

  public async isAirdropClaimed(
    account: string,
    tokenAddress: string
  ): Promise<boolean> {
    return await this.airdropContract.isClaimed(account, tokenAddress, 0);
  }
}
