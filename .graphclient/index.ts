// @ts-nocheck
import {
  GraphQLResolveInfo,
  SelectionSetNode,
  FieldNode,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from 'graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
import { gql } from '@graphql-mesh/utils';

import type { GetMeshOptions } from '@graphql-mesh/runtime';
import type { YamlConfig } from '@graphql-mesh/types';
import { PubSub } from '@graphql-mesh/utils';
import { DefaultLogger } from '@graphql-mesh/utils';
import MeshCache from '@graphql-mesh/cache-localforage';
import { fetch as fetchFn } from '@whatwg-node/fetch';

import { MeshResolvedSource } from '@graphql-mesh/runtime';
import { MeshTransform, MeshPlugin } from '@graphql-mesh/types';
import GraphqlHandler from '@graphql-mesh/graphql';
import BareMerger from '@graphql-mesh/merger-bare';
import { printWithCache } from '@graphql-mesh/utils';
import { usePersistedOperations } from '@graphql-yoga/plugin-persisted-operations';
import { createMeshHTTPHandler, MeshHTTPHandler } from '@graphql-mesh/http';
import {
  getMesh,
  ExecuteMeshFn,
  SubscribeMeshFn,
  MeshContext as BaseMeshContext,
  MeshInstance,
} from '@graphql-mesh/runtime';
import { MeshStore, FsStoreStorageAdapter } from '@graphql-mesh/store';
import { path as pathModule } from '@graphql-mesh/cross-helpers';
import { ImportFn } from '@graphql-mesh/types';
import type { SuperAccountsTypes } from './sources/super-accounts/types';
import * as importedModule$0 from './sources/super-accounts/introspectionSchema';
import { SUBGRAPH_URI, SUBGRAPH_API_KEY } from '@/config/superChain/constants';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
    [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
  };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & {
  [P in K]-?: NonNullable<T[P]>;
};

/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  BigDecimal: { input: any; output: any };
  BigInt: { input: any; output: any };
  Bytes: { input: any; output: any };
  Int8: { input: any; output: any };
  Timestamp: { input: any; output: any };
};

export type AccountBadge = {
  id: Scalars['Bytes']['output'];
  user: SuperChainSmartAccount;
  badge: Badge;
  tier: Scalars['BigInt']['output'];
  points: Scalars['BigInt']['output'];
  perkClaims: Array<PerkRedemption>;
};

export type AccountBadgeperkClaimsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PerkRedemption_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PerkRedemption_filter>;
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
  perkClaims_?: InputMaybe<PerkRedemption_filter>;
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
  | 'points'
  | 'perkClaims';

export type Aggregation_interval = 'hour' | 'day';

export type Badge = {
  id: Scalars['String']['output'];
  badgeId: Scalars['BigInt']['output'];
  uri: Scalars['String']['output'];
  badgeTiers: Array<BadgeTier>;
  perks: Array<Perk>;
};

export type BadgebadgeTiersArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<BadgeTier_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<BadgeTier_filter>;
};

export type BadgeperksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Perk_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Perk_filter>;
};

export type BadgeTier = {
  id: Scalars['String']['output'];
  points: Scalars['BigInt']['output'];
  tier: Scalars['BigInt']['output'];
  badge: Badge;
  uri: Scalars['String']['output'];
  perk?: Maybe<Perk>;
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
  perk?: InputMaybe<Scalars['String']['input']>;
  perk_not?: InputMaybe<Scalars['String']['input']>;
  perk_gt?: InputMaybe<Scalars['String']['input']>;
  perk_lt?: InputMaybe<Scalars['String']['input']>;
  perk_gte?: InputMaybe<Scalars['String']['input']>;
  perk_lte?: InputMaybe<Scalars['String']['input']>;
  perk_in?: InputMaybe<Array<Scalars['String']['input']>>;
  perk_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  perk_contains?: InputMaybe<Scalars['String']['input']>;
  perk_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_not_contains?: InputMaybe<Scalars['String']['input']>;
  perk_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_starts_with?: InputMaybe<Scalars['String']['input']>;
  perk_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  perk_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_ends_with?: InputMaybe<Scalars['String']['input']>;
  perk_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  perk_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_?: InputMaybe<Perk_filter>;
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
  | 'uri'
  | 'perk'
  | 'perk__id'
  | 'perk__badgeId'
  | 'perk__tier'
  | 'perk__token'
  | 'perk__amount'
  | 'perk__maxClaims'
  | 'perk__totalClaims'
  | 'perk__isCompleted';

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
  perks_?: InputMaybe<Perk_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Badge_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Badge_filter>>>;
};

export type Badge_orderBy = 'id' | 'badgeId' | 'uri' | 'badgeTiers' | 'perks';

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

export type Meta_orderBy = 'id' | 'count';

/** Defines the order direction, either ascending or descending */
export type OrderDirection = 'asc' | 'desc';

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
  superChainSmartAccount_contains_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_starts_with?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
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
  superChainSmartAccount_contains_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_starts_with?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
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
  superChainSmartAccount_contains_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_starts_with?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
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

export type Perk = {
  id: Scalars['Bytes']['output'];
  badgeId: Scalars['BigInt']['output'];
  tier: Scalars['BigInt']['output'];
  badge: Badge;
  badgeTier?: Maybe<BadgeTier>;
  token: Scalars['Bytes']['output'];
  amount: Scalars['BigInt']['output'];
  maxClaims: Scalars['BigInt']['output'];
  totalClaims: Scalars['BigInt']['output'];
  isCompleted: Scalars['Boolean']['output'];
  perkClaims: Array<PerkRedemption>;
};

export type PerkperkClaimsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PerkRedemption_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PerkRedemption_filter>;
};

export type PerkRedemption = {
  id: Scalars['Bytes']['output'];
  perk: Perk;
  redeemer: Scalars['Bytes']['output'];
  accountBadge?: Maybe<AccountBadge>;
  token: Scalars['Bytes']['output'];
  amount: Scalars['BigInt']['output'];
  blockNumber: Scalars['BigInt']['output'];
  blockTimestamp: Scalars['BigInt']['output'];
  transactionHash: Scalars['Bytes']['output'];
};

