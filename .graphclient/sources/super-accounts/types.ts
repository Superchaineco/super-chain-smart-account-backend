// @ts-nocheck

import { InContextSdkMethod } from '@graphql-mesh/types';
import { MeshContext } from '@graphql-mesh/runtime';

export namespace SuperAccountsTypes {
  export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  BigDecimal: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Bytes: { input: any; output: any; }
  Int8: { input: any; output: any; }
  Timestamp: { input: any; output: any; }
};

export type AccountBadge = {
  id: Scalars['Bytes']['output'];
  user: SuperChainSmartAccount;
  badge: Badge;
  tier: Scalars['BigInt']['output'];
  points: Scalars['BigInt']['output'];
};

export type AccountBadge_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  user?: InputMaybe<Scalars['String']['input']>;
  user_not?: InputMaybe<Scalars['String']['input']>;
  user_gt?: InputMaybe<Scalars['String']['input']>;
  user_lt?: InputMaybe<Scalars['String']['input']>;
  user_gte?: InputMaybe<Scalars['String']['input']>;
  user_lte?: InputMaybe<Scalars['String']['input']>;
  user_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  user_contains?: InputMaybe<Scalars['String']['input']>;
  user_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_contains?: InputMaybe<Scalars['String']['input']>;
  user_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  user_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  user_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  user_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  user_?: InputMaybe<SuperChainSmartAccount_filter>;
  badge?: InputMaybe<Scalars['String']['input']>;
  badge_not?: InputMaybe<Scalars['String']['input']>;
  badge_gt?: InputMaybe<Scalars['String']['input']>;
  badge_lt?: InputMaybe<Scalars['String']['input']>;
  badge_gte?: InputMaybe<Scalars['String']['input']>;
  badge_lte?: InputMaybe<Scalars['String']['input']>;
  badge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  badge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  badge_contains?: InputMaybe<Scalars['String']['input']>;
  badge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_not_contains?: InputMaybe<Scalars['String']['input']>;
  badge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_starts_with?: InputMaybe<Scalars['String']['input']>;
  badge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  badge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_ends_with?: InputMaybe<Scalars['String']['input']>;
  badge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  badge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_?: InputMaybe<Badge_filter>;
  tier?: InputMaybe<Scalars['BigInt']['input']>;
  tier_not?: InputMaybe<Scalars['BigInt']['input']>;
  tier_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tier_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tier_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tier_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tier_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tier_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  points?: InputMaybe<Scalars['BigInt']['input']>;
  points_not?: InputMaybe<Scalars['BigInt']['input']>;
  points_gt?: InputMaybe<Scalars['BigInt']['input']>;
  points_lt?: InputMaybe<Scalars['BigInt']['input']>;
  points_gte?: InputMaybe<Scalars['BigInt']['input']>;
  points_lte?: InputMaybe<Scalars['BigInt']['input']>;
  points_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  points_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<AccountBadge_filter>>>;
  or?: InputMaybe<Array<InputMaybe<AccountBadge_filter>>>;
};

export type AccountBadge_orderBy =
  | 'id'
  | 'user'
  | 'user__id'
  | 'user__safe'
  | 'user__initialOwner'
  | 'user__superChainId'
  | 'user__noun_background'
  | 'user__noun_body'
  | 'user__noun_accessory'
  | 'user__noun_head'
  | 'user__noun_glasses'
  | 'user__blockNumber'
  | 'user__blockTimestamp'
  | 'user__transactionHash'
  | 'user__level'
  | 'user__points'
  | 'badge'
  | 'badge__id'
  | 'badge__badgeId'
  | 'badge__uri'
  | 'tier'
  | 'points';

export type Aggregation_interval =
  | 'hour'
  | 'day';

export type Badge = {
  id: Scalars['String']['output'];
  badgeId: Scalars['BigInt']['output'];
  uri: Scalars['String']['output'];
  badgeTiers: Array<BadgeTier>;
};


export type BadgebadgeTiersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BadgeTier_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<BadgeTier_filter>;
};

export type BadgeTier = {
  id: Scalars['String']['output'];
  points: Scalars['BigInt']['output'];
  tier: Scalars['BigInt']['output'];
  badge: Badge;
  uri: Scalars['String']['output'];
};

export type BadgeTier_filter = {
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  points?: InputMaybe<Scalars['BigInt']['input']>;
  points_not?: InputMaybe<Scalars['BigInt']['input']>;
  points_gt?: InputMaybe<Scalars['BigInt']['input']>;
  points_lt?: InputMaybe<Scalars['BigInt']['input']>;
  points_gte?: InputMaybe<Scalars['BigInt']['input']>;
  points_lte?: InputMaybe<Scalars['BigInt']['input']>;
  points_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  points_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tier?: InputMaybe<Scalars['BigInt']['input']>;
  tier_not?: InputMaybe<Scalars['BigInt']['input']>;
  tier_gt?: InputMaybe<Scalars['BigInt']['input']>;
  tier_lt?: InputMaybe<Scalars['BigInt']['input']>;
  tier_gte?: InputMaybe<Scalars['BigInt']['input']>;
  tier_lte?: InputMaybe<Scalars['BigInt']['input']>;
  tier_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tier_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  badge?: InputMaybe<Scalars['String']['input']>;
  badge_not?: InputMaybe<Scalars['String']['input']>;
  badge_gt?: InputMaybe<Scalars['String']['input']>;
  badge_lt?: InputMaybe<Scalars['String']['input']>;
  badge_gte?: InputMaybe<Scalars['String']['input']>;
  badge_lte?: InputMaybe<Scalars['String']['input']>;
  badge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  badge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  badge_contains?: InputMaybe<Scalars['String']['input']>;
  badge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_not_contains?: InputMaybe<Scalars['String']['input']>;
  badge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_starts_with?: InputMaybe<Scalars['String']['input']>;
  badge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  badge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_ends_with?: InputMaybe<Scalars['String']['input']>;
  badge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  badge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badge_?: InputMaybe<Badge_filter>;
  uri?: InputMaybe<Scalars['String']['input']>;
  uri_not?: InputMaybe<Scalars['String']['input']>;
  uri_gt?: InputMaybe<Scalars['String']['input']>;
  uri_lt?: InputMaybe<Scalars['String']['input']>;
  uri_gte?: InputMaybe<Scalars['String']['input']>;
  uri_lte?: InputMaybe<Scalars['String']['input']>;
  uri_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uri_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uri_contains?: InputMaybe<Scalars['String']['input']>;
  uri_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<BadgeTier_filter>>>;
  or?: InputMaybe<Array<InputMaybe<BadgeTier_filter>>>;
};

