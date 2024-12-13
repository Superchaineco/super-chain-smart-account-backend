
import { BadgeStrategy } from './badgeStrategy';
import { BaseTransactionsStrategy } from './baseTransactions';
import { CitizenCheckStrategy } from './citizenCheck';
import { EarlyAdoptersStrategy } from './EarlyAdopters';
import { GitcoinDonationsStrategy } from './gitcoinDonations';
import { GivethDonationsStrategy } from './givethDonations';
import { LiskBuildGuildAirdropStrategy } from './liskBuildGuildAirdrop';
import { LiskTransactionsStrategy } from './liskTransactions';
import { ModeTransactionsStrategy } from './modeTransactions';
import { NounsCheckStrategy } from './nounsCheck';
import { OpTransactionsStrategy } from './opTransactions';
import { SuperCohort0Strategy } from './superCohort0Strategy';
import { TalentScoreStrategy } from './talentScore';
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

            default:
                throw new Error(`Badge strategy ${badgeName} not found`);
        }
    }


}