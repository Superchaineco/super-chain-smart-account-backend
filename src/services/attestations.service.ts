import { EAS__factory } from '@ethereum-attestation-service/eas-contracts/dist/typechain-types/factories/contracts/EAS__factory';
import {
  SchemaEncoder,
  SchemaRegistry,
} from '@ethereum-attestation-service/eas-sdk';
import { ethers, JsonRpcProvider, Wallet } from 'ethers';
import type { ResponseBadges } from './badges.service';
import { SBclient } from './supabase.service';
import {
  ATTESTATOR_SIGNER_PRIVATE_KEY,
  EAS_CONTRACT_ADDRESS,
  JSON_RPC_PROVIDER,
  SUPER_CHAIN_ATTESTATION_SCHEMA,
} from '../config/superChain/constants';
import { superChainAccountService } from './superChainAccount.service';

export class AttestationsService {
  private easContractAddress = EAS_CONTRACT_ADDRESS;
  private schemaString = '(uint256 badgeId, uint256 level)[] badges';
  private provider = new JsonRpcProvider(JSON_RPC_PROVIDER);
  private wallet = new Wallet(ATTESTATOR_SIGNER_PRIVATE_KEY, this.provider);
  private eas = EAS__factory.connect(this.easContractAddress, this.wallet);
  private schemaEncoder = new SchemaEncoder(this.schemaString);

  private supabase = SBclient;
  public async attest(
    account: string,
    // totalPoints: number,
    badges: ResponseBadges[],
    // badgeImages: string[],
    badgeUpdates: { badgeId: number; level: number }[]
  ) {

    const encodedData = this.schemaEncoder.encodeData([
      {
        name: 'badges',
        value: badgeUpdates,
        type: '(uint256,uint256)[]'
      },
    ]);


    try {
      // const isLevelUp = await superChainAccountService.getIsLevelUp(
      //   account,
      //   totalPoints
      // );
      const tx = await this.eas.attest({
        schema:
          SUPER_CHAIN_ATTESTATION_SCHEMA,
        data: {
          recipient: account,
          data: encodedData,
          expirationTime: BigInt(0), 
          value: BigInt(0),
          refUID: ethers.ZeroHash,
          revocable: true,
        },
      });
      const receipt = await tx.wait();
      return { hash: receipt?.hash };
    } catch (error: any) {
      console.error('Error attesting', error);
      throw new Error(error);
    }
  }

  // public async createSchema() {
  //   const schemaRegistryContractAddress =
  //     '0x0a7E2Ff54e76B8E6659aedc9103FB21c038050D0';
  //   const schemaRegistry = new SchemaRegistry(schemaRegistryContractAddress);
  //   schemaRegistry.connect(this.wallet);
  //   const transaction = await schemaRegistry.register({
  //     schema: this.schemaString,
  //   });
  //   const receipt =  await transaction.wait();
  //   return receipt;
  // }

  
  private async upsertAccountBadge(
    badge: ResponseBadges,
    account: string,
    timestamp: Date | null,
    blockNumber: number | null
  ) {
    const { data, error } = await this.supabase
      .from('accountbadges')
      .update({
        lastclaim: timestamp ? timestamp.toISOString() : null,
        lastclaimblock: blockNumber,
        lastclaimtier: badge.claimableTier,
      })
      .eq('badgeid', badge.id)
      .eq('account', account)
      .select();
    return { data, error };
  }
}
