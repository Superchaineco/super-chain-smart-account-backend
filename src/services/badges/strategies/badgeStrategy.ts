import { Badge, ResponseBadge } from '../badges.service';
import { redisService } from '../../redis.service';
import { Season } from '@/types/index.types';
import { BASE_BLOCKSCOUT_API_KEY, INK_BLOCKSCOUT_API_KEY, OP_BLOCKSCOUT_API_KEY, ROUTESCAN_API_KEY, SONEIUM_BLOCKSCOUT_API_KEY, UNICHAIN_BLOCKSCOUT_API_URL } from '@/config/superChain/constants';
import { getBadgesQueue } from '../queue';
import { Network } from 'alchemy-sdk';
import { getCampaignsForBadgeId } from '@/services/campaigns/campaigns.service';


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
    extraData: any | undefined,
    account?: string
  ): Promise<ResponseBadge>;
}


export const CHAIN_KEYS = {
  OPTIMISM: "optimism-10",
  BASE: "base-8453",
  INK: "ink-57073",
  SONEIUM: "Soneium",
  UNICHAIN: "unichain-130",
  MODE: "mode-34443",
  CELO: "celo-42220"
} as const;

export const NETWORKS: Record<(typeof CHAIN_KEYS)[keyof typeof CHAIN_KEYS], Network> = {
  [CHAIN_KEYS.OPTIMISM]: Network.OPT_MAINNET,
  [CHAIN_KEYS.BASE]: Network.BASE_MAINNET,
  [CHAIN_KEYS.INK]: Network.INK_MAINNET,
  [CHAIN_KEYS.SONEIUM]: Network.SONEIUM_MAINNET,
  [CHAIN_KEYS.UNICHAIN]: Network.UNICHAIN_MAINNET,
  [CHAIN_KEYS.MODE]: Network.ETH_MAINNET,
  [CHAIN_KEYS.CELO]: Network.CELO_MAINNET,
};

export enum EXPLORER_SERVICES {
  BLOCKSCOUT = "blockscout",
  ROUTESCAN = "routescan",
}

const ttl = 3600;

export const buildUrl = (apiCall: ExternalApiCall): string => {
  const baseUrls: Record<string, string> = {
    [CHAIN_KEYS.SONEIUM]: `https://soneium.blockscout.com/api?apikey=${SONEIUM_BLOCKSCOUT_API_KEY}`,
    [CHAIN_KEYS.UNICHAIN]: `https://unichain.blockscout.com/api?apikey=${UNICHAIN_BLOCKSCOUT_API_URL}`,
    [CHAIN_KEYS.INK]: `https://explorer.inkonchain.com/api?apikey=${INK_BLOCKSCOUT_API_KEY}`,
    [CHAIN_KEYS.OPTIMISM]: `https://optimism.blockscout.com/api?apikey=${OP_BLOCKSCOUT_API_KEY}`,
    [CHAIN_KEYS.BASE]: `https://base.blockscout.com/api?apikey=${BASE_BLOCKSCOUT_API_KEY}`,
    [CHAIN_KEYS.MODE]: `https://explorer.mode.network/api?`,
  };

  const urlByService = {
    [EXPLORER_SERVICES.BLOCKSCOUT]: (): string => {
      const baseUrl = baseUrls[apiCall.chain];
      return `${baseUrl}&module=account&action=txlist&address=${apiCall.eoa}&sort=asc&startblock=${apiCall.fromBlock}&endblock=${apiCall.toBlock}`;
    },
    [EXPLORER_SERVICES.ROUTESCAN]: (): string => {
      return `https://api.routescan.io/v2/network/mainnet/evm/${apiCall.chainId}/etherscan/api?apikey=${ROUTESCAN_API_KEY}&module=account&action=txlist&address=${apiCall.eoa}&startblock=${apiCall.fromBlock}&page=1&offset=301&sort=asc`;
    },
  };

  return urlByService[apiCall.service]();
};

export const getSeasonByCode = (seasonCode: string): Season | undefined => {
  return Seasons.find(season => season.season === seasonCode);
}
export const Seasons: Season[] = [
  {
    season: "S7",
    fromDate: new Date(Date.UTC(2025, 0, 16, 0, 0, 0, 0)),
    toDate: new Date(Date.UTC(2025, 6, 16, 23, 59, 59, 999)),
    blockRanges: {
      [CHAIN_KEYS.OPTIMISM]: [130_693_412, 138_555_811],
      [CHAIN_KEYS.BASE]: [25_098_127, 32_960_527],
      [CHAIN_KEYS.UNICHAIN]: [6_237_241, 21_962_041],
      [CHAIN_KEYS.MODE]: [18_409_009, 26_271_409],
      [CHAIN_KEYS.INK]: [3_505_189, 19_211_989],
      [CHAIN_KEYS.SONEIUM]: [1_925_425, 9_787_825],
    },
  },
  {
    season: "S8",
    fromDate: new Date(Date.UTC(2025, 6, 31, 0, 0, 0, 0)),
    toDate: new Date(Date.UTC(2025, 11, 24, 23, 59, 59, 999)),
    blockRanges: {
      [CHAIN_KEYS.OPTIMISM]: [139_160_613, 145_511_013],
      [CHAIN_KEYS.BASE]: [33_565_329, 39_915_729],
      [CHAIN_KEYS.UNICHAIN]: [23_171_643, 35_872_443],
      [CHAIN_KEYS.MODE]: [26_876_211, 33_226_611],
      [CHAIN_KEYS.INK]: [20_421_591, 33_122_391],
      [CHAIN_KEYS.SONEIUM]: [10_392_627, 16_743_027],
      [CHAIN_KEYS.CELO]: [42_019_242, 54_633_642],
    },
  },
];


export const DEFAULT_TTL = 60 * 60; // 1 hour

export abstract class BaseBadgeStrategy implements BadgeStrategy {
  abstract getValue(
    eoas: string[],
    extraData: any | undefined,
    badgeData: Badge
  ): Promise<number | boolean>;



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
    extraData: any | undefined,
    account: string
  ): Promise<ResponseBadge> {
    try {
      const value = await this.getValue(eoas, extraData, badgeData);

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
        campaigns: getCampaignsForBadgeId(Number(badgeData.badge.badgeId)),
        currentCount: typeof value == 'number' ? value : undefined
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