export type BadgeTier_orderBy =
  | 'id'
  | 'points'
  | 'tier'
  | 'badge'
  | 'badge__id'
  | 'badge__badgeId'
  | 'badge__uri'
  | 'uri';

export type Badge_filter = {
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badgeId?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_not?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  badgeId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  uri?: InputMaybe<Scalars['String']['input']>;
  uri_not?: InputMaybe<Scalars['String']['input']>;
  uri_gt?: InputMaybe<Scalars['String']['input']>;
  uri_lt?: InputMaybe<Scalars['String']['input']>;
  uri_gte?: InputMaybe<Scalars['String']['input']>;
  uri_lte?: InputMaybe<Scalars['String']['input']>;
  uri_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uri_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  uri_contains?: InputMaybe<Scalars['String']['input']>;
  uri_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains?: InputMaybe<Scalars['String']['input']>;
  uri_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  uri_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badgeTiers_?: InputMaybe<BadgeTier_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Badge_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Badge_filter>>>;
};

export type Badge_orderBy =
  | 'id'
  | 'badgeId'
  | 'uri'
  | 'badgeTiers';

export type BlockChangedFilter = {
  number_gte: Scalars['Int']['input'];
};

export type Block_height = {
  hash?: InputMaybe<Scalars['Bytes']['input']>;
  number?: InputMaybe<Scalars['Int']['input']>;
  number_gte?: InputMaybe<Scalars['Int']['input']>;
};

export type EIP712DomainChanged = {
  id: Scalars['Bytes']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type EIP712DomainChanged_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<EIP712DomainChanged_filter>>>;
  or?: InputMaybe<Array<InputMaybe<EIP712DomainChanged_filter>>>;
};

export type EIP712DomainChanged_orderBy =
  | 'id'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type LevelClaim = {
  id: Scalars['Bytes']['output'];
  account: SuperChainSmartAccount;
  level: Scalars['BigInt']['output'];
  timestamp: Scalars['BigInt']['output'];
};

export type LevelClaim_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  account?: InputMaybe<Scalars['String']['input']>;
  account_not?: InputMaybe<Scalars['String']['input']>;
  account_gt?: InputMaybe<Scalars['String']['input']>;
  account_lt?: InputMaybe<Scalars['String']['input']>;
  account_gte?: InputMaybe<Scalars['String']['input']>;
  account_lte?: InputMaybe<Scalars['String']['input']>;
  account_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  account_contains?: InputMaybe<Scalars['String']['input']>;
  account_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_contains?: InputMaybe<Scalars['String']['input']>;
  account_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  account_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  account_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  account_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  account_?: InputMaybe<SuperChainSmartAccount_filter>;
  level?: InputMaybe<Scalars['BigInt']['input']>;
  level_not?: InputMaybe<Scalars['BigInt']['input']>;
  level_gt?: InputMaybe<Scalars['BigInt']['input']>;
  level_lt?: InputMaybe<Scalars['BigInt']['input']>;
  level_gte?: InputMaybe<Scalars['BigInt']['input']>;
  level_lte?: InputMaybe<Scalars['BigInt']['input']>;
  level_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  level_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  timestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  timestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<LevelClaim_filter>>>;
  or?: InputMaybe<Array<InputMaybe<LevelClaim_filter>>>;
};

export type LevelClaim_orderBy =
  | 'id'
  | 'account'
  | 'account__id'
  | 'account__safe'
  | 'account__initialOwner'
  | 'account__superChainId'
  | 'account__noun_background'
  | 'account__noun_body'
  | 'account__noun_accessory'
  | 'account__noun_head'
  | 'account__noun_glasses'
  | 'account__blockNumber'
  | 'account__blockTimestamp'
  | 'account__transactionHash'
  | 'account__level'
  | 'account__points'
  | 'level'
  | 'timestamp';

export type Meta = {
  id: Scalars['String']['output'];
  count: Scalars['BigInt']['output'];
};

export type Meta_filter = {
  id?: InputMaybe<Scalars['String']['input']>;
  id_not?: InputMaybe<Scalars['String']['input']>;
  id_gt?: InputMaybe<Scalars['String']['input']>;
  id_lt?: InputMaybe<Scalars['String']['input']>;
  id_gte?: InputMaybe<Scalars['String']['input']>;
  id_lte?: InputMaybe<Scalars['String']['input']>;
  id_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  id_contains?: InputMaybe<Scalars['String']['input']>;
  id_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_contains?: InputMaybe<Scalars['String']['input']>;
  id_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  id_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  id_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  id_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  count?: InputMaybe<Scalars['BigInt']['input']>;
  count_not?: InputMaybe<Scalars['BigInt']['input']>;
  count_gt?: InputMaybe<Scalars['BigInt']['input']>;
  count_lt?: InputMaybe<Scalars['BigInt']['input']>;
  count_gte?: InputMaybe<Scalars['BigInt']['input']>;
  count_lte?: InputMaybe<Scalars['BigInt']['input']>;
  count_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  count_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Meta_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Meta_filter>>>;
};

