import { EAS__factory } from '@ethereum-attestation-service/eas-contracts/dist/typechain-types/factories/contracts/EAS__factory';

import {
  ethers,
  JsonRpcProvider,
  Wallet,
  ZeroAddress,
  zeroPadValue,
} from 'ethers';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import {
  ATTESTATOR_SIGNER_PRIVATE_KEY,
  BADGES_RPC_URL,
  EAS_CONTRACT_ADDRESS,
  PIMLICO_API_KEY,
  SAFE_ADDRESS,
  SUPER_CHAIN_ATTESTATION_SCHEMA,
} from '../config/superChain/constants';
import { superChainAccountService } from './superChainAccount.service';
import { redisService } from './redis.service';
import { ResponseBadge } from './badges/badges.service';
import Safe, {
  encodeMultiSendData,
  OnchainAnalyticsProps,
} from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import Safe4337Pack from '@safe-global/relay-kit/dist/src/packs/safe-4337/Safe4337Pack';
import { MetaTransactionData, OperationType } from '@safe-global/types-kit';
import config from '@/config';

export class AttestationsService {
  private easContractAddress = EAS_CONTRACT_ADDRESS;
  private schemaString = '(uint256 badgeId, uint256 level)[] badges';
  private provider = new JsonRpcProvider(BADGES_RPC_URL);
  private wallet = new Wallet(ATTESTATOR_SIGNER_PRIVATE_KEY, this.provider);
  private eas = EAS__factory.connect(this.easContractAddress, this.wallet);
  private schemaEncoder = new SchemaEncoder(this.schemaString);

  async createSafeTransactions(txDatas: any[]) {
    const safeTransactions: MetaTransactionData[] = [];
    for (const txData of txDatas) {
      const data = this.eas.interface.encodeFunctionData('attest', [txData]);

      const safeTransactionData: MetaTransactionData = {
        to: this.easContractAddress,
        value: '0',
        data: data,
      };
      safeTransactions.push(safeTransactionData);
    }
    return safeTransactions;
  }

  async tryAttestWithSafe(txData: any): Promise<string | boolean> {
    const onchainAnalytics: OnchainAnalyticsProps = {
      project: 'SuperAccounts',
      platform: 'Web',
    };

    // @ts-expect-error ESM import
    const safeSdk = await Safe.default.init({
      provider: BADGES_RPC_URL,
      signer: ATTESTATOR_SIGNER_PRIVATE_KEY,
      safeAddress: SAFE_ADDRESS,
      onchainAnalytics,
    });

    const safeTransactions = await this.createSafeTransactions([txData]);

    const safeTransaction = await safeSdk.createTransaction({
      transactions: safeTransactions,
    });

    const isValid = await safeSdk.isValidTransaction(safeTransaction, {
      from: SAFE_ADDRESS,
    });

    if (!isValid) return isValid;

    try {
      const executeTxResponse = await safeSdk.executeTransaction(
        safeTransaction
      );
      //await this.provider.waitForTransaction(executeTxResponse.hash, 1);
      return executeTxResponse.hash;
    } catch (e) {
      console.error('Unexpected error executing transaction with SAFE:', e);
    }
  }

  async tryAttestWithRelayKit(
    account: string,
    txData: any
  ): Promise<string | boolean> {
    const onchainAnalytics: OnchainAnalyticsProps = {
      project: 'SuperAccounts',
      platform: 'Web',
    };
    const safe4337Pack = await (
      await Safe4337Pack
    ).Safe4337Pack.init({
      provider: BADGES_RPC_URL,
      signer: ATTESTATOR_SIGNER_PRIVATE_KEY,
      bundlerUrl: `https://api.pimlico.io/v2/${config.constants.OPTIMISM_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`,
      options: {
        owners: [this.wallet.address],
        threshold: 1,
        safeAddress: SAFE_ADDRESS,
      },
      paymasterOptions: {
        isSponsored: true,
        paymasterUrl: `https://api.pimlico.io/v2/${config.constants.OPTIMISM_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`,
      },
      onchainAnalytics,
    });
    const calldata = await this.eas.attest.populateTransaction(txData);
    const transaction: MetaTransactionData = {
      to: this.easContractAddress,
      value: '0',
      data: calldata.data,
      operation: OperationType.Call,
    };
    const safeOperation = await safe4337Pack.createTransaction({
      transactions: [transaction],
    });
    const signedSafeOperation = await safe4337Pack.signSafeOperation(
      safeOperation
    );
    try {
      const userOperationHash = await safe4337Pack.executeTransaction({
        executable: signedSafeOperation,
      });
      console.log('Hash: ', userOperationHash);
      return userOperationHash;
    } catch (e) {
      console.error(
        'Unexpected error executing transaction with PAYMASTER:',
        e
      );
    }
  }

