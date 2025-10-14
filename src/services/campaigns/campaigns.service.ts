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
  id: string;
  type: 'campaign_badge';
  badgeName: string;
  description: string;
  currentLevel: number
  maxLevel: number
  image: string
  tokenBadge?: boolean
  season?: number
  completed?: boolean
  currentPoints: number
  maxPoints: number
};

export type Campaign = {
  id: string;
  name: string;
  description: string;
  start_date: Date;
  end_date: Date;
  network: string[];
  banner: string;
  boosts: CampaignBoost[];
  campaign_badges: CampaignBadge[];
  participate_description: string;
  campaign_link: string;
  myPoints: number;
  totalBoost: number
  more_info: string
  distributed_points: number
  can_claim: boolean
  max_claim_date: Date
  campaign_reward: { symbol: string; amount: string }
  claimable_reward: { symbol: string; amount: string }
  start_block: number;
  end_block: number
};

const campaigns: Campaign[] = campaignsData as unknown as Campaign[];
const badgesService = new BadgesServices();

// Type guard for CampaignBoost
function isCampaignBoost(obj: any): obj is CampaignBoost {
  return obj && (obj.type === 'level' || obj.type === 'badge');
}

type CampaignDetailsInput = {
  eoas: string[];
  userBadges: any[];
  superAccountLevel: number;
};





function getPointsForClaims(account: string, badgeIds: string[], blockNumbers: number[]) {
  return { distributed_points: 5, myPoints: 10 }

}


export type CampaignPrize = Campaign & {
  myPoints: number
  distributed_points: number
  can_claim: boolean
  max_claim_date: Date
  campaign_reward: { symbol: string; amount: string }
  claimable_reward: { symbol: string; amount: string }
}

function getCampaignPrizesInfo(account: string, campaign: Campaign) {

  if (!account || !campaign)
    return {
      distributed_points: 0,
      myPoints: 0,
      can_claim: false,
    }
  const badgeIds = campaign.campaign_badges.map(b => b.id);
  const { distributed_points, myPoints } = getPointsForClaims(account, badgeIds, [258, 2558])
  return {
    distributed_points,
    myPoints,
    can_claim: false,//TODO
  }

}

export async function getCampaignDetailsWithData(
  campaignId: string,
  { eoas, userBadges, superAccountLevel }: CampaignDetailsInput,
  currentCampaign?: Campaign, account?: string
) {


  const changeImage = (tiersLength: string, currentImage: string) => {
    return currentImage.replace('/Badge.svg', `/T${tiersLength}.svg`);
  }

  const newImageUserBadges = userBadges.map((badge) => {
    return {
      ...badge,
      metadata: {
        ...badge.metadata,
        image: changeImage(badge.claimableTier ?? 0, badge.metadata.image),
        'stack-image': null,
      },
    };
  });

  const campaign = campaigns.find((c) => c.id === campaignId);
  if (!campaign) throw new Error('Campaign not found');

  let totalBoost = 0;

  // const boosts = await Promise.all(
  //   campaign.boosts.map(async (boost) => {
  //     if (!isCampaignBoost(boost)) {
  //       return { applies: false };
  //     }
  //     if (boost.type === 'badge') {
  //       const userBadge = newImageUserBadges.find(
  //         (b) => b.metadata?.name === boost.badgeName
  //       );
  //       const badgeLevel = userBadge ? userBadge.tier : 0;
  //       const applies = badgeLevel >= (boost.minLevel || 1);
  //       totalBoost += boost.boostPercent;
  //       return {
  //         ...boost,
  //         currentLevel: badgeLevel,
  //         maxLevel: userBadge?.badgeTiers.length,
  //         image: userBadge?.metadata?.image || undefined,
  //         applies,
  //       };
  //     }

  //     if (boost.type === 'level') {
  //       const userLevel = superAccountLevel;
  //       const applies = userLevel >= (boost as any).level;
  //       if (applies) totalBoost += boost.boostPercent;
  //       return {
  //         ...boost,
  //         currentLevel: userLevel,
  //         maxLevel: 0,
  //         image: undefined,
  //         applies,
  //       };
  //     }

  //     return { applies: false };
  //   })
  // );

  const campaign_badges = campaign.campaign_badges.map((badge) => {
    const userBadge = newImageUserBadges.find(
      (b) => b.metadata?.name === badge.badgeName
    );
    const badgeLevel = userBadge ? userBadge.tier : 0;
    const applies = badgeLevel > userBadge?.badgeTiers.length;
    return {
      ...badge,
      currentLevel: badgeLevel,
      maxLevel: userBadge?.badgeTiers.length || 0,
      image: userBadge?.metadata?.image || undefined,
      applies,
    };
  });

  const { distributed_points, myPoints } = getCampaignPrizesInfo(account, currentCampaign)

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
    campaign_reward: currentCampaign?.campaign_reward,
    //boosts,
    totalBoost,
    campaign_badges,
    distributed_points,
    myPoints
  };
}

// Mantener la función original para compatibilidad
export async function getCampaignDetails(account: string, campaignId: string) {
  const eoas = await superChainAccountService.getEOAS(account);
  const userBadges = await badgesService.getBadges(eoas, account);
  const superAccountLevel = await superChainAccountService.getAccountLevel(
    account
  );

  return getCampaignDetailsWithData(campaignId, {
    eoas,
    userBadges,
    superAccountLevel,
  });
}