export type Meta_orderBy =
  | 'id'
  | 'count';

/** Defines the order direction, either ascending or descending */
export type OrderDirection =
  | 'asc'
  | 'desc';

export type OwnerAdded = {
  id: Scalars['Bytes']['output'];
  safe: Scalars['Bytes']['output'];
  newOwner: Scalars['Bytes']['output'];
  superChainId: Scalars['String']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  superChainSmartAccount: SuperChainSmartAccount;
};

export type OwnerAdded_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  safe?: InputMaybe<Scalars['Bytes']['input']>;
  safe_not?: InputMaybe<Scalars['Bytes']['input']>;
  safe_gt?: InputMaybe<Scalars['Bytes']['input']>;
  safe_lt?: InputMaybe<Scalars['Bytes']['input']>;
  safe_gte?: InputMaybe<Scalars['Bytes']['input']>;
  safe_lte?: InputMaybe<Scalars['Bytes']['input']>;
  safe_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  safe_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  safe_contains?: InputMaybe<Scalars['Bytes']['input']>;
  safe_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_not?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  newOwner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  newOwner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  superChainId?: InputMaybe<Scalars['String']['input']>;
  superChainId_not?: InputMaybe<Scalars['String']['input']>;
  superChainId_gt?: InputMaybe<Scalars['String']['input']>;
  superChainId_lt?: InputMaybe<Scalars['String']['input']>;
  superChainId_gte?: InputMaybe<Scalars['String']['input']>;
  superChainId_lte?: InputMaybe<Scalars['String']['input']>;
  superChainId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainId_contains?: InputMaybe<Scalars['String']['input']>;
  superChainId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  superChainSmartAccount?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_gt?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_lt?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_gte?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_lte?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainSmartAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainSmartAccount_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_?: InputMaybe<SuperChainSmartAccount_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OwnerAdded_filter>>>;
  or?: InputMaybe<Array<InputMaybe<OwnerAdded_filter>>>;
};

export type OwnerAdded_orderBy =
  | 'id'
  | 'safe'
  | 'newOwner'
  | 'superChainId'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash'
  | 'superChainSmartAccount'
  | 'superChainSmartAccount__id'
  | 'superChainSmartAccount__safe'
  | 'superChainSmartAccount__initialOwner'
  | 'superChainSmartAccount__superChainId'
  | 'superChainSmartAccount__noun_background'
  | 'superChainSmartAccount__noun_body'
  | 'superChainSmartAccount__noun_accessory'
  | 'superChainSmartAccount__noun_head'
  | 'superChainSmartAccount__noun_glasses'
  | 'superChainSmartAccount__blockNumber'
  | 'superChainSmartAccount__blockTimestamp'
  | 'superChainSmartAccount__transactionHash'
  | 'superChainSmartAccount__level'
  | 'superChainSmartAccount__points';

export type OwnerPopulated = {
  id: Scalars['Bytes']['output'];
  safe: Scalars['Bytes']['output'];
  newOwner: Scalars['Bytes']['output'];
  superChainId: Scalars['String']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  superChainSmartAccount: SuperChainSmartAccount;
};

export type OwnerPopulated_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  safe?: InputMaybe<Scalars['Bytes']['input']>;
  safe_not?: InputMaybe<Scalars['Bytes']['input']>;
  safe_gt?: InputMaybe<Scalars['Bytes']['input']>;
  safe_lt?: InputMaybe<Scalars['Bytes']['input']>;
  safe_gte?: InputMaybe<Scalars['Bytes']['input']>;
  safe_lte?: InputMaybe<Scalars['Bytes']['input']>;
  safe_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  safe_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  safe_contains?: InputMaybe<Scalars['Bytes']['input']>;
  safe_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_not?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  newOwner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  newOwner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  newOwner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  superChainId?: InputMaybe<Scalars['String']['input']>;
  superChainId_not?: InputMaybe<Scalars['String']['input']>;
  superChainId_gt?: InputMaybe<Scalars['String']['input']>;
  superChainId_lt?: InputMaybe<Scalars['String']['input']>;
  superChainId_gte?: InputMaybe<Scalars['String']['input']>;
  superChainId_lte?: InputMaybe<Scalars['String']['input']>;
  superChainId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainId_contains?: InputMaybe<Scalars['String']['input']>;
  superChainId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  superChainSmartAccount?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_gt?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_lt?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_gte?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_lte?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainSmartAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainSmartAccount_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_?: InputMaybe<SuperChainSmartAccount_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OwnerPopulated_filter>>>;
  or?: InputMaybe<Array<InputMaybe<OwnerPopulated_filter>>>;
};

export type OwnerPopulated_orderBy =
  | 'id'
  | 'safe'
  | 'newOwner'
  | 'superChainId'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash'
  | 'superChainSmartAccount'
  | 'superChainSmartAccount__id'
  | 'superChainSmartAccount__safe'
  | 'superChainSmartAccount__initialOwner'
  | 'superChainSmartAccount__superChainId'
  | 'superChainSmartAccount__noun_background'
  | 'superChainSmartAccount__noun_body'
  | 'superChainSmartAccount__noun_accessory'
  | 'superChainSmartAccount__noun_head'
  | 'superChainSmartAccount__noun_glasses'
  | 'superChainSmartAccount__blockNumber'
  | 'superChainSmartAccount__blockTimestamp'
  | 'superChainSmartAccount__transactionHash'
  | 'superChainSmartAccount__level'
  | 'superChainSmartAccount__points';