export type PerkRedemption_filter = {
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
  perk?: InputMaybe<Scalars['String']['input']>;
  perk_not?: InputMaybe<Scalars['String']['input']>;
  perk_gt?: InputMaybe<Scalars['String']['input']>;
  perk_lt?: InputMaybe<Scalars['String']['input']>;
  perk_gte?: InputMaybe<Scalars['String']['input']>;
  perk_lte?: InputMaybe<Scalars['String']['input']>;
  perk_in?: InputMaybe<Array<Scalars['String']['input']>>;
  perk_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  perk_contains?: InputMaybe<Scalars['String']['input']>;
  perk_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_not_contains?: InputMaybe<Scalars['String']['input']>;
  perk_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_starts_with?: InputMaybe<Scalars['String']['input']>;
  perk_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  perk_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_ends_with?: InputMaybe<Scalars['String']['input']>;
  perk_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  perk_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  perk_?: InputMaybe<Perk_filter>;
  redeemer?: InputMaybe<Scalars['Bytes']['input']>;
  redeemer_not?: InputMaybe<Scalars['Bytes']['input']>;
  redeemer_gt?: InputMaybe<Scalars['Bytes']['input']>;
  redeemer_lt?: InputMaybe<Scalars['Bytes']['input']>;
  redeemer_gte?: InputMaybe<Scalars['Bytes']['input']>;
  redeemer_lte?: InputMaybe<Scalars['Bytes']['input']>;
  redeemer_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  redeemer_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  redeemer_contains?: InputMaybe<Scalars['Bytes']['input']>;
  redeemer_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  accountBadge?: InputMaybe<Scalars['String']['input']>;
  accountBadge_not?: InputMaybe<Scalars['String']['input']>;
  accountBadge_gt?: InputMaybe<Scalars['String']['input']>;
  accountBadge_lt?: InputMaybe<Scalars['String']['input']>;
  accountBadge_gte?: InputMaybe<Scalars['String']['input']>;
  accountBadge_lte?: InputMaybe<Scalars['String']['input']>;
  accountBadge_in?: InputMaybe<Array<Scalars['String']['input']>>;
  accountBadge_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  accountBadge_contains?: InputMaybe<Scalars['String']['input']>;
  accountBadge_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  accountBadge_not_contains?: InputMaybe<Scalars['String']['input']>;
  accountBadge_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  accountBadge_starts_with?: InputMaybe<Scalars['String']['input']>;
  accountBadge_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accountBadge_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  accountBadge_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accountBadge_ends_with?: InputMaybe<Scalars['String']['input']>;
  accountBadge_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accountBadge_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  accountBadge_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  accountBadge_?: InputMaybe<AccountBadge_filter>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  and?: InputMaybe<Array<InputMaybe<PerkRedemption_filter>>>;
  or?: InputMaybe<Array<InputMaybe<PerkRedemption_filter>>>;
};

export type PerkRedemption_orderBy =
  | 'id'
  | 'perk'
  | 'perk__id'
  | 'perk__badgeId'
  | 'perk__tier'
  | 'perk__token'
  | 'perk__amount'
  | 'perk__maxClaims'
  | 'perk__totalClaims'
  | 'perk__isCompleted'
  | 'redeemer'
  | 'accountBadge'
  | 'accountBadge__id'
  | 'accountBadge__tier'
  | 'accountBadge__points'
  | 'token'
  | 'amount'
  | 'blockNumber'
  | 'blockTimestamp'
  | 'transactionHash';

export type Perk_filter = {
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
  badgeId?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_not?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_gt?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_lt?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_gte?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_lte?: InputMaybe<Scalars['BigInt']['input']>;
  badgeId_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  badgeId_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
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
  badgeTier?: InputMaybe<Scalars['String']['input']>;
  badgeTier_not?: InputMaybe<Scalars['String']['input']>;
  badgeTier_gt?: InputMaybe<Scalars['String']['input']>;
  badgeTier_lt?: InputMaybe<Scalars['String']['input']>;
  badgeTier_gte?: InputMaybe<Scalars['String']['input']>;
  badgeTier_lte?: InputMaybe<Scalars['String']['input']>;
  badgeTier_in?: InputMaybe<Array<Scalars['String']['input']>>;
  badgeTier_not_in?: InputMaybe<Array<Scalars['String']['input']>>;
  badgeTier_contains?: InputMaybe<Scalars['String']['input']>;
  badgeTier_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  badgeTier_not_contains?: InputMaybe<Scalars['String']['input']>;
  badgeTier_not_contains_nocase?: InputMaybe<Scalars['String']['input']>;
  badgeTier_starts_with?: InputMaybe<Scalars['String']['input']>;
  badgeTier_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badgeTier_not_starts_with?: InputMaybe<Scalars['String']['input']>;
  badgeTier_not_starts_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badgeTier_ends_with?: InputMaybe<Scalars['String']['input']>;
  badgeTier_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badgeTier_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  badgeTier_not_ends_with_nocase?: InputMaybe<Scalars['String']['input']>;
  badgeTier_?: InputMaybe<BadgeTier_filter>;
  token?: InputMaybe<Scalars['Bytes']['input']>;
  token_not?: InputMaybe<Scalars['Bytes']['input']>;
  token_gt?: InputMaybe<Scalars['Bytes']['input']>;
  token_lt?: InputMaybe<Scalars['Bytes']['input']>;
  token_gte?: InputMaybe<Scalars['Bytes']['input']>;
  token_lte?: InputMaybe<Scalars['Bytes']['input']>;
  token_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_not_in?: InputMaybe<Array<Scalars['Bytes']['input']>>;
  token_contains?: InputMaybe<Scalars['Bytes']['input']>;
  token_not_contains?: InputMaybe<Scalars['Bytes']['input']>;
  amount?: InputMaybe<Scalars['BigInt']['input']>;
  amount_not?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lt?: InputMaybe<Scalars['BigInt']['input']>;
  amount_gte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_lte?: InputMaybe<Scalars['BigInt']['input']>;
  amount_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  amount_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxClaims?: InputMaybe<Scalars['BigInt']['input']>;
  maxClaims_not?: InputMaybe<Scalars['BigInt']['input']>;
  maxClaims_gt?: InputMaybe<Scalars['BigInt']['input']>;
  maxClaims_lt?: InputMaybe<Scalars['BigInt']['input']>;
  maxClaims_gte?: InputMaybe<Scalars['BigInt']['input']>;
  maxClaims_lte?: InputMaybe<Scalars['BigInt']['input']>;
  maxClaims_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  maxClaims_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalClaims?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_not?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_gt?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_lt?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_gte?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_lte?: InputMaybe<Scalars['BigInt']['input']>;
  totalClaims_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  totalClaims_not_in?: InputMaybe<Array<Scalars['BigInt']['input']>>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  isCompleted_not?: InputMaybe<Scalars['Boolean']['input']>;
  isCompleted_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  isCompleted_not_in?: InputMaybe<Array<Scalars['Boolean']['input']>>;
  perkClaims_?: InputMaybe<PerkRedemption_filter>;
  /** Filter for the block changed event. */
  _change_block?: InputMaybe<BlockChangedFilter>;
  and?: InputMaybe<Array<InputMaybe<Perk_filter>>>;
  or?: InputMaybe<Array<InputMaybe<Perk_filter>>>;
};

