import { EAS__factory } from '@ethereum-attestation-service/eas-contracts/dist/typechain-types/factories/contracts/EAS__factory';

import { ethers, JsonRpcProvider, Wallet } from 'ethers';
import { SchemaEncoder, SchemaRegistry } from '@ethereum-attestation-service/eas-sdk'
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

  public async attest(
    account: string,
    totalPoints: number,
    badges: any[],
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
        const isLevelUp = await superChainAccountService.getIsLevelUp(
          account,
          totalPoints
        );
        const tx = await this.eas.attest({
          schema:
            '0x122c3c6df91fd195cf85905d956f092bac19fc91fa1a96e322af20a953dc0046',
          data: {
            recipient: account,
            data: encodedData,
            expirationTime: BigInt(0), 
            value: BigInt(0),
            refUID: ethers.ZeroHash,
            revocable: false,
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
    //     resolverAddress:'0xadc9885E6774CD898DC418BE3E7EAf8C71CA1735',
    //     revocable: false


    //   });
    //   const receipt =  await transaction.wait();
    //   return receipt;
    // }


    // private async upsertAccountBadge(
    //   badge: ResponseBadges,
    //   account: string,
    //   timestamp: Date | null,
    //   blockNumber: number | null
    // ) {
    //   const { data, error } = await this.supabase
    //     .from('accountbadges')
    //     .update({
    //       lastclaim: timestamp ? timestamp.toISOString() : null,
    //       lastclaimblock: blockNumber,
    //       lastclaimtier: badge.claimableTier,
    //     })
    //     .eq('badgeid', badge.id)
    //     .eq('account', account)
    //     .select();
    //   return { data, error };
    // }
  }