  public async batchAttest(
    batchData: {
      account: string;
      totalPoints: number;
      badges: ResponseBadge[];
      badgeUpdates: { badgeId: number; level: number; points: number }[];
    }[]
  ) {
    const onchainAnalytics: OnchainAnalyticsProps = {
      project: 'SuperAccounts',
      platform: 'Web',
    };

    // @ts-expect-error ESM import
    const safeSdk = await Safe.default.init({
      provider: BADGES_RPC_URL,
      signer: ATTESTATOR_SIGNER_PRIVATE_KEY,
      safeAddress: SAFE_ADDRESS,
      onchainAnalytics,
    });

    const txDatas = [];
    for (const data of batchData) {
      console.log('Attesting:', data.account);
      const encodedData = this.schemaEncoder.encodeData([
        {
          name: 'badges',
          value: data.badgeUpdates,
          type: '(uint256,uint256)[]',
        },
      ]);

      txDatas.push({
        schema: SUPER_CHAIN_ATTESTATION_SCHEMA,
        data: {
          recipient: data.account,
          data: encodedData,
          expirationTime: BigInt(0),
          value: BigInt(0),
          refUID: ethers.ZeroHash,
          revocable: false,
        },
      });
    }

    const safeTransactions = await this.createSafeTransactions(txDatas);

    const safeTransaction = await safeSdk.createTransaction({
      transactions: safeTransactions,
    });
    const multiSendData = encodeMultiSendData(safeTransactions);
    console.log(
      '🧾🧾🧾🧾🧾 Calldata sent to Safe (batch multiSend):',
      multiSendData
    );

    try {
      const executeTxResponse = await safeSdk.executeTransaction(
        safeTransaction
      );

      await this.provider.waitForTransaction(executeTxResponse.hash, 1);

      await Promise.all(
        batchData.map(
          async (data) =>
            await this.claimBadgesOptimistically(
              data.account,
              data.badgeUpdates
            )
        )
      );

      const responses = await Promise.all(
        batchData.map(async (data) => {
          const isLevelUp = await superChainAccountService.getIsLevelUp(
            data.account,
            data.totalPoints
          );

          const updatedBadges = data.badges.filter((badge) =>
            data.badgeUpdates.some((update) => update.badgeId === badge.badgeId)
          );

          return {
            account: data.account,
            hash: executeTxResponse.hash,
            isLevelUp,
            totalPoints: data.totalPoints,
            badgeUpdates: data.badgeUpdates,
            updatedBadges,
          };
        })
      );

      return responses;
    } catch (e) {
      console.error('Unexpected error executing transaction with SAFE:', e);
      throw e;
    }
  }

  public async attest(
    account: string,
    totalPoints: number,
    badges: ResponseBadge[],
    badgeUpdates: { badgeId: number; level: number; points: number }[]
  ) {
    const encodedData = this.schemaEncoder.encodeData([
      {
        name: 'badges',
        value: badgeUpdates,
        type: '(uint256,uint256)[]',
      },
    ]);

    try {
      const isLevelUp = await superChainAccountService.getIsLevelUp(
        account,
        totalPoints
      );

      const txData = {
        schema: SUPER_CHAIN_ATTESTATION_SCHEMA,
        data: {
          recipient: account,
          data: encodedData,
          expirationTime: BigInt(0),
          value: BigInt(0),
          refUID: ethers.ZeroHash,
          revocable: false,
        },
      };
      console.log('🤑🤑🤑🤑🤑🤑🤑Trying SAFE txData:', account);
      let attestSuccess = await this.tryAttestWithSafe(txData);
      if (!attestSuccess) {
        console.log('💸💸💸💸💸💸💸💸💸💸SAFE FAILED!!!!', account);
        attestSuccess = await this.tryAttestWithRelayKit(account, txData);
      }

      if (!attestSuccess) throw new Error('Not enough funds');

      if (typeof attestSuccess === 'string') {
        await this.provider.waitForTransaction(attestSuccess, 1);
      }

      const updatedBadges = badges.filter((badge) =>
        badgeUpdates.some((update) => update.badgeId === badge.badgeId)
      );

      await this.claimBadgesOptimistically(account, badgeUpdates);

      return {
        hash: attestSuccess,
        isLevelUp,
        totalPoints,
        badgeUpdates,
        updatedBadges,
      };
    } catch (error: any) {
      console.error('Error attesting', error);
      throw new Error(error);
    }
  }

  public async claimBadgesOptimistically(
    account: string,
    badgeUpdates: { badgeId: number; level: number; points: number }[]
  ): Promise<void> {
    const CACHE_KEY = `cached_badges:${account}`;
    const OPTIMISTIC_UPDATED_CACHE_KEY = `optimistic_updated_cached_badges:${account}`;

    const existingData = await redisService.getCachedData(CACHE_KEY);
    if (!existingData) {
      console.log('Existing data not found');
      return;
    }

    const updatedBadges = existingData.map((badge: any) => {
      const update = badgeUpdates.find((u) => u.badgeId === badge.badgeId);
      if (update) {
        badge.level = update.level;
        badge.points = update.points;
        badge.claimable = false;
      }
      return badge;
    });

    await redisService.setCachedData(
      OPTIMISTIC_UPDATED_CACHE_KEY,
      updatedBadges,
      null
    );

    // Delete the cached smart account data
    await redisService.deleteCachedData(`smart-account-${account}`);
    console.log('Optimistic updated badges for:', account);
  }
}
