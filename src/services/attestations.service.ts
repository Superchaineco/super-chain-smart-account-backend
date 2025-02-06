import { EAS__factory } from '@ethereum-attestation-service/eas-contracts/dist/typechain-types/factories/contracts/EAS__factory';

import { ethers, JsonRpcProvider, Wallet, ZeroAddress } from 'ethers';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import {
  ATTESTATOR_SIGNER_PRIVATE_KEY,
  EAS_CONTRACT_ADDRESS,
  JSON_RPC_PROVIDER,
  SUPER_CHAIN_ATTESTATION_SCHEMA,
} from '../config/superChain/constants';
import { superChainAccountService } from './superChainAccount.service';
import { redisService } from './redis.service';
import { ResponseBadge } from './badges/badges.service';
import Safe from '@safe-global/protocol-kit';
import { MetaTransactionData, OperationType } from '@safe-global/types-kit';

export class AttestationsService {
  private easContractAddress = EAS_CONTRACT_ADDRESS;
  private schemaString = '(uint256 badgeId, uint256 level)[] badges';
  private provider = new JsonRpcProvider(JSON_RPC_PROVIDER);
  private wallet = new Wallet(ATTESTATOR_SIGNER_PRIVATE_KEY, this.provider);
  private eas = EAS__factory.connect(this.easContractAddress, this.wallet);
  private schemaEncoder = new SchemaEncoder(this.schemaString);




  async estimateGas(account: string, txData: any) {
    const calldata = await this.eas.attest.populateTransaction(txData);
   
    const txRequest: ethers.TransactionRequest = {
      to: this.easContractAddress,
      from: this.wallet.address,
      data: calldata.data,
    };
    const gasPrice = await this.provider.estimateGas(txRequest);
    const gasEstimate = await this.eas.attest.estimateGas(txData);
    const estimatedCost = gasEstimate * gasPrice;
    const estimatedCostInEth = ethers.formatEther(estimatedCost);
    console.log(ATTESTATOR_SIGNER_PRIVATE_KEY)
    console.log(`Gas Estimate: ${gasEstimate.toString()} units`);
    console.log(`Gas Price: ${ethers.formatUnits(gasPrice, 'gwei')} gwei`);
    console.log(`Estimated Cost: ${estimatedCostInEth} ETH`);
    return estimatedCost
  }

  async isPossibleToExecute(account: string, txData: any): Promise<boolean> {

    const safeSdk = await Safe.default.init({
      provider: JSON_RPC_PROVIDER,
      signer: ATTESTATOR_SIGNER_PRIVATE_KEY,
      safeAddress: account
    })


    const calldata = await this.eas.attest.populateTransaction(txData);

    const safeTransactionData: MetaTransactionData = {
      to: this.easContractAddress,
      value: '0',
      data: calldata.data,
      operation: OperationType.Call
    }

    const safeTransaction = await safeSdk.createTransaction({
      transactions: [safeTransactionData]
    })

    const gasRequired = await this.estimateGas(account, txData)
    const balance = await safeSdk.getBalance()
    console.log('Currente balance:', balance, ' ETH')

    return await safeSdk.isValidTransaction(safeTransaction)
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



      const possible = await this.isPossibleToExecute(account, txData)
      console.log("Is possible:", possible)

      return;


      const tx = await this.eas.attest(txData);
      const badgeImages = Array.from(
        new Set(
          badges.flatMap((badge) =>
            badgeUpdates
              .filter((update) => badge.badgeId === update.badgeId)
              .map(
                (update) =>
                  badge.badgeTiers.find(
                    (tier) => Number(tier.tier) === Number(update.level)
                  )?.metadata?.['2DImage']
              )
              .filter((image) => image)
          )
        )
      );

      const receipt = await tx.wait();

      await this.claimBadgesOptimistically(account, badgeUpdates);

      return {
        hash: receipt?.hash,
        isLevelUp,
        badgeImages,
        totalPoints,
        badgeUpdates,
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

    // 3. Guardar la versión optimista
    await redisService.setCachedData(
      OPTIMISTIC_UPDATED_CACHE_KEY,
      updatedBadges,
      null
    );
    console.log('Optimistic updated badges for:', account);
  }
}
