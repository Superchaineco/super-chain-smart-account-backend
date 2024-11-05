
import { BadgeStrategy } from './badgeStrategy';
import { BaseTransactionsStrategy } from './baseTransactions';
import { CitizenCheckStrategy } from './citizenCheck';
import { GitcoinDonationsStrategy } from './gitcoinDonations';
import { GivethDonationsStrategy } from './givethDonations';
import { ModeTransactionsStrategy } from './modeTransactions';
import { NounsCheckStrategy } from './nounsCheck';
import { OpTransactionsStrategy } from './opTransactions';
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

            case "Giveth Donations Made":
                return new GivethDonationsStrategy()

            case "Gitcoin Donations Made":
                return new GitcoinDonationsStrategy()

            case "Talent Protocol score":
                return new TalentScoreStrategy()

            case "Worldcoin Verification":
                return new WorldCoinCheckStrategy()

            default:
                throw new Error(`Badge strategy ${badgeName} not found`);
        }
    }


}