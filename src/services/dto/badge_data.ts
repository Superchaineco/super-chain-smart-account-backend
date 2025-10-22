
export type BadgeInfo = {
  badge_id: string;
  token_badge: boolean;
  count_unit: string;
  token_badge_data?: CriptoCurrency;
  tiers: BadgeTier[];
};

export type BadgeTier = CriptoCurrency & {
  tier_id: string;
};

export type CriptoCurrency = {
  symbol: string;
  amount: string;
};
