import { BaseBadgeStrategy } from './badgeStrategy';
import { redisService } from '../../redis.service';
import axios from 'axios';
import { getBadgesQueue } from '../queue';
import { AssetTransfersCategory, Network } from 'alchemy-sdk';
import { Alchemy } from 'alchemy-sdk';
import { MerklApi } from '@merkl/api';
import { formatEther, parseEther } from 'ethers';

export class LiskSurgeStrategy extends BaseBadgeStrategy {
  
  async getValue(eoas: string[]): Promise<number> {
    const cacheKey = `liskSurge-${eoas.join(',')}`;
    const ttl = 3600;

    const fetchFunction = async () => {
      const merkl = MerklApi('https://api.merkl.xyz').v4;
      try {
        const total = await eoas.reduce(async (accPromise, eoa) => {
          const acc = await accPromise;
          const response = await merkl
            .users({
              address: eoa,
            })
            .rewards.get({
              query: {
                chainId: ['1135'],
              },
            });
          console.log(response.data);
          if (response.data.length > 0) {
            const campaigns = response.data[0].rewards[0].breakdowns;

            const eoaTotal = campaigns.reduce((campaignAcc, campaign) => {
              return campaignAcc + BigInt(campaign.claimed);
            }, BigInt(0));

            return acc + Number(formatEther(eoaTotal));
          } else {
            return acc;
          }
        }, Promise.resolve(0));

        return total;
      } catch (error) {
        console.error('Error fetching Lisk Surge data:', error);
        return 0;
      }
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }
}
