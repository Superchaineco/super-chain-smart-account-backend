import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { ethers } from "ethers";
import { CovalentClient } from "@covalenthq/client-sdk";
import fs from "fs";
import csv from "csv-parser";
import { redis } from "../utils/cache"; // Asegúrate de que la ruta sea correcta

type CsvRow = {
  Address: string;
  ENS: string;
};
const CitizenFilePath = "src/data/citizen.csv";

export class BadgesHelper {
  covalent = new CovalentClient(process.env.COVALENT_API_KEY!);

  private async getCachedData<T>(key: string, fetchFunction: () => Promise<T>): Promise<T> {
    const cachedData = await redis.get(key);
    if (cachedData) {
      console.log(`Cache hit for key: ${key}`);
      return JSON.parse(cachedData);
    }

    const data = await fetchFunction();
    await redis.set(key, JSON.stringify(data), "EX", 86400); 
    return data;
  }

  async getOptimisimTransactions(eoas: string[]): Promise<number> {
    const cacheKey = `optimisimTransactions-${eoas.join(",")}`;
    return this.getCachedData(cacheKey, async () => {
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
    });
  }

  async getBaseTransactions(eoas: string[]) {
    const cacheKey = `baseTransactions-${eoas.join(",")}`;
    return this.getCachedData(cacheKey, async () => {
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
    });
  }

  async getSepoliaTransactions(eoas: string[]) {
    const cacheKey = `sepoliaTransactions-${eoas.join(",")}`;
    return this.getCachedData(cacheKey, async () => {
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
    });
  }

  async getModeTransactions(eoas: string[]) {
    const cacheKey = `modeTransactions-${eoas.join(",")}`;
    return this.getCachedData(cacheKey, async () => {
      const transactions = eoas.reduce(async (accPromise, eoa) => {
        const resp =
          await this.covalent.TransactionService.getAllTransactionsForAddressByPage(
            "mode-testnet",
            eoa,
          );
        return (await accPromise) + resp.data.items.length;
      }, Promise.resolve(0));

      return transactions;
    });
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
    return this.getCachedData(cacheKey, async () => {
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
    });
  }

  async getGivethDonations(eoas: string[]) {
    const cacheKey = `givethDonations-${eoas.join(",")}`;
    return this.getCachedData(cacheKey, async () => {
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
    });
  }

  async getGitcoinDonations(eoas: string[]) {
    const cacheKey = `gitcoinDonations-${eoas.join(",")}`;
    return this.getCachedData(cacheKey, async () => {
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
            variables: { fromWalletAddresses: eoas },
          }),
        }).then((r) => r.json());

        console.log(res);
        const donations: { amountInUsd: number }[] = res.data?.donations || [];
        return donations.reduce((sum, d) => sum + d.amountInUsd, 0);
      } catch {
        return 0;
      }
    });
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
}