export type OwnerPopulationRemoved = {
  id: Scalars['Bytes']['output'];
  safe: Scalars['Bytes']['output'];
  owner: Scalars['Bytes']['output'];
  superChainId: Scalars['String']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  superChainSmartAccount: SuperChainSmartAccount;
};

export type OwnerPopulationRemoved_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  safe?: InputMaybe<Scalars['Bytes']['input']>;
  safe_not?: InputMaybe<Scalars['Bytes']['input']>;
  safe_gt?: InputMaybe<Scalars['Bytes']['input']>;
  safe_lt?: InputMaybe<Scalars['Bytes']['input']>;
  safe_gte?: InputMaybe<Scalars['Bytes']['input']>;
  safe_lte?: InputMaybe<Scalars['Bytes']['input']>;
  safe_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  safe_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  safe_contains?: InputMaybe<Scalars['Bytes']['input']>;
  safe_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  owner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  owner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  owner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  owner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  superChainId?: InputMaybe<Scalars['String']['input']>;
  superChainId_not?: InputMaybe<Scalars['String']['input']>;
  superChainId_gt?: InputMaybe<Scalars['String']['input']>;
  superChainId_lt?: InputMaybe<Scalars['String']['input']>;
  superChainId_gte?: InputMaybe<Scalars['String']['input']>;
  superChainId_lte?: InputMaybe<Scalars['String']['input']>;
  superChainId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainId_contains?: InputMaybe<Scalars['String']['input']>;
  superChainId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  superChainSmartAccount?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_gt?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_lt?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_gte?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_lte?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainSmartAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainSmartAccount_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_?: InputMaybe<SuperChainSmartAccount_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<OwnerPopulationRemoved_filter>>>;
  or?: InputMaybe<Array<InputMaybe<OwnerPopulationRemoved_filter>>>;
};

export type OwnerPopulationRemoved_orderBy =
  | 'id'
  | 'safe'
  | 'owner'
  | 'superChainId'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash'
  | 'superChainSmartAccount'
  | 'superChainSmartAccount__id'
  | 'superChainSmartAccount__safe'
  | 'superChainSmartAccount__initialOwner'
  | 'superChainSmartAccount__superChainId'
  | 'superChainSmartAccount__noun_background'
  | 'superChainSmartAccount__noun_body'
  | 'superChainSmartAccount__noun_accessory'
  | 'superChainSmartAccount__noun_head'
  | 'superChainSmartAccount__noun_glasses'
  | 'superChainSmartAccount__blockNumber'
  | 'superChainSmartAccount__blockTimestamp'
  | 'superChainSmartAccount__transactionHash'
  | 'superChainSmartAccount__level'
  | 'superChainSmartAccount__points';

export type PointsIncremented = {
  id: Scalars['Bytes']['output'];
  recipient: Scalars['Bytes']['output'];
  points: Scalars['BigInt']['output'];
  levelUp: Scalars['Boolean']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  superChainSmartAccount: SuperChainSmartAccount;
};

export type PointsIncremented_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  recipient?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_not?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_gt?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_lt?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_gte?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_lte?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  recipient_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  recipient_contains?: InputMaybe<Scalars['Bytes']['input']>;
  recipient_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  points?: InputMaybe<Scalars['BigInt']['input']>;
  points_not?: InputMaybe<Scalars['BigInt']['input']>;
  points_gt?: InputMaybe<Scalars['BigInt']['input']>;
  points_lt?: InputMaybe<Scalars['BigInt']['input']>;
  points_gte?: InputMaybe<Scalars['BigInt']['input']>;
  points_lte?: InputMaybe<Scalars['BigInt']['input']>;
  points_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  points_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  levelUp?: InputMaybe<Scalars['Boolean']['input']>;
  levelUp_not?: InputMaybe<Scalars['Boolean']['input']>;
  levelUp_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  levelUp_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  superChainSmartAccount?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_gt?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_lt?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_gte?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_lte?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainSmartAccount_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainSmartAccount_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_?: InputMaybe<SuperChainSmartAccount_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<PointsIncremented_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PointsIncremented_filter>>>;
};

export type PointsIncremented_orderBy =
  | 'id'
  | 'recipient'
  | 'points'
  | 'levelUp'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash'
  | 'superChainSmartAccount'
  | 'superChainSmartAccount__id'
  | 'superChainSmartAccount__safe'
  | 'superChainSmartAccount__initialOwner'
  | 'superChainSmartAccount__superChainId'
  | 'superChainSmartAccount__noun_background'
  | 'superChainSmartAccount__noun_body'
  | 'superChainSmartAccount__noun_accessory'
  | 'superChainSmartAccount__noun_head'
  | 'superChainSmartAccount__noun_glasses'
  | 'superChainSmartAccount__blockNumber'
  | 'superChainSmartAccount__blockTimestamp'
  | 'superChainSmartAccount__transactionHash'
  | 'superChainSmartAccount__level'
  | 'superChainSmartAccount__points';

