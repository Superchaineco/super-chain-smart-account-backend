import { Badge, ResponseBadge } from '../badges.service';
export interface BadgeStrategy {
  calculateTier(eoas: string[], badgeData: Badge, account?: string): Promise<ResponseBadge>;
}

export abstract class BaseBadgeStrategy implements BadgeStrategy {
  abstract getValue(
    eoas: string[],
    account?: string
  ): Promise<number | boolean>;

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
