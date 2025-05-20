import { BaseBadgeStrategy } from "./badgeStrategy";

export class ModeTransactionsStrategy extends BaseBadgeStrategy {


  async getValue(eoas: string[]): Promise<number> {

    return await this.getCachedValue({ service: "blockscout", chain: "mode-34443", chainId: "34443", eoas });

  }
}