import { Badge, ResponseBadge } from '../badges.service';
import { redisService } from '../../redis.service';
import { Season } from '@/types/index.types';
import { BASE_BLOCKSCOUT_API_KEY, INK_BLOCKSCOUT_API_KEY, OP_BLOCKSCOUT_API_KEY, ROUTESCAN_API_KEY, SONEIUM_BLOCKSCOUT_API_KEY, UNICHAIN_BLOCKSCOUT_API_URL } from '@/config/superChain/constants';
import { getBadgesQueue } from '../queue';


export type ExternalApiCall = {
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
        "base-8453": `https://base.blockscout.com/api?apikey=${BASE_BLOCKSCOUT_API_KEY}`,
        "mode-34443": `https://explorer.mode.network/api?`
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

export const Seasons: Season[] = [
  {
    season: "S7",
    fromDate: new Date(2025, 0, 16),
    toDate: new Date(2025, 5, 11),
    blockRanges: {
      "optimism-10": [130693412, 137000612],//2 secs x block
      "base-8453": [25098127, 31405327], //2 secs x block
      "unichain-130": [6255241, 18956041], //1 sec x block
      "mode-34443": [18418009, 24725209], //2 secs x block
      "ink-57073": [3505189, 16119589],//1 sec x block
      "Soneium": [1934425, 8241625], //2 secs x block
      //Not relevante yet
      "mint-185": [0, 0],
      "swell-1923": [0, 0],
      "Metal": [0, 0]
    }
  }
]


export const DEFAULT_TTL = 60 * 60; // 1 hour

export abstract class BaseBadgeStrategy implements BadgeStrategy {
  abstract getValue(
    eoas: string[],
    account?: string
  ): Promise<number | boolean>;

  public campaigns: string[] = []

  async getCachedValue(apicall: ExternalApiCall): Promise<number> {
    let totalValue = 0;

    for (const eoa of apicall.eoas) {

      const newApicall = { ...apicall, eoa }
      const response = await this.fetchDataOfEOA(newApicall);
      const eoaValue = Number(
        (response?.data?.result?.length || response?.data?.items?.length ||
          response?.result?.length || response?.items?.length
        ) ?? 0
      );


      totalValue += eoaValue
    }

    return totalValue;
  }







  async fetchDataOfEOA(apicall: ExternalApiCall): Promise<any> {
    const urlGet = buildUrl(apicall);
    const queueService = getBadgesQueue(apicall.service)
    const response = await queueService.getCachedDelayedResponse(urlGet);
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
        campaigns: this.campaigns
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