export type Query = {
  eip712DomainChanged?: Maybe<EIP712DomainChanged>;
  eip712DomainChangeds: Array<EIP712DomainChanged>;
  ownerAdded?: Maybe<OwnerAdded>;
  ownerAddeds: Array<OwnerAdded>;
  ownerPopulated?: Maybe<OwnerPopulated>;
  ownerPopulateds: Array<OwnerPopulated>;
  ownerPopulationRemoved?: Maybe<OwnerPopulationRemoved>;
  ownerPopulationRemoveds: Array<OwnerPopulationRemoved>;
  pointsIncremented?: Maybe<PointsIncremented>;
  pointsIncrementeds: Array<PointsIncremented>;
  superChainSmartAccount?: Maybe<SuperChainSmartAccount>;
  superChainSmartAccounts: Array<SuperChainSmartAccount>;
  badgeTier?: Maybe<BadgeTier>;
  badgeTiers: Array<BadgeTier>;
  badge?: Maybe<Badge>;
  badges: Array<Badge>;
  accountBadge?: Maybe<AccountBadge>;
  accountBadges: Array<AccountBadge>;
  tierTresholds?: Maybe<TierTresholds>;
  tierTresholds_collection: Array<TierTresholds>;
  levelClaim?: Maybe<LevelClaim>;
  levelClaims: Array<LevelClaim>;
  meta?: Maybe<Meta>;
  metas: Array<Meta>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type Queryeip712DomainChangedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Queryeip712DomainChangedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EIP712DomainChanged_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<EIP712DomainChanged_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryownerAddedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryownerAddedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnerAdded_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OwnerAdded_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryownerPopulatedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryownerPopulatedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnerPopulated_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OwnerPopulated_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryownerPopulationRemovedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryownerPopulationRemovedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnerPopulationRemoved_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OwnerPopulationRemoved_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypointsIncrementedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerypointsIncrementedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PointsIncremented_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PointsIncremented_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerysuperChainSmartAccountArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerysuperChainSmartAccountsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SuperChainSmartAccount_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SuperChainSmartAccount_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerybadgeTierArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerybadgeTiersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BadgeTier_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<BadgeTier_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerybadgeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerybadgesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Badge_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Badge_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaccountBadgeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QueryaccountBadgesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountBadge_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AccountBadge_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytierTresholdsArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerytierTresholds_collectionArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TierTresholds_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TierTresholds_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerylevelClaimArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerylevelClaimsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LevelClaim_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LevelClaim_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymetaArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type QuerymetasArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Meta_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Meta_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Query_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type Subscription = {
  eip712DomainChanged?: Maybe<EIP712DomainChanged>;
  eip712DomainChangeds: Array<EIP712DomainChanged>;
  ownerAdded?: Maybe<OwnerAdded>;
  ownerAddeds: Array<OwnerAdded>;
  ownerPopulated?: Maybe<OwnerPopulated>;
  ownerPopulateds: Array<OwnerPopulated>;
  ownerPopulationRemoved?: Maybe<OwnerPopulationRemoved>;
  ownerPopulationRemoveds: Array<OwnerPopulationRemoved>;
  pointsIncremented?: Maybe<PointsIncremented>;
  pointsIncrementeds: Array<PointsIncremented>;
  superChainSmartAccount?: Maybe<SuperChainSmartAccount>;
  superChainSmartAccounts: Array<SuperChainSmartAccount>;
  badgeTier?: Maybe<BadgeTier>;
  badgeTiers: Array<BadgeTier>;
  badge?: Maybe<Badge>;
  badges: Array<Badge>;
  accountBadge?: Maybe<AccountBadge>;
  accountBadges: Array<AccountBadge>;
  tierTresholds?: Maybe<TierTresholds>;
  tierTresholds_collection: Array<TierTresholds>;
  levelClaim?: Maybe<LevelClaim>;
  levelClaims: Array<LevelClaim>;
  meta?: Maybe<Meta>;
  metas: Array<Meta>;
  /** Access to subgraph metadata */
  _meta?: Maybe<_Meta_>;
};


export type Subscriptioneip712DomainChangedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscriptioneip712DomainChangedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<EIP712DomainChanged_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<EIP712DomainChanged_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionownerAddedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionownerAddedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnerAdded_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OwnerAdded_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionownerPopulatedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionownerPopulatedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnerPopulated_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OwnerPopulated_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionownerPopulationRemovedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionownerPopulationRemovedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<OwnerPopulationRemoved_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<OwnerPopulationRemoved_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpointsIncrementedArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionpointsIncrementedsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PointsIncremented_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PointsIncremented_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionsuperChainSmartAccountArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionsuperChainSmartAccountsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<SuperChainSmartAccount_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<SuperChainSmartAccount_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionbadgeTierArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionbadgeTiersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BadgeTier_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<BadgeTier_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionbadgeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionbadgesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Badge_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Badge_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaccountBadgeArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionaccountBadgesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountBadge_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AccountBadge_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontierTresholdsArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptiontierTresholds_collectionArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<TierTresholds_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<TierTresholds_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionlevelClaimArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionlevelClaimsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LevelClaim_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LevelClaim_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmetaArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type SubscriptionmetasArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Meta_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Meta_filter>;
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};


export type Subscription_metaArgs = {
  block?: InputMaybe<Block_height>;
};

export type SuperChainSmartAccount = {
  id: Scalars['Bytes']['output'];
  safe: Scalars['Bytes']['output'];
  initialOwner: Scalars['Bytes']['output'];
  superChainId: Scalars['String']['output'];
  noun_background: Scalars['BigInt']['output'];
  noun_body: Scalars['BigInt']['output'];
  noun_accessory: Scalars['BigInt']['output'];
  noun_head: Scalars['BigInt']['output'];
  noun_glasses: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
  level: Scalars['BigInt']['output'];
  points: Scalars['BigInt']['output'];
  badges: Array<AccountBadge>;
  levels: Array<LevelClaim>;
};


export type SuperChainSmartAccountbadgesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<AccountBadge_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<AccountBadge_filter>;
};


export type SuperChainSmartAccountlevelsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<LevelClaim_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<LevelClaim_filter>;
};

