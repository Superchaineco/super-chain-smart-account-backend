import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import { CovalentClient } from "@covalenthq/client-sdk";
import fs from "fs";
import csv from "csv-parser";
import { redisService } from "./redis.service"; // Importar RedisService
import axios from "axios";
import { get } from "http";
import { join } from "path";
import { env } from "process";

type CsvRow = {
  Address: string;
  ENS: string;
};

type TalentPassport = {
  passport: {
    score: number;
  }
}

type PassportCredential = {
  passport_credentials: {
    name: string;
    value: string;
  }[]
}

const CitizenFilePath = "src/data/citizen.csv";

export class BadgesHelper {
  covalent = new CovalentClient(process.env.COVALENT_API_KEY!);

  async getOptimisimTransactions(eoas: string[]): Promise<number> {
    const cacheKey = `optimisimTransactions-${eoas.join(",")}`;
    const ttl = 86400; // 1 día

    const fetchFunction = async () => {
      const settings = {
        apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
        network: Network.OPT_MAINNET,
      };

      const alchemy = new Alchemy(settings);
      const transactions = await eoas.reduce(async (accPromise, eoa) => {
        const acc = await accPromise;
        const { transfers } = await alchemy.core.getAssetTransfers({
          toBlock: "latest",
          fromAddress: eoa,
          excludeZeroValue: true,
          category: [
            AssetTransfersCategory.ERC20,
            AssetTransfersCategory.ERC1155,
            AssetTransfersCategory.EXTERNAL,
            AssetTransfersCategory.ERC721,
          ],
        });
        if (!transfers) return acc;
        return acc + transfers.length;
      }, Promise.resolve(0));

      return transactions;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  async getBaseTransactions(eoas: string[]) {
    const cacheKey = `baseTransactions-${eoas.join(",")}`;
    const ttl = 86400; // 1 día

    const fetchFunction = async () => {
      const settings = {
        apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
        network: Network.BASE_MAINNET,
      };
      const alchemy = new Alchemy(settings);
      const transactions = await eoas.reduce(async (accPromise, eoa) => {
        const acc = await accPromise;
        const { transfers } = await alchemy.core.getAssetTransfers({
          toBlock: "latest",
          fromAddress: eoa,
          excludeZeroValue: true,
          category: [
            AssetTransfersCategory.ERC20,
            AssetTransfersCategory.ERC1155,
            AssetTransfersCategory.EXTERNAL,
            AssetTransfersCategory.ERC721,
          ],
        });
        if (!transfers) return acc;
        return acc + transfers.length;
      }, Promise.resolve(0));

      return transactions;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  async getSepoliaTransactions(eoas: string[]) {
    const cacheKey = `sepoliaTransactions-${eoas.join(",")}`;
    const ttl = 86400; // 1 día

    const fetchFunction = async () => {
      const settings = {
        apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
        network: Network.ETH_SEPOLIA,
      };
      const alchemy = new Alchemy(settings);
      const transactions = await eoas.reduce(async (accPromise, eoa) => {
        const acc = await accPromise;
        const { transfers } = await alchemy.core.getAssetTransfers({
          fromBlock: "0x0",
          toBlock: "latest",
          fromAddress: eoa,
          withMetadata: false,
          excludeZeroValue: false,
          category: [
            AssetTransfersCategory.ERC20,
            AssetTransfersCategory.ERC1155,
            AssetTransfersCategory.EXTERNAL,
            AssetTransfersCategory.ERC721,
            AssetTransfersCategory.INTERNAL,
          ],
        });
        if (!transfers) return acc;

        return acc + transfers.length;
      }, Promise.resolve(0));

      return transactions;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  async getModeTransactions(eoas: string[]) {
    const cacheKey = `modeTransactions-${eoas.join(",")}`;
    const ttl = 86400; // 1 día

    const fetchFunction = async () => {
      const transactions = eoas.reduce(async (accPromise, eoa) => {
        const resp =
          await this.covalent.TransactionService.getAllTransactionsForAddressByPage(
            "mode-testnet",
            eoa,
          );
        return (await accPromise) + resp.data.items.length;
      }, Promise.resolve(0));

      return transactions;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  async isCitizen(eoas: string[]) {
    const csvData = await this.loadCsvData(CitizenFilePath);

    for (const eoa of eoas) {
      const citizen = csvData.find((row) =>
        row.Address
          ? row.Address.toLocaleLowerCase() === eoa.toLowerCase()
          : false,
      );
      if (citizen) {
        return true;
      }
    }
    return false;
  }

  async hasNouns(eoas: string[]) {
    const cacheKey = `hasNouns-${eoas.join(",")}`;
    const ttl = 86400; // 1 día

    const fetchFunction = async () => {
      const provider = new ethers.JsonRpcProvider("https://rpc.ankr.com/eth");
      const contract = new ethers.Contract(
        process.env.NOUNS_CONTRACT_ADDRESS!,
        ["function balanceOf(address owner) public view returns (uint256)"],
        provider,
      );
      let countNouns = 0;
      for (const eoa of eoas) {
        const balance = await contract.balanceOf(eoa);
        if (balance > 0) countNouns++;
      }
      return countNouns;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  async getGivethDonations(eoas: string[]) {
    const cacheKey = `givethDonations-${eoas.join(",")}`;
    const ttl = 86400; // 1 día

    const fetchFunction = async () => {
      const givethApiUrl = "https://mainnet.serve.giveth.io/graphql";

      const donationsQuery = `
        query AddressGivethDonations($fromWalletAddresses: [String!]!) {
        donationsFromWallets(fromWalletAddresses: $fromWalletAddresses) {
          valueUsd
          createdAt
          }
        }
        `;
      const query = {
        query: donationsQuery,
        variables: {
          fromWalletAddresses: [...eoas],
        },
      };

      try {
        const response = await fetch(givethApiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(query),
        });

        const res = await response.json();
        if (!res?.data?.donationsFromWallets) return 0;

        return (
          res.data.donationsFromWallets as {
            valueUsd: number;
            createdAt: string;
          }[]
        ).reduce((total, d) => total + d.valueUsd, 0);
      } catch (error) {
        console.log(error);
        return 0;
      }
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  async getGitcoinDonations(eoas: string[]) {
    const cacheKey = `gitcoinDonations-${eoas.join(",")}`;
    const ttl = 86400; // 1 día

    const fetchFunction = async () => {
      const gitcoinIndexerUrl =
        "https://grants-stack-indexer-v2.gitcoin.co/graphql";
      const gitcoinDonationsQuery = `query getGitcoinDonations($fromWalletAddresses: [String!]) {
    donations(filter: { donorAddress: {in: $fromWalletAddresses}}) {
      amountInUsd
    }
  }`;

      try {
        const res = await fetch(gitcoinIndexerUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: gitcoinDonationsQuery,
            variables: { fromWalletAddresses: [...eoas.map(eoa => eoa.toLocaleLowerCase())] },
          }),
        }).then((r) => r.json());

        console.log(res);
        const donations: { amountInUsd: number }[] = res.data?.donations || [];
        return donations.reduce((sum, d) => sum + d.amountInUsd, 0);
      } catch {
        return 0;
      }
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  async isWorldcoinVerified(eoas: string[]) {
    const cacheKey = `worldcoinVerified-${eoas.join(",")}`;
    const ttl = 86400; // 1 día

    const fetchFunction = async () => {
      let isWorldcoinVerified = false;
      for (const eoa of eoas) {
        const passportCredentials = await axios.get<PassportCredential>('https://api.talentprotocol.com/api/v2/passport_credentials', {
          headers: {
            "x-api-key": process.env.TALENT_API_KEY!
          },
          params: {
            passport_id: eoa,
          }
        })
        if (passportCredentials.data.passport_credentials.find(c => c.name === "World ID" && c.value === "Verified")) {
          return true;
        }
      }

      return isWorldcoinVerified;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  async getTalentScore(eoas: string[]) {
    const cacheKey = `talentScore-${eoas.join(",")}`;
    const ttl = 86400; // 1 día

    const fetchFunction = async () => {
      let highestTalentScore = 0;
      for (const eoa of eoas) {
        const talentPassport = await axios.get<TalentPassport>(`https://api.talentprotocol.com/api/v2/passports/${eoa}`, {
          headers: {
            "x-api-key": process.env.TALENT_API_KEY!
          }
        })
        if (talentPassport.data.passport.score > highestTalentScore) {
          highestTalentScore = talentPassport.data.passport.score;
        }
      }
      return highestTalentScore;
    };

    return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
  }

  private async loadCsvData(filePath: string): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
      const results: CsvRow[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data: CsvRow) => results.push(data))
        .on("end", () => resolve(results));
    });
  }
}

export interface IBadgesHelper {
  getOptimisimTransactions(eoas: string[]): Promise<number>;
  getBaseTransactions(eoas: string[]): Promise<number>;
  getSepoliaTransactions(eoas: string[]): Promise<number>;
  getModeTransactions(eoas: string[]): Promise<number>;
  isCitizen(eoas: string[]): Promise<boolean>;
  hasNouns(eoas: string[]): Promise<number>;
  getGivethDonations(eoas: string[]): Promise<number>;
  getGitcoinDonations(eoas: string[]): Promise<number>;
  isWorldcoinVerified(eoas: string[]): Promise<boolean>;
  getTalentScore(eoas: string[]): Promise<number>;
}