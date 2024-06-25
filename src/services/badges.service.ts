import { BadgesHelper, type IBadgesHelper } from './badges.helper';
import { GetUserBadgesDocument, GetUserBadgesQuery, GetUserBadgesQueryVariables, execute } from '../../.graphclient';
import type { ExecutionResult } from 'graphql'


export type Badge = GetUserBadgesQuery['accountBadges'][number];
export type ResponseBadge = Badge & {
  claimableTier: number | null;
  claimable: boolean;
}

export class BadgesServices {
  private badges: ResponseBadge[] = [];
  private helper: IBadgesHelper;

  constructor() {
    this.helper = new BadgesHelper();
  }

  public async getBadges(
    eoas: string[],
    account: string
  ): Promise<any[]> {


    const { data, errors }: ExecutionResult<GetUserBadgesQuery> = await execute(GetUserBadgesDocument, {
      user: account
    } as GetUserBadgesQueryVariables)

    if (errors) {
      console.error('Error fetching badges:', errors)
      throw new Error('Error fetching badges')
    }
    const accountBadgesIds = data?.accountBadges.map(accountBadge => accountBadge.badge.badgeId) ?? []
    const unclaimedBadges = (data!.badges?.filter(badge => !accountBadgesIds.includes(badge.badgeId)) ?? []).map(badge => ({
      tier: '0',
      points: '0',
      badge: {
        ...badge
      }
    }))

    const activeBadges = [...(data?.accountBadges ?? []), ...unclaimedBadges] as Badge[]


    for (const badge of activeBadges) {
      try {
        await this.updateBadgeDataForAccount(eoas, badge);
      } catch (e) {
        console.error('Error updating badge data:', badge.badge.badgeId);
      }
    }

    return this.badges;
  }



  // public async updateBadge(
  //   account: string,
  //   badgeId: string,
  // ) {
  //   const { data: accountBadge, error: accountBadgeError } = await this.supabase
  //     .from('accountbadges')
  //     .select('*')
  //     .eq('badgeid', badgeId)
  //     .eq('account', account)
  //     .eq('isdeleted', false)
  //     .single();

  //   if (accountBadgeError) {
  //     console.error(
  //       `Error fetching badge for account ${account}:`,
  //       accountBadgeError
  //     );
  //     throw new Error('Error fetching badge for account');
  //   }
  //   const { data, error } = await this.supabase
  //     .from('accountbadges')
  //     .update({ ...params })
  //     .eq('id', accountBadge.id)
  //     .select();
  //   if (error) {
  //     console.error('Error updating badge:', error);
  //     throw new Error('Error updating badge');
  //   }
  //   return data;
  // }

  private async updateBadgeDataForAccount(
    eoas: string[],
    badgeData: Badge,
  ) {
    const dummy: string = 'OP Mainnet User'
    switch (dummy) {
      case 'OP Mainnet User':
        const optimismTransactions = await this.helper.getOptimisimTransactions(
          eoas,
        );
        if (!badgeData.badge.badgeTiers) throw new Error('No tiers found for badge');
        let optimismTier = null;
        for (let i = badgeData.badge.badgeTiers.length - 1; i >= 0; i--) {
          if (optimismTransactions >= 2) {
            optimismTier = i + 1;
            break;
          }
        }
        this.badges.push({
          ...badgeData,
          claimableTier: optimismTier,
          claimable:  optimismTier ?  badgeData.tier < optimismTier : false,
        });

        break;
      // case 'Base User':
      //   const baseTransactions = await this.helper.getBaseTransactions(
      //     eoas,
      //     params.blockNumber
      //   );

      //   let baseTier = null;
      //   for (let i = (badge.tiers as Tiers[]).length - 1; i >= 0; i--) {
      //     if (baseTransactions >= (badge.tiers as Tiers[])[i].minValue) {
      //       baseTier = i;
      //       break;
      //     }
      //   }

      //   const basePoints = this.getBadgeTotalPoints({
      //     ...badge,
      //     favorite: params.favorite,
      //     claimableTier: baseTier,
      //     lastclaimtier: params.lastClaimTier,
      //   });
      //   this.badges.push({
      //     ...badge,
      //     favorite: params.favorite,
      //     claimableTier: baseTier,
      //     lastclaimtier: params.lastClaimTier,
      //     points: basePoints,
      //     claimable: params.lastClaimTier !== baseTier,

      //   });
      //   break;
    }

    //   case 'Mode transactions':
    //     const modeTransactions = await this.helper.getModeTransactions(
    //       eoas,
    //       params.blockNumber
    //     );

    //     let modePoints = 0;
    //     if (modeTransactions > 250) {
    //       modePoints = 50;
    //     } else if (modeTransactions > 100) {
    //       modePoints = 40;
    //     } else if (modeTransactions > 50) {
    //       modePoints = 30;
    //     } else if (modeTransactions > 20) {
    //       modePoints = 20;
    //     } else if (modeTransactions > 10) {
    //       modePoints = 10;
    //     }
    //     modePoints -= params.points;
    //     this.badges.push({
    //       name: badge.name,
    //       points: modePoints,
    //       id: badge.id,
    //     });
    //     break;

    //   case 'Citizen':
    //     let isCitizen = await this.helper.isCitizen(eoas);
    //     isCitizen = isCitizen && !params.points;
    //     this.badges.push({
    //       name: badge.name,
    //       points: isCitizen ? 100 : 0,
    //       id: badge.id,
    //     });
    //     break;

    //   case 'Nouns':
    //     const countNouns = await this.helper.hasNouns(eoas);
    //     let nounsPoints = 0;
    //     if (countNouns > 5) {
    //       nounsPoints = 30;
    //     } else if (countNouns > 3) {
    //       nounsPoints = 20;
    //     } else if (countNouns > 1) {
    //       nounsPoints = 10;
    //     }
    //     this.badges.push({
    //       name: badge.name,
    //       points: nounsPoints,
    //       id: badge.id,
    //     });
    //     break;
    // }
  }

  // public getTotalPoints(badges: ResponseBadges[]) {
  //   return badges.reduce((acc, badge) => {
  //     if (!badge.claimableTier) return acc;
  //     for (let i = 0; i < badge.claimableTier; i++) {
  //       acc += (badge.tiers as Tiers[])[i].points;
  //     }
  //     return acc;
  //   }, 0);
  // }

  // private getBadgeTotalPoints(badge: Badge) {
  //   let points = 0;
  //   if (!badge.claimableTier) return points;
  //   for (let i = 0; i < badge.claimableTier; i++) {
  //     points += (badge.tiers as Tiers[])[i].points;
  //   }
  //   return points;
  // }

  // public getClaimablePoints = (badges: ResponseBadges[]) =>
  //   badges.reduce((acc, badge) => {
  //     if (
  //       badge.claimableTier === null ||
  //       badge.claimableTier < (badge.lastclaimtier ?? 0)
  //     ) {
  //       return acc;
  //     }
  //     for (
  //       let i = badge.lastclaimtier ? badge.lastclaimtier + 1 : 0;
  //       i <= badge.claimableTier;
  //       i++
  //     ) {
  //       acc += (badge.tiers as Tiers[])[i].points;
  //     }
  //     return acc;
  //   }, 0);

  // private async getActiveBadges() {
  //   const { data: badges, error } = await this.supabase
  //     .from('badges')
  //     .select('*')
  //     .eq('isactive', true);

  //   if (error) {
  //     console.error('Error fetching active badges:', error);
  //     return [];
  //   }

  //   return badges;
  // }
}
