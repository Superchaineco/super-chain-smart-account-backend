import { EAS__factory } from '@ethereum-attestation-service/eas-contracts/dist/typechain-types/factories/contracts/EAS__factory';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { ethers, JsonRpcProvider, Wallet } from 'ethers';
import type { ResponseBadges } from './badges.service';
import { SBclient } from './supabase.service';
import {
  ATTESTATOR_SIGNER_PRIVATE_KEY,
  EAS_CONTRACT_ADDRESS,
  JSON_RPC_PROVIDER,
  SUPER_CHAIN_ATTESTATION_SCHEMA,
} from '../config/superChain/constants';

export class AttestationsService {
  private easContractAddress = EAS_CONTRACT_ADDRESS;
  private schemaString = 'uint256 SuperChainPoints';
  private provider = new JsonRpcProvider(JSON_RPC_PROVIDER);
  private wallet = new Wallet(ATTESTATOR_SIGNER_PRIVATE_KEY, this.provider);
  private eas = EAS__factory.connect(this.easContractAddress, this.wallet);
  private schemaEncoder = new SchemaEncoder(this.schemaString);

  private supabase = SBclient;
  public async attest(
    account: string,
    totalPoints: number,
    badges: ResponseBadges[],
    // This must be erased
    _account: string
  ) {
    const encodedData = this.schemaEncoder.encodeData([
      { name: 'SuperChainPoints', value: totalPoints, type: 'uint256' },
    ]);
    console.log({ totalPoints });

    for (const badge of badges) {
      const { data: badgeData, error: badgeError } = await this.supabase
        .from('badges')
        .select('*')
        .eq('id', badge.id)
        .single();

      if (badgeError || !badgeData) {
        console.error(
          `Error fetching badge data for badge ID ${badge.id}:`,
          badgeError
        );
        throw new Error(`Badge data fetch error for badge ID ${badge.id}`);
      }

      let updateResult;
      if (badgeData.dataorigin === 'onChain') {
        const blockNumber = await this.provider.getBlockNumber();
        updateResult = await this.upsertAccountBadge(
          badge,
          _account,
          null,
          blockNumber
        );
      } else {
        const timestamp = new Date();
        updateResult = await this.upsertAccountBadge(
          badge,
          _account,
          timestamp,
          null
        );
      }

      if (updateResult.error) {
        console.error(
          `Error updating AccountBadges for badge ID ${badge.id}:`,
          updateResult.error
        );
        throw new Error(`AccountBadges update error for badge ID ${badge.id}`);
      }
    }

    try {
      // const tx = await this.eas.attest({
      //   schema: SUPER_CHAIN_ATTESTATION_SCHEMA,
      //   data: {
      //     recipient: account,
      //     expirationTime: BigInt(0),
      //     refUID: ethers.ZeroHash,
      //     revocable: false,
      //     data: encodedData,
      //     value: BigInt(0),
      //   },
      // });

      // const receipt = await tx.wait();
      // console.log(`Attestation successful. Transaction hash: ${receipt?.hash}`);
      return '0x';
    } catch (error: any) {
      console.error('Error attesting', error);
      throw new Error(error);
    }
  }

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
