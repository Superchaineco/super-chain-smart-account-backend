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
  participate_description: string;
  campaign_link: string;
};

const campaigns: Campaign[] = campaignsData as unknown as Campaign[];
const badgesService = new BadgesServices();
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
        const badgeLevel = userBadge ? userBadge.tier : 0;
        const applies = badgeLevel >= (boost.minLevel || 1);
        totalBoost += boost.boostPercent;
        return {
          ...boost,
          currentLevel: badgeLevel,
          maxLevel: userBadge?.badgeTiers.length,
          image: userBadge?.metadata?.image || undefined,
          applies,
        };
      }

      if (boost.type === 'level') {
        const userLevel = superAccountLevel;
        const applies = userLevel >= (boost as any).level;
        if (applies) totalBoost += boost.boostPercent;
        return {
          ...boost,
          currentLevel: userLevel,
          maxLevel: 0,
          image: undefined,
          applies,
        };
      }

      return { applies: false };
    })
  );

  const campaign_badges = await Promise.all(
    campaign.campaign_badges.map(async (badge) => {
      const userBadge = userBadges.find((b) => b.metadata?.name === badge.badgeName);
      const badgeLevel = userBadge ? userBadge.tier : 0;
      const applies = badgeLevel > userBadge?.badgeTiers.length;
      return {
        ...badge,
        currentLevel: badgeLevel,
        maxLevel: userBadge?.badgeTiers.length || 0,
        image: userBadge?.metadata?.image || undefined,
        applies,
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
    participate_description: campaign.participate_description,
    campaign_link: campaign.campaign_link,
    boosts,
    totalBoost,
    campaign_badges,
  };
}