export type Perk_orderBy =
  | 'id'
  | 'badgeId'
  | 'tier'
  | 'badge'
  | 'badge__id'
  | 'badge__badgeId'
  | 'badge__uri'
  | 'badgeTier'
  | 'badgeTier__id'
  | 'badgeTier__points'
  | 'badgeTier__tier'
  | 'badgeTier__uri'
  | 'token'
  | 'amount'
  | 'maxClaims'
  | 'totalClaims'
  | 'isCompleted'
  | 'perkClaims';

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
  superChainSmartAccount_contains_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_contains?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_contains_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_starts_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_starts_with?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_starts_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_ends_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
  superChainSmartAccount_not_ends_with?: InputMaybe<Scalars['String']['input']>;
  superChainSmartAccount_not_ends_with_nocase?: InputMaybe<
    Scalars['String']['input']
  >;
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
  perk?: Maybe<Perk>;
  perks: Array<Perk>;
  accountBadge?: Maybe<AccountBadge>;
  accountBadges: Array<AccountBadge>;
  tierTresholds?: Maybe<TierTresholds>;
  tierTresholds_collection: Array<TierTresholds>;
  levelClaim?: Maybe<LevelClaim>;
  levelClaims: Array<LevelClaim>;
  perkRedemption?: Maybe<PerkRedemption>;
  perkRedemptions: Array<PerkRedemption>;
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

export type QueryperkArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryperksArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<Perk_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<Perk_filter>;
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

export type QueryperkRedemptionArgs = {
  id: Scalars['ID']['input'];
  block?: InputMaybe<Block_height>;
  subgraphError?: _SubgraphErrorPolicy_;
};

export type QueryperkRedemptionsArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  orderBy?: InputMaybe<PerkRedemption_orderBy>;
  orderDirection?: InputMaybe<OrderDirection>;
  where?: InputMaybe<PerkRedemption_filter>;
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

export type TierTresholds_orderBy = 'id' | 'tresholds';

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

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;

export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type LegacyStitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string;
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};

