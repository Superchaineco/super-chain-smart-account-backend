import { EAS__factory } from '@ethereum-attestation-service/eas-contracts/dist/typechain-types/factories/contracts/EAS__factory';

import { ethers, JsonRpcProvider, Wallet, ZeroAddress } from 'ethers';
import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import {
  ATTESTATOR_SIGNER_PRIVATE_KEY,
  EAS_CONTRACT_ADDRESS,
  JSON_RPC_PROVIDER,
  PIMLICO_API_KEY,
  SAFE_ACCOUNT,
  SUPER_CHAIN_ATTESTATION_SCHEMA,
} from '../config/superChain/constants';
import { superChainAccountService } from './superChainAccount.service';
import { redisService } from './redis.service';
import { ResponseBadge } from './badges/badges.service';
import Safe from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';
import Safe4337Pack from '@safe-global/relay-kit/dist/src/packs/safe-4337/Safe4337Pack';
import { MetaTransactionData, OperationType } from '@safe-global/types-kit';
import config from '@/config';

export class AttestationsService {
  private easContractAddress = EAS_CONTRACT_ADDRESS;
  private schemaString = '(uint256 badgeId, uint256 level)[] badges';
  private provider = new JsonRpcProvider(JSON_RPC_PROVIDER);
  private wallet = new Wallet(ATTESTATOR_SIGNER_PRIVATE_KEY, this.provider);
  private eas = EAS__factory.connect(this.easContractAddress, this.wallet);
  private schemaEncoder = new SchemaEncoder(this.schemaString);


  //Necesitamos esto??? o lo borramos?
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




  async tryAttestWithSafe(account: string, txData: any): Promise<string | boolean> {


    // @ts-expect-error ESM import
    const safeSdk = await Safe.default.init({
      provider: JSON_RPC_PROVIDER,
      signer: ATTESTATOR_SIGNER_PRIVATE_KEY,
      safeAddress: SAFE_ACCOUNT
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

    const isValid = await safeSdk.isValidTransaction(safeTransaction);

    if (!isValid)
      return isValid;

    const apiKit = new SafeApiKit({
      chainId: BigInt(config.constants.OPTIMISM_CHAIN_ID)
    })


    const executeTxResponse = await safeSdk.executeTransaction(safeTransaction)
    return executeTxResponse.hash;

  }

  async tryAttestWithRelayKit(account: string, txData: any): Promise<string | boolean> {

    console.log('Init Safe4337Pack')
    const safe4337Pack = await (await Safe4337Pack).Safe4337Pack.init({
      provider: JSON_RPC_PROVIDER,
      signer: ATTESTATOR_SIGNER_PRIVATE_KEY,
      bundlerUrl: `https://api.pimlico.io/v2/${config.constants.OPTIMISM_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`,
      options: {
        owners: [this.wallet.address], // this.wallet.address
        threshold: 1
      },
      paymasterOptions: {
        isSponsored: true,
        paymasterUrl: `https://api.pimlico.io/v2/${config.constants.OPTIMISM_CHAIN_ID}/rpc?apikey=${PIMLICO_API_KEY}`,
      }
    })
    console.log('Populate transaction')
    const calldata = await this.eas.attest.populateTransaction(txData);
    const transaction: MetaTransactionData = {
      to: ZeroAddress,// this.easContractAddress,
      value: '0',
      data: '0x',//calldata.data,
      operation: OperationType.Call
    }
    console.log('Create transaction')
    const safeOperation = await safe4337Pack.createTransaction({ transactions: [transaction] })
    console.log('Sign transaction')
    const signedSafeOperation = await safe4337Pack.signSafeOperation(safeOperation)
    console.log('Execute transaction')
    const userOperationHash = await safe4337Pack.executeTransaction({
      executable: signedSafeOperation
    })
    console.log('Hash de luxito ', userOperationHash)
    return userOperationHash;

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

      await this.tryAttestWithRelayKit(account, txData)
      return

      let attestSuccess = await this.tryAttestWithSafe(account, txData);
      if (!attestSuccess)
        attestSuccess = await this.tryAttestWithRelayKit(account, txData)

      if (!attestSuccess)
        throw new Error('Not enough funds');

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


      await this.claimBadgesOptimistically(account, badgeUpdates);

      return {
        hash: attestSuccess,
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
