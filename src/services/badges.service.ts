import { BadgesHelper, type IBadgesHelper } from "./badges.helper";
import {
  GetUserBadgesDocument,
  GetUserBadgesQuery,
  GetUserBadgesQueryVariables,
  execute,
} from "../../.graphclient";
import type { ExecutionResult } from "graphql";
import IpfsService from "./ipfs.service";
import { redisService } from "./redis.service"; // Importar RedisService

export type Badge = GetUserBadgesQuery["accountBadges"][number];
export type ResponseBadge = {
  points: string;
  tier: string;
} & Badge["badge"] & {
    claimableTier: number | null;
    claimable: boolean;
  };

export class BadgesServices {
  private badges: ResponseBadge[] = [];
  private helper: IBadgesHelper;

  constructor() {
    this.helper = new BadgesHelper();
  }

  public async getBadges(eoas: string[], account: string): Promise<any[]> {
    const { data, errors }: ExecutionResult<GetUserBadgesQuery> = await execute(
      GetUserBadgesDocument,
      {
        user: account,
      } as GetUserBadgesQueryVariables,
    );
    if (errors) {
      console.error("Error fetching badges:", errors);
      throw new Error("Error fetching badges");
    }
    const accountBadgesIds =
      data?.accountBadges.map((accountBadge) => accountBadge.badge.badgeId) ??
      [];
    const unclaimedBadges = (
      data!.badges?.filter(
        (badge) => !accountBadgesIds.includes(badge.badgeId),
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
      badge.badge.badgeTiers.map((tier) => this.getBadgeLevelMetadata(tier)),
    );
    const results = await Promise.all(promises);

    for (const badge of activeBadges) {
      badge.badge["metadata"] = await this.getBadgeMetadata(badge);
      badge.badge.badgeTiers.forEach((tier) => {
        const result = results.find((res) => res.tier.uri === tier.uri);
        if (result) {
          tier["metadata"] = result.metadata;
        }
      });
    }

    for (const badge of activeBadges) {
      try {
        await this.updateBadgeDataForAccount(eoas, badge);
      } catch (e) {
        console.error(
          "Error updating badge data:",
          badge.badge.badgeId,
          badge.badge.metadata,
          e,
        );
      }
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
        (t) => Number(t.tier) === Number(claimableTier),
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
    badges: ResponseBadge[],
  ): { badgeId: number; level: number }[] {
    return badges
      .filter(({ claimable }) => claimable)
      .map(({ badgeId, claimableTier }) => ({
        badgeId,
        level: claimableTier!,
      }));
  }

  public async getBadgeMetadata(badge: Badge) {
    const CACHE_KEY = `badge:${badge.badge.uri}`;
    const ttl = 3600; // 1 hora

    const fetchFunction = async () => {
      const metadataJson = await IpfsService.getIPFSData(badge.badge.uri);
      try {
        const metadata = JSON.parse(metadataJson);
        return metadata;
      } catch (error) {
        console.error(`Error parsing JSON from IPFS: ${error}`);
        return null;
      }
    };

    return redisService.getCachedData(CACHE_KEY, fetchFunction, ttl);
  }

  public async getBadgeLevelMetadata(badgeLevel: Badge["badge"]["badgeTiers"][0]) {
    const CACHE_KEY = `badgeLevel:${badgeLevel.uri}`;
    const ttl = 3600; // 1 hora
    const fetchFunction = async () => {
      const metadataJson = await IpfsService.getIPFSData(badgeLevel.uri);
      try {
        const metadata = JSON.parse(metadataJson);
        return { tier: badgeLevel, metadata };
      } catch (error) {
        console.error(`Error parsing JSON from IPFS: ${error}`);
        throw new Error("Error parsing JSON from IPFS");
      }
    };

    return redisService.getCachedData(CACHE_KEY, fetchFunction, ttl);
  }

  private async updateBadgeDataForAccount(eoas: string[], badgeData: Badge) {
    switch (badgeData.badge.metadata!.name) {
      case "OP Mainnet User":
        const optimismTransactions =
          await this.helper.getOptimisimTransactions(eoas);
        if (!badgeData.badge.badgeTiers)
          throw new Error("No tiers found for badge");
        let optimismTier = null;
        for (let i = badgeData.badge.badgeTiers.length - 1; i >= 0; i--) {
          if (
            optimismTransactions >=
            badgeData.badge.badgeTiers[i].metadata!.minValue
          ) {
            optimismTier = i + 1;
            break;
          }
        }
        this.badges.push({
          ...badgeData.badge,
          points: badgeData.points,
          tier: badgeData.tier,
          claimableTier: optimismTier,
          claimable: optimismTier ? badgeData.tier < optimismTier : false,
        });

        break;
      case "Base User":
        const baseTransactions = await this.helper.getBaseTransactions(eoas);
        if (!badgeData.badge.badgeTiers)
          throw new Error("No tiers found for badge");
        let baseTier = null;
        for (let i = badgeData.badge.badgeTiers.length - 1; i >= 0; i--) {
          if (
            baseTransactions >= badgeData.badge.badgeTiers[i].metadata!.minValue
          ) {
            baseTier = i + 1;
            break;
          }
        }

        this.badges.push({
          ...badgeData.badge,
          points: badgeData.points,
          tier: badgeData.tier,
          claimableTier: baseTier,
          claimable: baseTier ? badgeData.tier < baseTier : false,
        });
        break;

      case "Ethereum Sepolia User":
        const sepoliaTransactions =
          await this.helper.getSepoliaTransactions(eoas);

        if (!badgeData.badge.badgeTiers)
          throw new Error("No tiers found for badge");
        let sepoliaTier = null;
        for (let i = badgeData.badge.badgeTiers.length - 1; i >= 0; i--) {
          if (
            sepoliaTransactions >=
            badgeData.badge.badgeTiers[i].metadata!.minValue
          ) {
            sepoliaTier = i + 1;
            break;
          }
        }

        this.badges.push({
          ...badgeData.badge,
          points: badgeData.points,
          tier: badgeData.tier,
          claimableTier: sepoliaTier,
          claimable: sepoliaTier ? badgeData.tier < sepoliaTier : false,
        });
        break;

      case "Mode User":
        const modeTransactions = await this.helper.getModeTransactions(eoas);

        if (!badgeData.badge.badgeTiers)
          throw new Error("No tiers found for badge");
        let modeTier = null;
        for (let i = badgeData.badge.badgeTiers.length - 1; i >= 0; i--) {
          if (
            modeTransactions >= badgeData.badge.badgeTiers[i].metadata!.minValue
          ) {
            modeTier = i + 1;
            break;
          }
        }

        this.badges.push({
          ...badgeData.badge,
          points: badgeData.points,
          tier: badgeData.tier,
          claimableTier: modeTier,
          claimable: modeTier ? badgeData.tier < modeTier : false,
        });
        break;
      case "Citizen":
        let isCitizen = await this.helper.isCitizen(eoas);
        this.badges.push({
          ...badgeData.badge,
          points: badgeData.points,
          tier: badgeData.tier,
          claimableTier: isCitizen ? 1 : null,
          claimable: isCitizen ? badgeData.tier != 1 : false,
        });
        break;

      case "Hold Nouns":
        const countNouns = await this.helper.hasNouns(eoas);
        let nounsTier = null;
        for (let i = badgeData.badge.badgeTiers.length - 1; i >= 0; i--) {
          if (countNouns >= badgeData.badge.badgeTiers[i].metadata!.minValue) {
            nounsTier = i + 1;
            break;
          }
        }
        this.badges.push({
          ...badgeData.badge,
          points: badgeData.points,
          tier: badgeData.tier,
          claimableTier: nounsTier,
          claimable: nounsTier ? badgeData.tier < nounsTier : false,
        });
        break;

      case "Giveth Donations Made":
        const givethDonations = await this.helper.getGivethDonations(eoas);
        let givethDonationsTier = null;
        for (let i = badgeData.badge.badgeTiers.length - 1; i >= 0; i--) {
          if (
            givethDonations >= badgeData.badge.badgeTiers[i].metadata!.minValue
          ) {
            givethDonationsTier = i + 1;
            break;
          }
        }
        this.badges.push({
          ...badgeData.badge,
          points: badgeData.points,
          tier: badgeData.tier,
          claimableTier: givethDonationsTier,
          claimable: givethDonationsTier
            ? badgeData.tier < givethDonationsTier
            : false,
        });
        break;

      case "Gitcoin Donations Made":
        const gitcoinDonations = await this.helper.getGitcoinDonations(eoas);
        let gitcoinDonationsTier = null;
        for (let i = badgeData.badge.badgeTiers.length - 1; i >= 0; i--) {
          if (
            gitcoinDonations >= badgeData.badge.badgeTiers[i].metadata!.minValue
          ) {
            gitcoinDonationsTier = i + 1;
            break;
          }
        }
        this.badges.push({
          ...badgeData.badge,
          points: badgeData.points,
          tier: badgeData.tier,
          claimableTier: gitcoinDonationsTier,
          claimable: gitcoinDonationsTier
            ? badgeData.tier < gitcoinDonationsTier
            : false,
        });
        break;
      case "Talent Protocol score":
        const talentScore = await this.helper.getTalentScore(eoas);
        let talentScoreTier = null;
        for (let i = badgeData.badge.badgeTiers.length - 1; i >= 0; i--) {
          if (
            talentScore >= badgeData.badge.badgeTiers[i].metadata!.minValue
          ) {
            talentScoreTier = i + 1;
            break;
          }
        }
        this.badges.push({
          ...badgeData.badge,
          points: badgeData.points,
          tier: badgeData.tier,
          claimableTier: talentScoreTier,
          claimable: talentScoreTier ? badgeData.tier < talentScoreTier : false,
        });
        break;

      case "Worldcoin Verification":
        const isWorldcoinVerified = await this.helper.isWorldcoinVerified(eoas);
        this.badges.push({
          ...badgeData.badge,
          points: badgeData.points,
          tier: badgeData.tier,
          claimableTier: isWorldcoinVerified ? 1 : null,
          claimable: isWorldcoinVerified ? badgeData.tier != 1 : false,
        });
        break;
    }
  }
}