export type SuperChainSmartAccount_filter = {
  id?: InputMaybe<Scalars['Bytes']['input']>;
  id_not?: InputMaybe<Scalars['Bytes']['input']>;
  id_gt?: InputMaybe<Scalars['Bytes']['input']>;
  id_lt?: InputMaybe<Scalars['Bytes']['input']>;
  id_gte?: InputMaybe<Scalars['Bytes']['input']>;
  id_lte?: InputMaybe<Scalars['Bytes']['input']>;
  id_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  id_contains?: InputMaybe<Scalars['Bytes']['input']>;
  id_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  safe?: InputMaybe<Scalars['Bytes']['input']>;
  safe_not?: InputMaybe<Scalars['Bytes']['input']>;
  safe_gt?: InputMaybe<Scalars['Bytes']['input']>;
  safe_lt?: InputMaybe<Scalars['Bytes']['input']>;
  safe_gte?: InputMaybe<Scalars['Bytes']['input']>;
  safe_lte?: InputMaybe<Scalars['Bytes']['input']>;
  safe_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  safe_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  safe_contains?: InputMaybe<Scalars['Bytes']['input']>;
  safe_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  initialOwner?: InputMaybe<Scalars['Bytes']['input']>;
  initialOwner_not?: InputMaybe<Scalars['Bytes']['input']>;
  initialOwner_gt?: InputMaybe<Scalars['Bytes']['input']>;
  initialOwner_lt?: InputMaybe<Scalars['Bytes']['input']>;
  initialOwner_gte?: InputMaybe<Scalars['Bytes']['input']>;
  initialOwner_lte?: InputMaybe<Scalars['Bytes']['input']>;
  initialOwner_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  initialOwner_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  initialOwner_contains?: InputMaybe<Scalars['Bytes']['input']>;
  initialOwner_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  superChainId?: InputMaybe<Scalars['String']['input']>;
  superChainId_not?: InputMaybe<Scalars['String']['input']>;
  superChainId_gt?: InputMaybe<Scalars['String']['input']>;
  superChainId_lt?: InputMaybe<Scalars['String']['input']>;
  superChainId_gte?: InputMaybe<Scalars['String']['input']>;
  superChainId_lte?: InputMaybe<Scalars['String']['input']>;
  superChainId_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainId_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  superChainId_contains?: InputMaybe<Scalars['String']['input']>;
  superChainId_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainId_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  noun_background?: InputMaybe<Scalars['BigInt']['input']>;
  noun_background_not?: InputMaybe<Scalars['BigInt']['input']>;
  noun_background_gt?: InputMaybe<Scalars['BigInt']['input']>;
  noun_background_lt?: InputMaybe<Scalars['BigInt']['input']>;
  noun_background_gte?: InputMaybe<Scalars['BigInt']['input']>;
  noun_background_lte?: InputMaybe<Scalars['BigInt']['input']>;
  noun_background_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  noun_background_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  noun_body?: InputMaybe<Scalars['BigInt']['input']>;
  noun_body_not?: InputMaybe<Scalars['BigInt']['input']>;
  noun_body_gt?: InputMaybe<Scalars['BigInt']['input']>;
  noun_body_lt?: InputMaybe<Scalars['BigInt']['input']>;
  noun_body_gte?: InputMaybe<Scalars['BigInt']['input']>;
  noun_body_lte?: InputMaybe<Scalars['BigInt']['input']>;
  noun_body_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  noun_body_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  noun_accessory?: InputMaybe<Scalars['BigInt']['input']>;
  noun_accessory_not?: InputMaybe<Scalars['BigInt']['input']>;
  noun_accessory_gt?: InputMaybe<Scalars['BigInt']['input']>;
  noun_accessory_lt?: InputMaybe<Scalars['BigInt']['input']>;
  noun_accessory_gte?: InputMaybe<Scalars['BigInt']['input']>;
  noun_accessory_lte?: InputMaybe<Scalars['BigInt']['input']>;
  noun_accessory_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  noun_accessory_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  noun_head?: InputMaybe<Scalars['BigInt']['input']>;
  noun_head_not?: InputMaybe<Scalars['BigInt']['input']>;
  noun_head_gt?: InputMaybe<Scalars['BigInt']['input']>;
  noun_head_lt?: InputMaybe<Scalars['BigInt']['input']>;
  noun_head_gte?: InputMaybe<Scalars['BigInt']['input']>;
  noun_head_lte?: InputMaybe<Scalars['BigInt']['input']>;
  noun_head_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  noun_head_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  noun_glasses?: InputMaybe<Scalars['BigInt']['input']>;
  noun_glasses_not?: InputMaybe<Scalars['BigInt']['input']>;
  noun_glasses_gt?: InputMaybe<Scalars['BigInt']['input']>;
  noun_glasses_lt?: InputMaybe<Scalars['BigInt']['input']>;
  noun_glasses_gte?: InputMaybe<Scalars['BigInt']['input']>;
  noun_glasses_lte?: InputMaybe<Scalars['BigInt']['input']>;
  noun_glasses_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  noun_glasses_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockNumber_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockNumber_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_not?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lt?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_gte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_lte?: InputMaybe<Scalars['BigInt']['input']>;
  blockTimestamp_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  blockTimestamp_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  transactionHash?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lt?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_gte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_lte?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  transactionHash_contains?: InputMaybe<Scalars['Bytes']['input']>;
  transactionHash_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  level?: InputMaybe<Scalars['BigInt']['input']>;
  level_not?: InputMaybe<Scalars['BigInt']['input']>;
  level_gt?: InputMaybe<Scalars['BigInt']['input']>;
  level_lt?: InputMaybe<Scalars['BigInt']['input']>;
  level_gte?: InputMaybe<Scalars['BigInt']['input']>;
  level_lte?: InputMaybe<Scalars['BigInt']['input']>;
  level_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  level_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  points?: InputMaybe<Scalars['BigInt']['input']>;
  points_not?: InputMaybe<Scalars['BigInt']['input']>;
  points_gt?: InputMaybe<Scalars['BigInt']['input']>;
  points_lt?: InputMaybe<Scalars['BigInt']['input']>;
  points_gte?: InputMaybe<Scalars['BigInt']['input']>;
  points_lte?: InputMaybe<Scalars['BigInt']['input']>;
  points_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  points_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  badges_?: InputMaybe<AccountBadge_filter>;
  levels_?: InputMaybe<LevelClaim_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<SuperChainSmartAccount_filter>>>;
  or?: InputMaybe<Array<InputMaybe<SuperChainSmartAccount_filter>>>;
};