export type NewStitchingResolver<TResult, TParent, TContext, TArgs> = {
  selectionSet: string | ((fieldNode: FieldNode) => SelectionSetNode);
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type StitchingResolver<TResult, TParent, TContext, TArgs> =
  | LegacyStitchingResolver<TResult, TParent, TContext, TArgs>
  | NewStitchingResolver<TResult, TParent, TContext, TArgs>;
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | ResolverWithResolve<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> {
  subscribe: SubscriptionSubscribeFn<
    { [key in TKey]: TResult },
    TParent,
    TContext,
    TArgs
  >;
  resolve?: SubscriptionResolveFn<
    TResult,
    { [key in TKey]: TResult },
    TContext,
    TArgs
  >;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<
  TResult,
  TKey extends string,
  TParent,
  TContext,
  TArgs
> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<
  TResult,
  TKey extends string,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
    ...args: any[]
  ) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (
  obj: T,
  context: TContext,
  info: GraphQLResolveInfo
) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  AccountBadge: ResolverTypeWrapper<AccountBadge>;
  AccountBadge_filter: AccountBadge_filter;
  AccountBadge_orderBy: AccountBadge_orderBy;
  Aggregation_interval: Aggregation_interval;
  Badge: ResolverTypeWrapper<Badge>;
  BadgeTier: ResolverTypeWrapper<BadgeTier>;
  BadgeTier_filter: BadgeTier_filter;
  BadgeTier_orderBy: BadgeTier_orderBy;
  Badge_filter: Badge_filter;
  Badge_orderBy: Badge_orderBy;
  BigDecimal: ResolverTypeWrapper<Scalars['BigDecimal']['output']>;
  BigInt: ResolverTypeWrapper<Scalars['BigInt']['output']>;
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Bytes: ResolverTypeWrapper<Scalars['Bytes']['output']>;
  EIP712DomainChanged: ResolverTypeWrapper<EIP712DomainChanged>;
  EIP712DomainChanged_filter: EIP712DomainChanged_filter;
  EIP712DomainChanged_orderBy: EIP712DomainChanged_orderBy;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Int8: ResolverTypeWrapper<Scalars['Int8']['output']>;
  LevelClaim: ResolverTypeWrapper<LevelClaim>;
  LevelClaim_filter: LevelClaim_filter;
  LevelClaim_orderBy: LevelClaim_orderBy;
  Meta: ResolverTypeWrapper<Meta>;
  Meta_filter: Meta_filter;
  Meta_orderBy: Meta_orderBy;
  OrderDirection: OrderDirection;
  OwnerAdded: ResolverTypeWrapper<OwnerAdded>;
  OwnerAdded_filter: OwnerAdded_filter;
  OwnerAdded_orderBy: OwnerAdded_orderBy;
  OwnerPopulated: ResolverTypeWrapper<OwnerPopulated>;
  OwnerPopulated_filter: OwnerPopulated_filter;
  OwnerPopulated_orderBy: OwnerPopulated_orderBy;
  OwnerPopulationRemoved: ResolverTypeWrapper<OwnerPopulationRemoved>;
  OwnerPopulationRemoved_filter: OwnerPopulationRemoved_filter;
  OwnerPopulationRemoved_orderBy: OwnerPopulationRemoved_orderBy;
  Perk: ResolverTypeWrapper<Perk>;
  PerkRedemption: ResolverTypeWrapper<PerkRedemption>;
  PerkRedemption_filter: PerkRedemption_filter;
  PerkRedemption_orderBy: PerkRedemption_orderBy;
  Perk_filter: Perk_filter;
  Perk_orderBy: Perk_orderBy;
  PointsIncremented: ResolverTypeWrapper<PointsIncremented>;
  PointsIncremented_filter: PointsIncremented_filter;
  PointsIncremented_orderBy: PointsIncremented_orderBy;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  SuperChainSmartAccount: ResolverTypeWrapper<SuperChainSmartAccount>;
  SuperChainSmartAccount_filter: SuperChainSmartAccount_filter;
  SuperChainSmartAccount_orderBy: SuperChainSmartAccount_orderBy;
  TierTresholds: ResolverTypeWrapper<TierTresholds>;
  TierTresholds_filter: TierTresholds_filter;
  TierTresholds_orderBy: TierTresholds_orderBy;
  Timestamp: ResolverTypeWrapper<Scalars['Timestamp']['output']>;
  _Block_: ResolverTypeWrapper<_Block_>;
  _Meta_: ResolverTypeWrapper<_Meta_>;
  _SubgraphErrorPolicy_: _SubgraphErrorPolicy_;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  AccountBadge: AccountBadge;
  AccountBadge_filter: AccountBadge_filter;
  Badge: Badge;
  BadgeTier: BadgeTier;
  BadgeTier_filter: BadgeTier_filter;
  Badge_filter: Badge_filter;
  BigDecimal: Scalars['BigDecimal']['output'];
  BigInt: Scalars['BigInt']['output'];
  BlockChangedFilter: BlockChangedFilter;
  Block_height: Block_height;
  Boolean: Scalars['Boolean']['output'];
  Bytes: Scalars['Bytes']['output'];
  EIP712DomainChanged: EIP712DomainChanged;
  EIP712DomainChanged_filter: EIP712DomainChanged_filter;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Int8: Scalars['Int8']['output'];
  LevelClaim: LevelClaim;
  LevelClaim_filter: LevelClaim_filter;
  Meta: Meta;
  Meta_filter: Meta_filter;
  OwnerAdded: OwnerAdded;
  OwnerAdded_filter: OwnerAdded_filter;
  OwnerPopulated: OwnerPopulated;
  OwnerPopulated_filter: OwnerPopulated_filter;
  OwnerPopulationRemoved: OwnerPopulationRemoved;
  OwnerPopulationRemoved_filter: OwnerPopulationRemoved_filter;
  Perk: Perk;
  PerkRedemption: PerkRedemption;
  PerkRedemption_filter: PerkRedemption_filter;
  Perk_filter: Perk_filter;
  PointsIncremented: PointsIncremented;
  PointsIncremented_filter: PointsIncremented_filter;
  Query: {};
  String: Scalars['String']['output'];
  SuperChainSmartAccount: SuperChainSmartAccount;
  SuperChainSmartAccount_filter: SuperChainSmartAccount_filter;
  TierTresholds: TierTresholds;
  TierTresholds_filter: TierTresholds_filter;
  Timestamp: Scalars['Timestamp']['output'];
  _Block_: _Block_;
  _Meta_: _Meta_;
}>;

export type entityDirectiveArgs = {};

export type entityDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = entityDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type subgraphIdDirectiveArgs = {
  id: Scalars['String']['input'];
};

export type subgraphIdDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = subgraphIdDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type derivedFromDirectiveArgs = {
  field: Scalars['String']['input'];
};

export type derivedFromDirectiveResolver<
  Result,
  Parent,
  ContextType = MeshContext,
  Args = derivedFromDirectiveArgs
> = DirectiveResolverFn<Result, Parent, ContextType, Args>;

export type AccountBadgeResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['AccountBadge'] = ResolversParentTypes['AccountBadge']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  user?: Resolver<
    ResolversTypes['SuperChainSmartAccount'],
    ParentType,
    ContextType
  >;
  badge?: Resolver<ResolversTypes['Badge'], ParentType, ContextType>;
  tier?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  perkClaims?: Resolver<
    Array<ResolversTypes['PerkRedemption']>,
    ParentType,
    ContextType,
    RequireFields<AccountBadgeperkClaimsArgs, 'skip' | 'first'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BadgeResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Badge'] = ResolversParentTypes['Badge']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  badgeId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  badgeTiers?: Resolver<
    Array<ResolversTypes['BadgeTier']>,
    ParentType,
    ContextType,
    RequireFields<BadgebadgeTiersArgs, 'skip' | 'first'>
  >;
  perks?: Resolver<
    Array<ResolversTypes['Perk']>,
    ParentType,
    ContextType,
    RequireFields<BadgeperksArgs, 'skip' | 'first'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type BadgeTierResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['BadgeTier'] = ResolversParentTypes['BadgeTier']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tier?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  badge?: Resolver<ResolversTypes['Badge'], ParentType, ContextType>;
  uri?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  perk?: Resolver<Maybe<ResolversTypes['Perk']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface BigDecimalScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['BigDecimal'], any> {
  name: 'BigDecimal';
}

