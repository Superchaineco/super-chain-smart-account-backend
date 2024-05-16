import { createSupabaseClient } from './supabase.service';
import { BadgesHelper, type IBadgesHelper } from './badges.helper';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, Tables } from '../types/database.types';

type _AccountBadge = Omit<
  Tables<'accountbadges'>,
  'account' | 'id' | 'isdeleted' | 'isClaimed' | 'lastclaim' | 'lastclaimBlock'
>;
type AccountBadge = Tables<'accountbadges'>;
export type Badge = Tables<'badges'>;
export type ResponseBadges = Omit<_AccountBadge, 'lastclaimblock' | 'badgeid'> &
  Omit<Badge, 'dataorigin' | 'isactive'>;

export class BadgesServices {
  private supabase = createSupabaseClient();
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
            points: 0,
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
        params =
          badge.dataOrigin === 'onChain'
            ? {
                blockNumber: accountBadge.lastClaimBlock,
                favorite: accountBadge.favorite,
              }
            : {
                timestamp: accountBadge.lastClaim,
                favorite: accountBadge.favorite,
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
    console.log(
      `Actualizando datos para la badge ${badge.name} del usuario ${account} con parámetros:`,
      params
    );
    switch (badge.name) {
      case 'OP Mainnet User':
        const optimismTransactions = await this.helper.getOptimisimTransactions(
          eoas,
          params.blockNumber
        );
        let optimismPoints = 0;
        if (optimismTransactions > 250) {
          optimismPoints = 50;
        } else if (optimismTransactions > 100) {
          optimismPoints = 40;
        } else if (optimismTransactions > 50) {
          optimismPoints = 30;
        } else if (optimismTransactions > 20) {
          optimismPoints = 20;
        } else if (optimismTransactions > 10) {
          optimismPoints = 10;
        }
        this.badges.push({
          ...badge,
          points: optimismPoints,
          favorite: params.favorite,
        });
        break;
      case 'Base User':
        const baseTransactions = await this.helper.getBaseTransactions(
          eoas,
          params.blockNumber
        );

        let basePoints = 0;
        if (baseTransactions > 250) {
          basePoints = 50;
        } else if (baseTransactions > 100) {
          basePoints = 40;
        } else if (baseTransactions > 50) {
          basePoints = 30;
        } else if (baseTransactions > 20) {
          basePoints = 20;
        } else if (baseTransactions > 10) {
          basePoints = 10;
        }
        this.badges.push({
          ...badge,
          points: basePoints,
          favorite: params.favorite,
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