export type SuperChainSmartAccount_orderBy =
  | 'id'
  | 'safe'
  | 'initialOwner'
  | 'superChainId'
  | 'noun_background'
  | 'noun_body'
  | 'noun_accessory'
  | 'noun_head'
  | 'noun_glasses'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash'
  | 'level'
  | 'points'
  | 'badges'
  | 'levels';

export type TierTresholds = {
  id: Scalars['ID']['output'];
  tresholds: Array<Scalars['BigInt']['output']>;
};

export type TierTresholds_filter = {
  id?: InputMaybe<Scalars['ID']['input']>;
  id_not?: InputMaybe<Scalars['ID']['input']>;
  id_gt?: InputMaybe<Scalars['ID']['input']>;
  id_lt?: InputMaybe<Scalars['ID']['input']>;
  id_gte?: InputMaybe<Scalars['ID']['input']>;
  id_lte?: InputMaybe<Scalars['ID']['input']>;
  id_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  id_not_in?: InputMaybe<Array<Scalars['ID']['input']>>;
  tresholds?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tresholds_not?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tresholds_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tresholds_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tresholds_not_contains?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  tresholds_not_contains_nocase?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<TierTresholds_filter>>>;
  or?: InputMaybe<Array<InputMaybe<TierTresholds_filter>>>;
};

export type TierTresholds_orderBy =
  | 'id'
  | 'tresholds';

export type _Block_ = {
  /** The hash of the block */
  hash?: Maybe<Scalars['Bytes']['output']>;
  /** The block number */
  number: Scalars['Int']['output'];
  /** Integer representation of the timestamp stored in blocks for the chain */
  timestamp?: Maybe<Scalars['Int']['output']>;
  /** The hash of the parent block */
  parentHash?: Maybe<Scalars['Bytes']['output']>;
};

/** The type for the top-level _meta field */
export type _Meta_ = {
  /**
   * Information about a specific subgraph block. The hash of the block
   * will be null if the _meta field has a block constraint that asks for
   * a block number. It will be filled if the _meta field has no block constraint
   * and therefore asks for the latest  block
   *
   */
  block: _Block_;
  /** The deployment ID */
  deployment: Scalars['String']['output'];
  /** If `true`, the subgraph encountered indexing errors at some past block */
  hasIndexingErrors: Scalars['Boolean']['output'];
};

