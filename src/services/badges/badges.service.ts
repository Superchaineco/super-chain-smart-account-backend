import {
  GetUserBadgesDocument,
  GetUserBadgesQuery,
  GetUserBadgesQueryVariables,
  execute,
} from '../../../.graphclient';
import type { ExecutionResult } from 'graphql';
import IpfsService from '../ipfs.service';
import { redisService } from '../redis.service';
import { BadgeStrategyContext } from '../badges/strategies/context';
import { superChainAccountService } from '../superChainAccount.service';
export type Badge = GetUserBadgesQuery['accountBadges'][number];
export type ResponseBadge = {
  points: string;
  tier: string;
} & Badge['badge'] & {
  claimableTier: number | null;
  claimable: boolean;
};

export class BadgesServices {
  private badges: ResponseBadge[] = [];

  public async getCachedBadges(account: string): Promise<any[]> {
    const CACHE_KEY = `cached_badges:${account}`;
    const OPTIMISTIC_UPDATED_CACHE_KEY = `optimistic_updated_cached_badges:${account}`;

    const fetchFunction = async (updateCache = true) => {
      const eoas = await superChainAccountService.getEOAS(account);
      const freshData = await this.getBadges(eoas, account);
      if (updateCache) {
        await redisService.setCachedData(CACHE_KEY, freshData, null);
      }
      return freshData;
    };

    const optimisticData = await redisService.getCachedData(OPTIMISTIC_UPDATED_CACHE_KEY);
    const cachedData = await redisService.getCachedData(CACHE_KEY);
    if (optimisticData && cachedData) {
      console.log('Optimistic data found for badges. Returning optimistic data...');
      fetchFunction(false).then((freshData) => {
        if (JSON.stringify(freshData) !== JSON.stringify(cachedData)) {
          console.log('Data fetch differs from optimistic data. Updating main cache and clearing optimistic data.');
          redisService.deleteCachedData(OPTIMISTIC_UPDATED_CACHE_KEY);
          redisService.setCachedData(CACHE_KEY, freshData, null);
          return freshData;
        } else {
          console.log('Data fetch matches optimistic data. Everything remains the same.');
        }
      }).catch((err) => {
        console.error('Error in badges fetch during comparison with optimistic data:', err);
      });
      return optimisticData;
    }

    if (cachedData) {
      console.log('Badges cache returned!');
      fetchFunction();
      return cachedData;
    }

    return fetchFunction();
  }

  public async fetchBadges(account: string) {
    const CACHE_KEY = `user_badges:${account}`;
    const ttl = 3600;

    const fetchFunction = async () => {
      const { data, errors }: ExecutionResult<GetUserBadgesQuery> =
        await execute(GetUserBadgesDocument, {
          user: account,
        } as GetUserBadgesQueryVariables);
      if (errors) {
        console.error('Error fetching badges:', errors);
        throw new Error('Error fetching badges');
      }
      return data;
    };

    // return redisService.getCachedDataWithCallback(CACHE_KEY, fetchFunction, ttl);
    return fetchFunction();
  }

  public async getBadges(eoas: string[], account: string): Promise<any[]> {
    const data = await this.fetchBadges(account);
    const accountBadgesIds =
      data?.accountBadges.map((accountBadge) => accountBadge.badge.badgeId) ??
      [];
    const unclaimedBadges = (
      data!.badges?.filter(
        (badge) => !accountBadgesIds.includes(badge.badgeId)
      ) ?? []
    ).map((badge) => ({
      tier: 0,
      points: 0,
      badge: {
        ...badge,
      },
    }));

    const activeBadges = [
      ...(data?.accountBadges ?? []).map((badge) => ({
        ...badge,
        tier: parseInt(badge.tier),
        points: parseInt(badge.points),
      })),
      ...unclaimedBadges,
    ] as Badge[];
    const promises = activeBadges.flatMap((badge) =>
      badge.badge.badgeTiers.map((tier) => this.getBadgeLevelMetadata(tier))
    );
    const results = await Promise.all(promises);

    for (const badge of activeBadges) {
      badge.badge['metadata'] = await this.getBadgeMetadata(badge);
      badge.badge.badgeTiers.forEach((tier) => {
        const result = results.find((res) => res.tier.uri === tier.uri);
        if (result) {
          tier['metadata'] = result.metadata;
        }
      });
    }

    for (const badge of activeBadges) {
      await this.updateBadgeDataForAccount(eoas, badge, account);
    }

    return this.badges;
  }

