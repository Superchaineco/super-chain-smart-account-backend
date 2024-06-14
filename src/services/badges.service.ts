import { BadgesHelper, type IBadgesHelper } from './badges.helper';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables, Tiers } from '../types/database.types';
import { SBclient } from './supabase.service';

type _AccountBadge = Omit<
  Tables<'accountbadges'>,
  'account' | 'id' | 'isdeleted' | 'isClaimed' | 'lastclaim' | 'lastclaimBlock'
>;
type AccountBadge = Tables<'accountbadges'>;
export type Badge = Tables<'badges'>;
export type ResponseBadges = Omit<_AccountBadge, 'lastclaimblock' | 'badgeid'> &
  Omit<Badge, 'dataorigin' | 'isactive'> & {
    claimableTier: number | null;
    points: number;
    claimable?: boolean;
  };

export class BadgesServices {
  private supabase = SBclient;
  private badges: ResponseBadges[] = [];
  private helper: IBadgesHelper;

  constructor() {
    this.helper = new BadgesHelper(
      this.supabase as unknown as SupabaseClient<Database>
    );
  }

  public async getBadges(
    eoas: string[],
    account: string
  ): Promise<ResponseBadges[]> {
    const {
      data: _account,
      error: accountError,
      count,
    } = await this.supabase
      .from('account')
      .select('*')
      .eq('address', account)
      .limit(1)
      .maybeSingle();

    const activeBadges = await this.getActiveBadges();
    if (accountError) throw new Error('Error fetching account data');
    if (!_account) {
      const createAccountResponse = await this.supabase
        .from('account')
        .insert([{ address: account }]);
      const addBadgesResponse = await this.supabase
        .from('accountbadges')
        .insert(
          activeBadges.map((badge) => ({
            badgeid: badge.id,
            account,
            lastclaim: new Date(),
            lastclaimblock: 0,
          }))
        );
      if (createAccountResponse.error || addBadgesResponse.error) {
        console.error('Error creating account:', createAccountResponse.error);
        throw new Error('Error creating account');
      }
    }

    for (const badge of activeBadges) {
      const { data: accountBadge, error } = await this.supabase
        .from('accountbadges')
        .select('*')
        .eq('badgeid', badge.id)
        .eq('account', account)
        .eq('isdeleted', false)
        .single();

      if (error) {
        console.error(`Error fetching badge for account ${account}:`, error);
        continue;
      }
      let params = {};
      if (accountBadge) {
        console.debug('Account badge:', accountBadge);
        params =
          badge.dataOrigin === 'onChain'
            ? {
                blockNumber: accountBadge.lastclaimblock,
                favorite: accountBadge.favorite,
                lastClaimTier: accountBadge.lastclaimtier,
              }
            : {
                timestamp: accountBadge.lastclaim,
                favorite: accountBadge.favorite,
                lastClaimTier: accountBadge.lastclaimtier,
              };
      }
      try {
        await this.updateBadgeDataForAccount(account, eoas, badge, params);
      } catch (e) {
        console.error('Error updating badge data:', badge.name);
      }
    }

    console.debug('Badges:', this.badges);
    return this.badges;
  }

  public async updateBadge(
    account: string,
    badgeId: string,
    params: Partial<AccountBadge>
  ) {
    const { data: accountBadge, error: accountBadgeError } = await this.supabase
      .from('accountbadges')
      .select('*')
      .eq('badgeid', badgeId)
      .eq('account', account)
      .eq('isdeleted', false)
      .single();

    if (accountBadgeError) {
      console.error(
        `Error fetching badge for account ${account}:`,
        accountBadgeError
      );
      throw new Error('Error fetching badge for account');
    }
    const { data, error } = await this.supabase
      .from('accountbadges')
      .update({ ...params })
      .eq('id', accountBadge.id)
      .select();
    if (error) {
      console.error('Error updating badge:', error);
      throw new Error('Error updating badge');
    }
    return data;
  }

  private async updateBadgeDataForAccount(
    account: string,
    eoas: string[],
    badge: Badge,
    params: any
  ) {
    switch (badge.name) {
      case 'OP Mainnet User':
        const optimismTransactions = await this.helper.getOptimisimTransactions(
          eoas,
          params.blockNumber
        );
        if (!badge.tiers) throw new Error('No tiers found for badge');
        let optimismTier = 0;
        for (let i = (badge.tiers as Tiers[]).length - 1; i >= 0; i--) {
          if (optimismTransactions >= (badge.tiers as Tiers[])[i].minValue) {
            optimismTier = i;
            break;
          }
        }
        const optimismPoints = this.getBadgeTotalPoints({
          ...badge,
          favorite: params.favorite,
          claimableTier: optimismTier,
          lastclaimtier: params.lastClaimTier,
        });
        this.badges.push({
          ...badge,
          favorite: params.favorite,
          claimableTier: optimismTier,
          lastclaimtier: params.lastClaimTier,
          points: optimismPoints,
          claimable: params.lastClaimTier !== optimismTier,
        });

        break;
      case 'Base User':
        const baseTransactions = await this.helper.getBaseTransactions(
          eoas,
          params.blockNumber
        );

        let baseTier = 0;
        for (let i = (badge.tiers as Tiers[]).length - 1; i >= 0; i--) {
          if (baseTransactions >= (badge.tiers as Tiers[])[i].minValue) {
            baseTier = i;
            break;
          }
        }

        const basePoints = this.getBadgeTotalPoints({
          ...badge,
          favorite: params.favorite,
          claimableTier: baseTier,
          lastclaimtier: params.lastClaimTier,
        });
        this.badges.push({
          ...badge,
          favorite: params.favorite,
          claimableTier: baseTier,
          lastclaimtier: params.lastClaimTier,
          points: basePoints,
          claimable: params.lastClaimTier !== baseTier,

        });
        break;
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

  public getTotalPoints(badges: ResponseBadges[]) {
    return badges.reduce((acc, badge) => {
      if (!badge.claimableTier) return acc;
      for (let i = 0; i < badge.claimableTier; i++) {
        acc += (badge.tiers as Tiers[])[i].points;
      }
      return acc;
    }, 0);
  }

  private getBadgeTotalPoints(badge: Omit<ResponseBadges, 'points'>) {
    let points = 0;
    if (!badge.claimableTier) return points;
    for (let i = 0; i < badge.claimableTier; i++) {
      points += (badge.tiers as Tiers[])[i].points;
    }
    return points;
  }

  public getClaimablePoints = (badges: ResponseBadges[]) =>
    badges.reduce((acc, badge) => {
      if (
        badge.claimableTier === null ||
        badge.claimableTier < (badge.lastclaimtier ?? 0)
      ) {
        console.log(!badge.claimableTier);
        return acc;
      }
      for (
        let i = badge.lastclaimtier ? badge.lastclaimtier + 1 : 0;
        i <= badge.claimableTier;
        i++
      ) {
        acc += (badge.tiers as Tiers[])[i].points;
      }
      return acc;
    }, 0);

  private async getActiveBadges() {
    const { data: badges, error } = await this.supabase
      .from('badges')
      .select('*')
      .eq('isactive', true);

    if (error) {
      console.error('Error fetching active badges:', error);
      return [];
    }

    return badges;
  }
}
