
import { BadgeStrategy } from './badgeStrategy';
import { BaseTransactionsStrategy } from './baseTransactions';
import { CitizenCheckStrategy } from './citizenCheck';
import { EarlyAdoptersStrategy } from './EarlyAdopters';
import { GitcoinDonationsStrategy } from './gitcoinDonations';
import { GivethDonationsStrategy } from './givethDonations';
import { InkTransactionsStrategy } from './inkTransactions';
import { LiskBuildGuildAirdropStrategy } from './liskBuildGuildAirdrop';
import { LiskTransactionsStrategy } from './liskTransactions';
import { MetalTransactionsStrategy } from './metalTransactions';
import { MintTransactionsStrategy } from './mintTransactions';
import { ModeTransactionsStrategy } from './modeTransactions';
import { NounsCheckStrategy } from './nounsCheck';
import { OpTransactionsStrategy } from './opTransactions';
import { SoneiumTransactionsStrategy } from './soneiumTransactions';
import { SuperChainTransactionsStrategy } from './superchainTransactions';
import { SuperCohort0Strategy } from './superCohort0Strategy';
import { SwellTransactionsStrategy } from './swellTransactions';
import { TalentScoreStrategy } from './talentScore';
import { UnichainTransactionsStrategy } from './unichainTransactions';
import { WorldCoinCheckStrategy } from './worldCoinCheck';



export class BadgeStrategyContext {
    static getBadgeStrategy(badgeName: string): BadgeStrategy {
        switch (badgeName) {

            case "OP Mainnet User":
                return new OpTransactionsStrategy()
            case "Base User":
                return new BaseTransactionsStrategy()
            case "Mode User":
                return new ModeTransactionsStrategy()
            case "Citizen":
                return new CitizenCheckStrategy()
            case "Hold Nouns":
                return new NounsCheckStrategy()
            case "Giveth Donor":
                return new GivethDonationsStrategy()
            case "Gitcoin Donor":
                return new GitcoinDonationsStrategy()
            case "Builder Score":
                return new TalentScoreStrategy()
            case "Worldcoin Verification":
                return new WorldCoinCheckStrategy()
            case "Super Cohort 24":
                return new SuperCohort0Strategy()
            case "Lisk User":
                return new LiskTransactionsStrategy()
            case "Lisk Aidrop S1":
                return new LiskBuildGuildAirdropStrategy()
            case "Early Power user":
                return new EarlyAdoptersStrategy()
            case "Soneium User":
                return new SoneiumTransactionsStrategy()
            case "Ink User":
                return new InkTransactionsStrategy()
            case "Unichain User":
                return new UnichainTransactionsStrategy()
            case "Season Super User":
                return new SuperChainTransactionsStrategy()

            //NOT RELEVANT FOR NOW
            // case "Mint User":
            //     return new MintTransactionsStrategy()
            // case "Swell User":
            //     return new SwellTransactionsStrategy()
            // case "Metal User":
            //     return new MetalTransactionsStrategy()

            default:
                throw new Error(`Badge strategy ${badgeName} not found`);
        }
    }


}