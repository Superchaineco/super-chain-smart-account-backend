import { BaseBadgeStrategy, ExternalApiCall } from "./badgeStrategy";

export class ModeTransactionsStrategy extends BaseBadgeStrategy {


  async getValue(eoas: string[]): Promise<number> {

    const apiCall: ExternalApiCall = { service: "blockscout", chain: "mode-34443", chainId: "34443", eoas, fromBlock: '0' }

    return await this.getCachedValue(apiCall);

  }
}