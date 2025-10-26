import config from "@/config";
import {
  ATTESTATOR_SIGNER_PRIVATE_KEY,
  BADGES_RPC_URL,
  ECO_ACCOUNTS_PERKS_ADDRESS,
  PIMLICO_API_KEY,
  REDEEM_PERK_ABI,
  SAFE_ADDRESS,
} from "@/config/superChain/constants";
import { OnchainAnalyticsProps } from "@safe-global/protocol-kit";
import { Safe4337Pack } from "@safe-global/relay-kit/dist/src/packs/safe-4337/Safe4337Pack";
import { OperationType } from "@safe-global/types-kit";
import { MetaTransactionData } from "@safe-global/types-kit";
import { Contract, Interface, JsonRpcProvider, Wallet } from "ethers";
import { execute, ExecutionResult } from "graphql";

export interface Perk {
  badgeId: number;
  tier: number;
}	

export class PerkService {
  private contractAddress = ECO_ACCOUNTS_PERKS_ADDRESS;
  private provider = new JsonRpcProvider(BADGES_RPC_URL);
  private wallet = new Wallet(ATTESTATOR_SIGNER_PRIVATE_KEY, this.provider);
  private contract = new Contract(
    this.contractAddress,
    REDEEM_PERK_ABI,
    this.wallet
  );

  public async redeemPerk(
    badgesTiers: Perk[],
    user: string
  ): Promise<string | boolean> {
    const onchainAnalytics: OnchainAnalyticsProps = {
      project: "SuperAccounts",
      platform: "Web",
    };
    console.log("🔑 Signing from address:", this.wallet.address);
    console.log("🔑 Signing private key:", ATTESTATOR_SIGNER_PRIVATE_KEY);

    const safe4337Pack = await Safe4337Pack.init({
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

    const iface = new Interface(REDEEM_PERK_ABI);
    const data = iface.encodeFunctionData("redeemPerks", [
      badgesTiers,
      user,
    ]) as `0x${string}`;


    const tx: MetaTransactionData = {
      to: ECO_ACCOUNTS_PERKS_ADDRESS,
      value: "0",
      data,
      operation: OperationType.Call, // 0
    };


    const safeOperation = await safe4337Pack.createTransaction({
      transactions: [tx],
    });
    const signedSafeOperation = await safe4337Pack.signSafeOperation(
      safeOperation
    );

    try {
      const userOperationHash = await safe4337Pack.executeTransaction({
        executable: signedSafeOperation,
      });
      console.log("UserOpHash:", userOperationHash);
      return userOperationHash;
    } catch (e) {
      console.error("Unexpected error executing redeemPerk with PAYMASTER:", e);
      return false;
    }
  }

}