export interface BigIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['BigInt'], any> {
  name: 'BigInt';
}

export interface BytesScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Bytes'], any> {
  name: 'Bytes';
}

export type EIP712DomainChangedResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['EIP712DomainChanged'] = ResolversParentTypes['EIP712DomainChanged']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface Int8ScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Int8'], any> {
  name: 'Int8';
}

export type LevelClaimResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['LevelClaim'] = ResolversParentTypes['LevelClaim']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  account?: Resolver<
    ResolversTypes['SuperChainSmartAccount'],
    ParentType,
    ContextType
  >;
  level?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type MetaResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Meta'] = ResolversParentTypes['Meta']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  count?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OwnerAddedResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['OwnerAdded'] = ResolversParentTypes['OwnerAdded']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  safe?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  newOwner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  superChainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  superChainSmartAccount?: Resolver<
    ResolversTypes['SuperChainSmartAccount'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OwnerPopulatedResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['OwnerPopulated'] = ResolversParentTypes['OwnerPopulated']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  safe?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  newOwner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  superChainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  superChainSmartAccount?: Resolver<
    ResolversTypes['SuperChainSmartAccount'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type OwnerPopulationRemovedResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['OwnerPopulationRemoved'] = ResolversParentTypes['OwnerPopulationRemoved']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  safe?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  owner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  superChainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  superChainSmartAccount?: Resolver<
    ResolversTypes['SuperChainSmartAccount'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PerkResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Perk'] = ResolversParentTypes['Perk']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  badgeId?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  tier?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  badge?: Resolver<ResolversTypes['Badge'], ParentType, ContextType>;
  badgeTier?: Resolver<
    Maybe<ResolversTypes['BadgeTier']>,
    ParentType,
    ContextType
  >;
  token?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  maxClaims?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  totalClaims?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  isCompleted?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  perkClaims?: Resolver<
    Array<ResolversTypes['PerkRedemption']>,
    ParentType,
    ContextType,
    RequireFields<PerkperkClaimsArgs, 'skip' | 'first'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PerkRedemptionResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['PerkRedemption'] = ResolversParentTypes['PerkRedemption']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  perk?: Resolver<ResolversTypes['Perk'], ParentType, ContextType>;
  redeemer?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  accountBadge?: Resolver<
    Maybe<ResolversTypes['AccountBadge']>,
    ParentType,
    ContextType
  >;
  token?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  amount?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PointsIncrementedResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['PointsIncremented'] = ResolversParentTypes['PointsIncremented']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  recipient?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  levelUp?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  superChainSmartAccount?: Resolver<
    ResolversTypes['SuperChainSmartAccount'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']
> = ResolversObject<{
  eip712DomainChanged?: Resolver<
    Maybe<ResolversTypes['EIP712DomainChanged']>,
    ParentType,
    ContextType,
    RequireFields<Queryeip712DomainChangedArgs, 'id' | 'subgraphError'>
  >;
  eip712DomainChangeds?: Resolver<
    Array<ResolversTypes['EIP712DomainChanged']>,
    ParentType,
    ContextType,
    RequireFields<
      Queryeip712DomainChangedsArgs,
      'skip' | 'first' | 'subgraphError'
    >
  >;
  ownerAdded?: Resolver<
    Maybe<ResolversTypes['OwnerAdded']>,
    ParentType,
    ContextType,
    RequireFields<QueryownerAddedArgs, 'id' | 'subgraphError'>
  >;
  ownerAddeds?: Resolver<
    Array<ResolversTypes['OwnerAdded']>,
    ParentType,
    ContextType,
    RequireFields<QueryownerAddedsArgs, 'skip' | 'first' | 'subgraphError'>
  >;
  ownerPopulated?: Resolver<
    Maybe<ResolversTypes['OwnerPopulated']>,
    ParentType,
    ContextType,
    RequireFields<QueryownerPopulatedArgs, 'id' | 'subgraphError'>
  >;
  ownerPopulateds?: Resolver<
    Array<ResolversTypes['OwnerPopulated']>,
    ParentType,
    ContextType,
    RequireFields<QueryownerPopulatedsArgs, 'skip' | 'first' | 'subgraphError'>
  >;
  ownerPopulationRemoved?: Resolver<
    Maybe<ResolversTypes['OwnerPopulationRemoved']>,
    ParentType,
    ContextType,
    RequireFields<QueryownerPopulationRemovedArgs, 'id' | 'subgraphError'>
  >;
  ownerPopulationRemoveds?: Resolver<
    Array<ResolversTypes['OwnerPopulationRemoved']>,
    ParentType,
    ContextType,
    RequireFields<
      QueryownerPopulationRemovedsArgs,
      'skip' | 'first' | 'subgraphError'
    >
  >;
  pointsIncremented?: Resolver<
    Maybe<ResolversTypes['PointsIncremented']>,
    ParentType,
    ContextType,
    RequireFields<QuerypointsIncrementedArgs, 'id' | 'subgraphError'>
  >;
  pointsIncrementeds?: Resolver<
    Array<ResolversTypes['PointsIncremented']>,
    ParentType,
    ContextType,
    RequireFields<
      QuerypointsIncrementedsArgs,
      'skip' | 'first' | 'subgraphError'
    >
  >;
  superChainSmartAccount?: Resolver<
    Maybe<ResolversTypes['SuperChainSmartAccount']>,
    ParentType,
    ContextType,
    RequireFields<QuerysuperChainSmartAccountArgs, 'id' | 'subgraphError'>
  >;
  superChainSmartAccounts?: Resolver<
    Array<ResolversTypes['SuperChainSmartAccount']>,
    ParentType,
    ContextType,
    RequireFields<
      QuerysuperChainSmartAccountsArgs,
      'skip' | 'first' | 'subgraphError'
    >
  >;
  badgeTier?: Resolver<
    Maybe<ResolversTypes['BadgeTier']>,
    ParentType,
    ContextType,
    RequireFields<QuerybadgeTierArgs, 'id' | 'subgraphError'>
  >;
  badgeTiers?: Resolver<
    Array<ResolversTypes['BadgeTier']>,
    ParentType,
    ContextType,
    RequireFields<QuerybadgeTiersArgs, 'skip' | 'first' | 'subgraphError'>
  >;
  badge?: Resolver<
    Maybe<ResolversTypes['Badge']>,
    ParentType,
    ContextType,
    RequireFields<QuerybadgeArgs, 'id' | 'subgraphError'>
  >;
  badges?: Resolver<
    Array<ResolversTypes['Badge']>,
    ParentType,
    ContextType,
    RequireFields<QuerybadgesArgs, 'skip' | 'first' | 'subgraphError'>
  >;
  perk?: Resolver<
    Maybe<ResolversTypes['Perk']>,
    ParentType,
    ContextType,
    RequireFields<QueryperkArgs, 'id' | 'subgraphError'>
  >;
  perks?: Resolver<
    Array<ResolversTypes['Perk']>,
    ParentType,
    ContextType,
    RequireFields<QueryperksArgs, 'skip' | 'first' | 'subgraphError'>
  >;
  accountBadge?: Resolver<
    Maybe<ResolversTypes['AccountBadge']>,
    ParentType,
    ContextType,
    RequireFields<QueryaccountBadgeArgs, 'id' | 'subgraphError'>
  >;
  accountBadges?: Resolver<
    Array<ResolversTypes['AccountBadge']>,
    ParentType,
    ContextType,
    RequireFields<QueryaccountBadgesArgs, 'skip' | 'first' | 'subgraphError'>
  >;
  tierTresholds?: Resolver<
    Maybe<ResolversTypes['TierTresholds']>,
    ParentType,
    ContextType,
    RequireFields<QuerytierTresholdsArgs, 'id' | 'subgraphError'>
  >;
  tierTresholds_collection?: Resolver<
    Array<ResolversTypes['TierTresholds']>,
    ParentType,
    ContextType,
    RequireFields<
      QuerytierTresholds_collectionArgs,
      'skip' | 'first' | 'subgraphError'
    >
  >;
  levelClaim?: Resolver<
    Maybe<ResolversTypes['LevelClaim']>,
    ParentType,
    ContextType,
    RequireFields<QuerylevelClaimArgs, 'id' | 'subgraphError'>
  >;
  levelClaims?: Resolver<
    Array<ResolversTypes['LevelClaim']>,
    ParentType,
    ContextType,
    RequireFields<QuerylevelClaimsArgs, 'skip' | 'first' | 'subgraphError'>
  >;
  perkRedemption?: Resolver<
    Maybe<ResolversTypes['PerkRedemption']>,
    ParentType,
    ContextType,
    RequireFields<QueryperkRedemptionArgs, 'id' | 'subgraphError'>
  >;
  perkRedemptions?: Resolver<
    Array<ResolversTypes['PerkRedemption']>,
    ParentType,
    ContextType,
    RequireFields<QueryperkRedemptionsArgs, 'skip' | 'first' | 'subgraphError'>
  >;
  meta?: Resolver<
    Maybe<ResolversTypes['Meta']>,
    ParentType,
    ContextType,
    RequireFields<QuerymetaArgs, 'id' | 'subgraphError'>
  >;
  metas?: Resolver<
    Array<ResolversTypes['Meta']>,
    ParentType,
    ContextType,
    RequireFields<QuerymetasArgs, 'skip' | 'first' | 'subgraphError'>
  >;
  _meta?: Resolver<
    Maybe<ResolversTypes['_Meta_']>,
    ParentType,
    ContextType,
    Partial<Query_metaArgs>
  >;
}>;

export type SuperChainSmartAccountResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['SuperChainSmartAccount'] = ResolversParentTypes['SuperChainSmartAccount']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  safe?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  initialOwner?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  superChainId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noun_background?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  noun_body?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  noun_accessory?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  noun_head?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  noun_glasses?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockNumber?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  blockTimestamp?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  transactionHash?: Resolver<ResolversTypes['Bytes'], ParentType, ContextType>;
  level?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  points?: Resolver<ResolversTypes['BigInt'], ParentType, ContextType>;
  badges?: Resolver<
    Array<ResolversTypes['AccountBadge']>,
    ParentType,
    ContextType,
    RequireFields<SuperChainSmartAccountbadgesArgs, 'skip' | 'first'>
  >;
  levels?: Resolver<
    Array<ResolversTypes['LevelClaim']>,
    ParentType,
    ContextType,
    RequireFields<SuperChainSmartAccountlevelsArgs, 'skip' | 'first'>
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type TierTresholdsResolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['TierTresholds'] = ResolversParentTypes['TierTresholds']
> = ResolversObject<{
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  tresholds?: Resolver<
    Array<ResolversTypes['BigInt']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export interface TimestampScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes['Timestamp'], any> {
  name: 'Timestamp';
}

export type _Block_Resolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['_Block_'] = ResolversParentTypes['_Block_']
> = ResolversObject<{
  hash?: Resolver<Maybe<ResolversTypes['Bytes']>, ParentType, ContextType>;
  number?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  timestamp?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  parentHash?: Resolver<
    Maybe<ResolversTypes['Bytes']>,
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type _Meta_Resolvers<
  ContextType = MeshContext,
  ParentType extends ResolversParentTypes['_Meta_'] = ResolversParentTypes['_Meta_']
> = ResolversObject<{
  block?: Resolver<ResolversTypes['_Block_'], ParentType, ContextType>;
  deployment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  hasIndexingErrors?: Resolver<
    ResolversTypes['Boolean'],
    ParentType,
    ContextType
  >;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = MeshContext> = ResolversObject<{
  AccountBadge?: AccountBadgeResolvers<ContextType>;
  Badge?: BadgeResolvers<ContextType>;
  BadgeTier?: BadgeTierResolvers<ContextType>;
  BigDecimal?: GraphQLScalarType;
  BigInt?: GraphQLScalarType;
  Bytes?: GraphQLScalarType;
  EIP712DomainChanged?: EIP712DomainChangedResolvers<ContextType>;
  Int8?: GraphQLScalarType;
  LevelClaim?: LevelClaimResolvers<ContextType>;
  Meta?: MetaResolvers<ContextType>;
  OwnerAdded?: OwnerAddedResolvers<ContextType>;
  OwnerPopulated?: OwnerPopulatedResolvers<ContextType>;
  OwnerPopulationRemoved?: OwnerPopulationRemovedResolvers<ContextType>;
  Perk?: PerkResolvers<ContextType>;
  PerkRedemption?: PerkRedemptionResolvers<ContextType>;
  PointsIncremented?: PointsIncrementedResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  SuperChainSmartAccount?: SuperChainSmartAccountResolvers<ContextType>;
  TierTresholds?: TierTresholdsResolvers<ContextType>;
  Timestamp?: GraphQLScalarType;
  _Block_?: _Block_Resolvers<ContextType>;
  _Meta_?: _Meta_Resolvers<ContextType>;
}>;

export type DirectiveResolvers<ContextType = MeshContext> = ResolversObject<{
  entity?: entityDirectiveResolver<any, any, ContextType>;
  subgraphId?: subgraphIdDirectiveResolver<any, any, ContextType>;
  derivedFrom?: derivedFromDirectiveResolver<any, any, ContextType>;
}>;

export type MeshContext = SuperAccountsTypes.Context & BaseMeshContext;

const baseDir = pathModule.join(
  typeof __dirname === 'string' ? __dirname : '/',
  '..'
);

const importFn: ImportFn = <T>(moduleId: string) => {
  const relativeModuleId = (
    pathModule.isAbsolute(moduleId)
      ? pathModule.relative(baseDir, moduleId)
      : moduleId
  )
    .split('\\')
    .join('/')
    .replace(baseDir + '/', '');
  switch (relativeModuleId) {
    case '.graphclient/sources/super-accounts/introspectionSchema':
      return Promise.resolve(importedModule$0) as T;

    default:
      return Promise.reject(
        new Error(`Cannot find module '${relativeModuleId}'.`)
      );
  }
};

const rootStore = new MeshStore(
  '.graphclient',
  new FsStoreStorageAdapter({
    cwd: baseDir,
    importFn,
    fileType: 'ts',
  }),
  {
    readonly: true,
    validate: false,
  }
);

export const rawServeConfig: YamlConfig.Config['serve'] = undefined as any;
export async function getMeshOptions(): Promise<GetMeshOptions> {
  const pubsub = new PubSub();
  const sourcesStore = rootStore.child('sources');
  const logger = new DefaultLogger('GraphClient');
  const cache = new (MeshCache as any)({
    ...({} as any),
    importFn,
    store: rootStore.child('cache'),
    pubsub,
    logger,
  } as any);

  const sources: MeshResolvedSource[] = [];
  const transforms: MeshTransform[] = [];
  const additionalEnvelopPlugins: MeshPlugin<any>[] = [];
  const superAccountsTransforms = [];
  const additionalTypeDefs = [] as any[];
  const superAccountsHandler = new GraphqlHandler({
    name: 'super-accounts',
    config: { endpoint: SUBGRAPH_URI, operationHeaders: { Authorization: `Bearer ${SUBGRAPH_API_KEY}` } },
    baseDir,
    cache,
    pubsub,
    store: sourcesStore.child('super-accounts'),
    logger: logger.child('super-accounts'),
    importFn,
  });
  sources[0] = {
    name: 'super-accounts',
    handler: superAccountsHandler,
    transforms: superAccountsTransforms,
  };
  const additionalResolvers = [] as any[];
  const merger = new (BareMerger as any)({
    cache,
    pubsub,
    logger: logger.child('bareMerger'),
    store: rootStore.child('bareMerger'),
  });
  const documentHashMap = {
    '65143bb646393bbde5847f63fbd865c36d2a3e1e13d9dabc2786c3108710857d':
      GetFirst100UsersLevel3Document,
    f10185db861648e272d5017421b2776186140a1654fd1b984004bfbaddfe59d2:
      GetUserBadgesDocument,
  };
  additionalEnvelopPlugins.push(
    usePersistedOperations({
      getPersistedOperation(key) {
        return documentHashMap[key];
      },
      ...{},
    })
  );

  return {
    sources,
    transforms,
    additionalTypeDefs,
    additionalResolvers,
    cache,
    pubsub,
    merger,
    logger,
    additionalEnvelopPlugins,
    get documents() {
      return [
        {
          document: GetFirst100UsersLevel3Document,
          get rawSDL() {
            return printWithCache(GetFirst100UsersLevel3Document);
          },
          location: 'GetFirst100UsersLevel3Document.graphql',
          sha256Hash:
            '65143bb646393bbde5847f63fbd865c36d2a3e1e13d9dabc2786c3108710857d',
        },
        {
          document: GetUserBadgesDocument,
          get rawSDL() {
            return printWithCache(GetUserBadgesDocument);
          },
          location: 'GetUserBadgesDocument.graphql',
          sha256Hash:
            'f10185db861648e272d5017421b2776186140a1654fd1b984004bfbaddfe59d2',
        },
      ];
    },
    fetchFn,
  };
}

export function createBuiltMeshHTTPHandler<
  TServerContext = {}
>(): MeshHTTPHandler<TServerContext> {
  return createMeshHTTPHandler<TServerContext>({
    baseDir,
    getBuiltMesh: getBuiltGraphClient,
    rawServeConfig: undefined,
  });
}

let meshInstance$: Promise<MeshInstance> | undefined;

export const pollingInterval = null;

export function getBuiltGraphClient(): Promise<MeshInstance> {
  if (meshInstance$ == null) {
    if (pollingInterval) {
      setInterval(() => {
        getMeshOptions()
          .then((meshOptions) => getMesh(meshOptions))
          .then((newMesh) =>
            meshInstance$.then((oldMesh) => {
              oldMesh.destroy();
              meshInstance$ = Promise.resolve(newMesh);
            })
          )
          .catch((err) => {
            console.error(
              'Mesh polling failed so the existing version will be used:',
              err
            );
          });
      }, pollingInterval);
    }
    meshInstance$ = getMeshOptions()
      .then((meshOptions) => getMesh(meshOptions))
      .then((mesh) => {
        const id = mesh.pubsub.subscribe('destroy', () => {
          meshInstance$ = undefined;
          mesh.pubsub.unsubscribe(id);
        });
        return mesh;
      });
  }
  return meshInstance$;
}

export const execute: ExecuteMeshFn = (...args) =>
  getBuiltGraphClient().then(({ execute }) => execute(...args));

export const subscribe: SubscribeMeshFn = (...args) =>
  getBuiltGraphClient().then(({ subscribe }) => subscribe(...args));
export function getBuiltGraphSDK<TGlobalContext = any, TOperationContext = any>(
  globalContext?: TGlobalContext
) {
  const sdkRequester$ = getBuiltGraphClient().then(({ sdkRequesterFactory }) =>
    sdkRequesterFactory(globalContext)
  );
  return getSdk<TOperationContext, TGlobalContext>((...args) =>
    sdkRequester$.then((sdkRequester) => sdkRequester(...args))
  );
}
export type GetFirst100UsersLevel3QueryVariables = Exact<{
  [key: string]: never;
}>;

export type GetFirst100UsersLevel3Query = {
  levelClaims: Array<
    Pick<LevelClaim, 'level' | 'timestamp'> & {
      account: Pick<SuperChainSmartAccount, 'id'>;
    }
  >;
};

export type GetUserBadgesQueryVariables = Exact<{
  user: Scalars['String']['input'];
}>;

export type GetUserBadgesQuery = {
  badges: Array<
    Pick<Badge, 'badgeId' | 'uri'> & {
      perks: Array<
        Pick<Perk, 'id' | 'tier' | 'isCompleted' | 'maxClaims' | 'amount' | 'totalClaims'>
      >;
      badgeTiers: Array<Pick<BadgeTier, 'points' | 'tier' | 'uri'>>;
    }
  >;
  accountBadges: Array<
    Pick<AccountBadge, 'points' | 'tier'> & {
      perkClaims: Array<{
        perk: Pick<
          Perk,
          | 'id'
          | 'badgeId'
          | 'tier'
          | 'token'
          | 'amount'
          | 'maxClaims'
          | 'totalClaims'
          | 'isCompleted'
        >;
      }>;
      badge: Pick<Badge, 'badgeId' | 'uri'> & {
        perks: Array<
          Pick<Perk, 'id' | 'tier' | 'isCompleted' | 'maxClaims' | 'amount'>
        >;
        badgeTiers: Array<
          Pick<BadgeTier, 'points' | 'tier' | 'uri'> & {
            perk?: Maybe<
              Pick<
                Perk,
                | 'id'
                | 'badgeId'
                | 'tier'
                | 'token'
                | 'amount'
                | 'maxClaims'
                | 'totalClaims'
                | 'isCompleted'
              >
            >;
          }
        >;
      };
    }
  >;
};

export const GetFirst100UsersLevel3Document = gql`
  query GetFirst100UsersLevel3 {
    levelClaims(
      where: { level: 3 }
      orderBy: timestamp
      orderDirection: asc
      first: 100
    ) {
      account {
        id
      }
      level
      timestamp
    }
  }
` as unknown as DocumentNode<
  GetFirst100UsersLevel3Query,
  GetFirst100UsersLevel3QueryVariables
>;
export const GetUserBadgesDocument = gql`
  query GetUserBadges($user: String!) {
    badges {
      badgeId
      uri
      perks {
        id
        tier
        isCompleted
        maxClaims
        amount
        totalClaims
      }
      badgeTiers(orderBy: tier, orderDirection: asc) {
        points
        tier
        uri
      }
    }
    accountBadges(where: { user: $user }) {
      perkClaims {
        perk {
          id
          badgeId
          tier
          token
          amount
          maxClaims
          totalClaims
          isCompleted
        }
      }
      points
      tier
      badge {
        badgeId
        uri
        perks {
          id
          tier
          isCompleted
          maxClaims
          amount
        }
        badgeTiers(orderBy: tier, orderDirection: asc) {
          points
          tier
          uri
          perk {
            id
            badgeId
            tier
            token
            amount
            maxClaims
            totalClaims
            isCompleted
          }
        }
      }
    }
  }
` as unknown as DocumentNode<GetUserBadgesQuery, GetUserBadgesQueryVariables>;

export type Requester<C = {}, E = unknown> = <R, V>(
  doc: DocumentNode,
  vars?: V,
  options?: C
) => Promise<R> | AsyncIterable<R>;
export function getSdk<C, E>(requester: Requester<C, E>) {
  return {
    GetFirst100UsersLevel3(
      variables?: GetFirst100UsersLevel3QueryVariables,
      options?: C
    ): Promise<GetFirst100UsersLevel3Query> {
      return requester<
        GetFirst100UsersLevel3Query,
        GetFirst100UsersLevel3QueryVariables
      >(
        GetFirst100UsersLevel3Document,
        variables,
        options
      ) as Promise<GetFirst100UsersLevel3Query>;
    },
    GetUserBadges(
      variables: GetUserBadgesQueryVariables,
      options?: C
    ): Promise<GetUserBadgesQuery> {
      return requester<GetUserBadgesQuery, GetUserBadgesQueryVariables>(
        GetUserBadgesDocument,
        variables,
        options
      ) as Promise<GetUserBadgesQuery>;
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
