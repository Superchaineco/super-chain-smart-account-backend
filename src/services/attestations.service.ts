import { EAS__factory } from '@ethereum-attestation-service/eas-contracts/dist/typechain-types/factories/contracts/EAS__factory';

import { ethers, JsonRpcProvider, Wallet, ZeroAddress } from 'ethers';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import {
  ATTESTATOR_SIGNER_PRIVATE_KEY,
  EAS_CONTRACT_ADDRESS,
  JSON_RPC_PROVIDER,
  SUPER_CHAIN_ATTESTATION_SCHEMA,
} from '../config/superChain/constants';
import { superChainAccountService } from './superChainAccount.service';
import { redisService } from './redis.service';
import { ResponseBadge } from './badges/badges.service';

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
    badges: ResponseBadge[],
    badgeUpdates: { badgeId: number; level: number; points: number }[]
  ) {
    const encodedData = this.schemaEncoder.encodeData([
      {
        name: 'badges',
        value: badgeUpdates,
        type: '(uint256,uint256)[]',
      },
    ]);

    try {
      const isLevelUp = await superChainAccountService.getIsLevelUp(
        account,
        totalPoints
      );

      const tx = await this.eas.attest({
        schema: SUPER_CHAIN_ATTESTATION_SCHEMA,
        data: {
          recipient: account,
          data: encodedData,
          expirationTime: BigInt(0),
          value: BigInt(0),
          refUID: ethers.ZeroHash,
          revocable: false,
        },
      });
      const badgeImages = Array.from(
        new Set(
          badges.flatMap((badge) =>
            badgeUpdates
              .filter((update) => badge.badgeId === update.badgeId)
              .map(
                (update) =>
                  badge.badgeTiers.find(
                    (tier) => Number(tier.tier) === Number(update.level)
                  )?.metadata?.['2DImage']
              )
              .filter((image) => image)
          )
        )
      );
      const receipt = await tx.wait();

      await this.claimBadgesOptimistically(account, badgeUpdates);

      return {
        hash: receipt?.hash,
        isLevelUp,
        badgeImages,
        totalPoints,
        badgeUpdates,
      };
    } catch (error: any) {
      console.error('Error attesting', error);
      throw new Error(error);
    }
  }

  public async claimBadgesOptimistically(
    account: string,
    badgeUpdates: { badgeId: number; level: number; points: number }[]
  ): Promise<void> {
    const CACHE_KEY = `cached_badges:${account}`;
    const OPTIMISTIC_UPDATED_CACHE_KEY = `optimistic_updated_cached_badges:${account}`;

    const existingData = await redisService.getCachedData(CACHE_KEY);
    if (!existingData) {
      console.log('Existing data not found');
      return;
    }

    const updatedBadges = existingData.map((badge: any) => {
      const update = badgeUpdates.find((u) => u.badgeId === badge.badgeId);
      if (update) {
        badge.level = update.level;
        badge.points = update.points;
        badge.claimable = false;
      }
      return badge;
    });

    // 3. Guardar la versión optimista
    await redisService.setCachedData(
      OPTIMISTIC_UPDATED_CACHE_KEY,
      updatedBadges,
      null
    );
    console.log('Optimistic updated badges for:', account);
  }
}
