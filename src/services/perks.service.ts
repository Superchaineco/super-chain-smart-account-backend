import { PerksHelper } from "./perks.helper";
import { SuperChainAccountService } from "./superChainAccount.service";

export type Perk = {
    name: string;
    value: number;
}


class PerksService {
    private readonly perksHelper: PerksHelper;
    private readonly superChainAccountService: SuperChainAccountService;

    constructor() {
        this.perksHelper = new PerksHelper();
        this.superChainAccountService = new SuperChainAccountService();
    }

    public async getPerks(eoas: string[], account: string): Promise<Perk[]> {
        const perks: Perk[] = [];
        const accountLevel = await this.superChainAccountService.getAccountLevel(account);
        const rafflePerks = await this.perksHelper.getRafflePerks(accountLevel);
        perks.push(rafflePerks);
        return perks;
    }
}

export const perksService = new PerksService();