export type _SubgraphErrorPolicy_ =
  /** Data will be returned even if the subgraph has indexing errors */
  | 'allow'
  /** If the subgraph has indexing errors, data will be omitted. The default. */
  | 'deny';

  export type QuerySdk = {
      /** null **/
  eip712DomainChanged: InContextSdkMethod<Query['eip712DomainChanged'], Queryeip712DomainChangedArgs, MeshContext>,
  /** null **/
  eip712DomainChangeds: InContextSdkMethod<Query['eip712DomainChangeds'], Queryeip712DomainChangedsArgs, MeshContext>,
  /** null **/
  ownerAdded: InContextSdkMethod<Query['ownerAdded'], QueryownerAddedArgs, MeshContext>,
  /** null **/
  ownerAddeds: InContextSdkMethod<Query['ownerAddeds'], QueryownerAddedsArgs, MeshContext>,
  /** null **/
  ownerPopulated: InContextSdkMethod<Query['ownerPopulated'], QueryownerPopulatedArgs, MeshContext>,
  /** null **/
  ownerPopulateds: InContextSdkMethod<Query['ownerPopulateds'], QueryownerPopulatedsArgs, MeshContext>,
  /** null **/
  ownerPopulationRemoved: InContextSdkMethod<Query['ownerPopulationRemoved'], QueryownerPopulationRemovedArgs, MeshContext>,
  /** null **/
  ownerPopulationRemoveds: InContextSdkMethod<Query['ownerPopulationRemoveds'], QueryownerPopulationRemovedsArgs, MeshContext>,
  /** null **/
  pointsIncremented: InContextSdkMethod<Query['pointsIncremented'], QuerypointsIncrementedArgs, MeshContext>,
  /** null **/
  pointsIncrementeds: InContextSdkMethod<Query['pointsIncrementeds'], QuerypointsIncrementedsArgs, MeshContext>,
  /** null **/
  superChainSmartAccount: InContextSdkMethod<Query['superChainSmartAccount'], QuerysuperChainSmartAccountArgs, MeshContext>,
  /** null **/
  superChainSmartAccounts: InContextSdkMethod<Query['superChainSmartAccounts'], QuerysuperChainSmartAccountsArgs, MeshContext>,
  /** null **/
  badgeTier: InContextSdkMethod<Query['badgeTier'], QuerybadgeTierArgs, MeshContext>,
  /** null **/
  badgeTiers: InContextSdkMethod<Query['badgeTiers'], QuerybadgeTiersArgs, MeshContext>,
  /** null **/
  badge: InContextSdkMethod<Query['badge'], QuerybadgeArgs, MeshContext>,
  /** null **/
  badges: InContextSdkMethod<Query['badges'], QuerybadgesArgs, MeshContext>,
  /** null **/
  accountBadge: InContextSdkMethod<Query['accountBadge'], QueryaccountBadgeArgs, MeshContext>,
  /** null **/
  accountBadges: InContextSdkMethod<Query['accountBadges'], QueryaccountBadgesArgs, MeshContext>,
  /** null **/
  tierTresholds: InContextSdkMethod<Query['tierTresholds'], QuerytierTresholdsArgs, MeshContext>,
  /** null **/
  tierTresholds_collection: InContextSdkMethod<Query['tierTresholds_collection'], QuerytierTresholds_collectionArgs, MeshContext>,
  /** null **/
  levelClaim: InContextSdkMethod<Query['levelClaim'], QuerylevelClaimArgs, MeshContext>,
  /** null **/
  levelClaims: InContextSdkMethod<Query['levelClaims'], QuerylevelClaimsArgs, MeshContext>,
  /** null **/
  meta: InContextSdkMethod<Query['meta'], QuerymetaArgs, MeshContext>,
  /** null **/
  metas: InContextSdkMethod<Query['metas'], QuerymetasArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Query['_meta'], Query_metaArgs, MeshContext>
  };

  export type MutationSdk = {
    
  };

  export type SubscriptionSdk = {
      /** null **/
  eip712DomainChanged: InContextSdkMethod<Subscription['eip712DomainChanged'], Subscriptioneip712DomainChangedArgs, MeshContext>,
  /** null **/
  eip712DomainChangeds: InContextSdkMethod<Subscription['eip712DomainChangeds'], Subscriptioneip712DomainChangedsArgs, MeshContext>,
  /** null **/
  ownerAdded: InContextSdkMethod<Subscription['ownerAdded'], SubscriptionownerAddedArgs, MeshContext>,
  /** null **/
  ownerAddeds: InContextSdkMethod<Subscription['ownerAddeds'], SubscriptionownerAddedsArgs, MeshContext>,
  /** null **/
  ownerPopulated: InContextSdkMethod<Subscription['ownerPopulated'], SubscriptionownerPopulatedArgs, MeshContext>,
  /** null **/
  ownerPopulateds: InContextSdkMethod<Subscription['ownerPopulateds'], SubscriptionownerPopulatedsArgs, MeshContext>,
  /** null **/
  ownerPopulationRemoved: InContextSdkMethod<Subscription['ownerPopulationRemoved'], SubscriptionownerPopulationRemovedArgs, MeshContext>,
  /** null **/
  ownerPopulationRemoveds: InContextSdkMethod<Subscription['ownerPopulationRemoveds'], SubscriptionownerPopulationRemovedsArgs, MeshContext>,
  /** null **/
  pointsIncremented: InContextSdkMethod<Subscription['pointsIncremented'], SubscriptionpointsIncrementedArgs, MeshContext>,
  /** null **/
  pointsIncrementeds: InContextSdkMethod<Subscription['pointsIncrementeds'], SubscriptionpointsIncrementedsArgs, MeshContext>,
  /** null **/
  superChainSmartAccount: InContextSdkMethod<Subscription['superChainSmartAccount'], SubscriptionsuperChainSmartAccountArgs, MeshContext>,
  /** null **/
  superChainSmartAccounts: InContextSdkMethod<Subscription['superChainSmartAccounts'], SubscriptionsuperChainSmartAccountsArgs, MeshContext>,
  /** null **/
  badgeTier: InContextSdkMethod<Subscription['badgeTier'], SubscriptionbadgeTierArgs, MeshContext>,
  /** null **/
  badgeTiers: InContextSdkMethod<Subscription['badgeTiers'], SubscriptionbadgeTiersArgs, MeshContext>,
  /** null **/
  badge: InContextSdkMethod<Subscription['badge'], SubscriptionbadgeArgs, MeshContext>,
  /** null **/
  badges: InContextSdkMethod<Subscription['badges'], SubscriptionbadgesArgs, MeshContext>,
  /** null **/
  accountBadge: InContextSdkMethod<Subscription['accountBadge'], SubscriptionaccountBadgeArgs, MeshContext>,
  /** null **/
  accountBadges: InContextSdkMethod<Subscription['accountBadges'], SubscriptionaccountBadgesArgs, MeshContext>,
  /** null **/
  tierTresholds: InContextSdkMethod<Subscription['tierTresholds'], SubscriptiontierTresholdsArgs, MeshContext>,
  /** null **/
  tierTresholds_collection: InContextSdkMethod<Subscription['tierTresholds_collection'], SubscriptiontierTresholds_collectionArgs, MeshContext>,
  /** null **/
  levelClaim: InContextSdkMethod<Subscription['levelClaim'], SubscriptionlevelClaimArgs, MeshContext>,
  /** null **/
  levelClaims: InContextSdkMethod<Subscription['levelClaims'], SubscriptionlevelClaimsArgs, MeshContext>,
  /** null **/
  meta: InContextSdkMethod<Subscription['meta'], SubscriptionmetaArgs, MeshContext>,
  /** null **/
  metas: InContextSdkMethod<Subscription['metas'], SubscriptionmetasArgs, MeshContext>,
  /** Access to subgraph metadata **/
  _meta: InContextSdkMethod<Subscription['_meta'], Subscription_metaArgs, MeshContext>
  };

  export type Context = {
      ["super-accounts"]: { Query: QuerySdk, Mutation: MutationSdk, Subscription: SubscriptionSdk },
      
    };
}
