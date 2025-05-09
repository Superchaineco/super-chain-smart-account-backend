import campaignsData from './campaigns.json';
import { BadgesServices } from '../badges/badges.service';
import { superChainAccountService } from '../superChainAccount.service';

// Types
export type CampaignBoost =
  | {
      type: 'level';
      level: number;
      boostPercent: number;
      description: string;
    }
  | {
      type: 'badge';
      badgeName: string;
      boostPercent: number;
      minLevel?: number;
      description: string;
    };

export type CampaignBadge = {
  type: 'campaign_badge';
  badgeName: string;
  description: string;
};

export type Campaign = {
  id: string;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  network: string;
  banner: string;
  boosts: CampaignBoost[];
  campaign_badges: CampaignBadge[];
};

const campaigns: Campaign[] = campaignsData as unknown as Campaign[];
const badgesService = new BadgesServices();

function getBadgeImage(userBadge: any, badgeLevel: number): string | undefined {
  if (
    userBadge &&
    userBadge.badge &&
    userBadge.badge.badgeTiers &&
    userBadge.badge.badgeTiers[badgeLevel - 1]?.metadata?.image
  ) {
    return userBadge.badge.badgeTiers[badgeLevel - 1].metadata.image;
  }
  if (
    userBadge &&
    userBadge.badge &&
    userBadge.badge.badgeTiers[0]?.metadata?.image
  ) {
    return userBadge.badge.badgeTiers[0].metadata.image;
  }
  return undefined;
}

// Type guard for CampaignBoost
function isCampaignBoost(obj: any): obj is CampaignBoost {
  return obj && (obj.type === 'level' || obj.type === 'badge');
}

export async function getCampaignDetails(account: string, campaignId: string) {
  const campaign = campaigns.find((c) => c.id === campaignId);
  if (!campaign) throw new Error('Campaign not found');

  const eoas = await superChainAccountService.getEOAS(account);
  const userBadges = await badgesService.getBadges(eoas, account);
  const superAccountLevel = await superChainAccountService.getAccountLevel(account);

  let totalBoost = 0;

  const boosts = await Promise.all(
    campaign.boosts.map(async (boost) => {
      if (!isCampaignBoost(boost)) {
        return { applies: false };
      }
      if (boost.type === 'badge') {
        const userBadge = userBadges.find((b) => b.metadata?.name === boost.badgeName);
        console.log(userBadge, userBadges)
        const badgeLevel = userBadge ? userBadge.tier : 0;
        const badgeImage = getBadgeImage(userBadge, badgeLevel);
        const applies = badgeLevel >= (boost.minLevel || 1);
        totalBoost += boost.boostPercent;
        return {
          ...boost,
          badgeLevel,
          badgeImage,
          applies,
        };
      }

      if (boost.type === 'level') {
        const userLevel = superAccountLevel;
        const applies = userLevel >= (boost as any).level;
        if (applies) totalBoost += boost.boostPercent;
        return {
          type: boost.type,
          level: (boost as any).level,
          boostPercent: boost.boostPercent,
          description: boost.description,
          badgeLevel: userLevel,
          badgeImage: undefined,
          applies,
        };
      }

      return { applies: false };
    })
  );

  const campaign_badges = await Promise.all(
    campaign.campaign_badges.map(async (badge) => {
      const userBadge = userBadges.find((b) => b.badge?.metadata?.name === badge.badgeName);
      const badgeLevel = userBadge ? userBadge.tier : 0;
      const badgeImage = getBadgeImage(userBadge, badgeLevel);
      return {
        ...badge,
        badgeLevel,
        badgeImage,
      };
    })
  );

  return {
    id: campaign.id,
    name: campaign.name,
    description: campaign.description,
    banner: campaign.banner,
    network: campaign.network,
    start_date: campaign.start_date,
    end_date: campaign.end_date,
    boosts,
    totalBoost,
    campaign_badges,
  };
}
