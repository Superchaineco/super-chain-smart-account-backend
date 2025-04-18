import { Badge, ResponseBadge } from '../badges.service';
import { redisService } from '../../redis.service';
import { Season } from '@/types/index.types';
import { BASE_BLOCKSCOUT_API_KEY, INK_BLOCKSCOUT_API_KEY, OP_BLOCKSCOUT_API_KEY, ROUTESCAN_API_KEY, SONEIUM_BLOCKSCOUT_API_KEY, UNICHAIN_BLOCKSCOUT_API_URL } from '@/config/superChain/constants';
import { badgesQueueService } from '../queue';

type ExternalApiCall = {
  service: string;
  chain: string;
  chainId: string;
  eoas: string[];
  eoa?: string;
  season?: Season;
  fromBlock?: string;
  toBlock?: string;
};
export interface BadgeStrategy {
  calculateTier(
    eoas: string[],
    badgeData: Badge,
    account?: string
  ): Promise<ResponseBadge>;
}

const ttl = 3600;

const buildUrl = (apiCall: ExternalApiCall) => {
  const urlByService = {
    blockscout: () => {
      const baseUrls = {
        "Soneium": `https://soneium.blockscout.com/api?apikey=${SONEIUM_BLOCKSCOUT_API_KEY}`,
        "unichain-130": `https://unichain.blockscout.com/api?apikey=${UNICHAIN_BLOCKSCOUT_API_URL}`,
        "ink-57073": `https://explorer.inkonchain.com/api?apikey=${INK_BLOCKSCOUT_API_KEY}`,
        "optimism-10": `https://optimism.blockscout.com/api?apikey=${OP_BLOCKSCOUT_API_KEY}`,
        "base-8453": `https://base.blockscout.com/api?apikey=${BASE_BLOCKSCOUT_API_KEY}`
      }
      const urlGet = `${baseUrls[apiCall.chain]}&module=account&action=txlist&address=${apiCall.eoa}&sort=asc&startblock=${apiCall.fromBlock}&endblock=${apiCall.toBlock}`;
      return urlGet;
    },
    routescan: () => {
      return `https://api.routescan.io/v2/network/mainnet/evm/${apiCall.chainId}/etherscan/api?apikey=${ROUTESCAN_API_KEY}&module=account&action=txlist&address=${apiCall.eoa}&startblock=${apiCall.fromBlock}&page=1&offset=301&sort=asc`;
    },
  };
  return urlByService[apiCall.service]();
};

export abstract class BaseBadgeStrategy implements BadgeStrategy {
  abstract getValue(
    eoas: string[],
    account?: string
  ): Promise<number | boolean>;

  async getCachedValue(apicall: ExternalApiCall): Promise<number> {
    let totalTransactions = 0;

    for (const eoa of apicall.eoas) {
      const cacheKey = `${apicall.service}-${apicall.chain}-${eoa}`;
      apicall.eoa = eoa;

      const transactions = await redisService.getCachedDataWithCallback(
        cacheKey,
        () => this.fetchAllTimeDataOfEOA(apicall),
        ttl
      );

      totalTransactions += transactions;
    }

    return totalTransactions;
  }
  async getCachedSeasonedValue(apicall: ExternalApiCall): Promise<number> {
    let value = 0;

    for (const eoa of apicall.eoas) {
      const cacheKey = `${apicall.service}-${apicall.chain}-${apicall.season.season
        }Transactions-${eoa}`;

      apicall.eoa = eoa;
      value += await redisService.getCachedDataWithCallback(
        cacheKey,
        () => this.fetchSeasonedDataOfEOA(apicall),
        ttl
      );
    }
    return value;
  }

  async fetchAllTimeDataOfEOA(apicall: ExternalApiCall): Promise<number> {
    apicall.fromBlock = '0';

    const response = await this.fetchDataOfEOA(apicall);
    const totalTransactions =
      response?.result.filter(
        (tx: any) => tx.from.toLowerCase() === apicall.eoa.toLowerCase()
      ).length ?? 0;

    return totalTransactions;
  }

  async fetchSeasonedDataOfEOA(apicall: ExternalApiCall): Promise<number> {
    apicall.fromBlock = apicall.season.blockRanges[apicall.chain][0];
    apicall.toBlock =
      Date.now() >= new Date(2025, 5, 11).getTime()
        ? '&to_block=' + apicall.season.blockRanges[apicall.chain][1]
        : '';

    const response = await this.fetchDataOfEOA(apicall);
    const totalTransactions = Number(
      (response?.result?.length || response?.items?.length) ?? 0
    );
    return totalTransactions;
  }

  async fetchDataOfEOA(apicall: ExternalApiCall): Promise<any> {
    const urlGet = buildUrl(apicall);
    const response = await badgesQueueService.getCachedDelayedResponse(urlGet);
    return response;
  }

  async calculateTier(
    eoas: string[],
    badgeData: Badge,
    account?: string
  ): Promise<ResponseBadge> {
    try {
      const value = await this.getValue(eoas, account);

      let claimableTier: number | null = null;
      let claimable = false;

      if (typeof value === 'number') {
        claimableTier = this.calculateNumericTier(badgeData, value);
        claimable = claimableTier ? badgeData.tier < claimableTier : false;
      } else if (typeof value === 'boolean') {
        claimableTier = value ? 1 : null;
        claimable = value ? badgeData.tier != 1 : false;
      }

      if (claimableTier !== null && claimableTier < Number(badgeData.tier)) {
        claimableTier = Number(badgeData.tier);
      }

      return {
        ...badgeData.badge,
        points: badgeData.points,
        tier: badgeData.tier,
        claimableTier,
        claimable,
      };
    } catch (error) {
      console.error('Error calculating tier', error);
      throw error;
    }
  }

  protected calculateNumericTier(badgeData: Badge, value: number): number {
    try {
      const badgeTiers = badgeData.badge.badgeTiers;
      if (!badgeTiers) throw new Error('No tiers found for badge');

      for (let i = badgeTiers.length - 1; i >= 0; i--) {
        if (value >= badgeTiers[i].metadata!.minValue) {
          return i + 1;
        }
      }
      return 0;
    } catch (error) {
      console.error('Error calculating numeric tier', error);
      throw error;
    }
  }
}
