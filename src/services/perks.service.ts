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

    public async getUserPerks(account: string): Promise<Perk[]> {
        const accountLevel = await this.superChainAccountService.getAccountLevel(account);
        return this.getPerks(accountLevel);
    }

    public async getPerksPerLevel(level: number): Promise<Perk[]> {
        return this.getPerks(level);
    }

    private async getPerks(level: number): Promise<Perk[]> {
        const perks: Perk[] = [];
        const rafflePerks = await this.perksHelper.getRafflePerks(level);
        const sponsorPerks = this.perksHelper.getSponsorPerks(level);
        perks.push(rafflePerks);
        perks.push(sponsorPerks);
        return perks;
    }
}

export const perksService = new PerksService();