  public getTotalPoints(badges: ResponseBadge[]): number {
    return badges.reduce((totalSum, badge) => {
      if (!badge.claimable) {
        return totalSum;
      }

      const { tier, badgeTiers, claimableTier } = badge;
      const startIndex =
        badgeTiers.findIndex((t) => Number(t.tier) === Number(tier)) + 1;
      const endIndex = badgeTiers.findIndex(
        (t) => Number(t.tier) === Number(claimableTier)
      );

      if (startIndex < 0 || endIndex < 0 || startIndex > endIndex) {
        return totalSum;
      }

      const tierPoints = badgeTiers
        .slice(startIndex, endIndex + 1)
        .reduce((tierSum, { metadata }) => {
          return tierSum + Number(metadata!.points);
        }, 0);
      return totalSum + tierPoints;
    }, 0);
  }

  public getBadgeUpdates(
    badges: ResponseBadge[]
  ): { badgeId: number; level: number; points: number }[] {
    return badges
      .filter(({ claimable }) => claimable)
      .map((badge) => ({
        badgeId: badge.badgeId,
        level: badge.claimableTier!,
        points: Number(badge.points),
        previousLevel: badge.tier,
      }));
  }

  public async getBadgeMetadata(badge: Badge) {
    const CACHE_KEY = `badge:${badge.badge.uri}`;
    const ttl = -1;

    const fetchFunction = async () => {
      const metadataJson = await IpfsService.getIPFSData(badge.badge.uri);
      try {
        const metadata = JSON.parse(metadataJson);
        return metadata;
      } catch (error) {
        console.debug(badge.badge.uri);
        console.error(
          `Error parsing JSON from IPFS (Badge metadata): ${error}`
        );
        return null;
      }
    };

    return redisService.getCachedDataWithCallback(
      CACHE_KEY,
      fetchFunction,
      ttl,
      false
    );
  }

  public async getBadgeLevelMetadata(
    badgeLevel: Badge['badge']['badgeTiers'][0]
  ) {
    const CACHE_KEY = `badgeLevel:${badgeLevel.uri}`;
    const ttl = -1;
    const fetchFunction = async () => {
      const metadataJson = await IpfsService.getIPFSData(badgeLevel.uri);
      try {
        const metadata = JSON.parse(metadataJson);
        return { tier: badgeLevel, metadata };
      } catch (error) {
        console.debug(badgeLevel.uri);
        console.error(
          `Error parsing JSON from IPFS (Badge Tier metadata): ${error}`
        );
        throw new Error('Error parsing JSON from IPFS');
      }
    };

    return redisService.getCachedDataWithCallback(
      CACHE_KEY,
      fetchFunction,
      ttl,
      false
    );
  }

  private async updateBadgeDataForAccount(
    eoas: string[],
    badgeData: Badge,
    account: string
  ) {
    try {
      const strategy = BadgeStrategyContext.getBadgeStrategy(
        badgeData.badge.metadata!.name.trim()
      );
      const badgeResponse = await strategy.calculateTier(
        eoas,
        badgeData,
        account
      );
      this.badges.push(badgeResponse);
    } catch (error) {
      console.error(
        'Error updating badge data:',
        badgeData.badge.badgeId,
        badgeData.badge.metadata,
        error
      );
      this.badges = this.badges.filter(
        (b) => b.badgeId !== badgeData.badge.badgeId
      );
    }
  }
}
