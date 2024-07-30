import { Alchemy, AssetTransfersCategory, Network } from 'alchemy-sdk';
import { ethers } from 'ethers';
import { CovalentClient } from '@covalenthq/client-sdk';
import fs from 'fs';
import csv from 'csv-parser';


type CsvRow = {
  Address: string;
  ENS: string;
}
const CitizenFilePath = 'src/data/citizen.csv';



export class BadgesHelper {
  covalent = new CovalentClient(process.env.COVALENT_API_KEY!);

  async getOptimisimTransactions(
    eoas: string[],
  ): Promise<number> {
    const settings = {
      apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
      network: Network.OPT_MAINNET,
    };

    const alchemy = new Alchemy(settings);
    const transactions = await eoas.reduce(async (accPromise, eoa) => {
      const acc = await accPromise;
      const { transfers } = await alchemy.core.getAssetTransfers({
        toBlock: 'latest',
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
  }

  async getBaseTransactions(eoas: string[]) {
    const settings = {
      apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
      network: Network.BASE_MAINNET,
    };
    const alchemy = new Alchemy(settings);
    const transactions = await eoas.reduce(async (accPromise, eoa) => {
      const acc = await accPromise;
      const { transfers } = await alchemy.core.getAssetTransfers({
        toBlock: 'latest',
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
  }

  async getSepoliaTransactions(eoas: string[]) {
    const settings = {
      apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
      network: Network.ETH_SEPOLIA,
    };
    const alchemy = new Alchemy(settings);
    const transactions = await eoas.reduce(async (accPromise, eoa) => {
      const acc = await accPromise;
      const { transfers } = await alchemy.core.getAssetTransfers({
        fromBlock: "0x0",
        toBlock: 'latest',
        fromAddress: eoa,
        withMetadata: false,
        excludeZeroValue: false,
        category: [
          AssetTransfersCategory.ERC20,
          AssetTransfersCategory.ERC1155,
          AssetTransfersCategory.EXTERNAL,
          AssetTransfersCategory.ERC721,
          AssetTransfersCategory.INTERNAL
        ],
      });
      if (!transfers) return acc;

      return acc + transfers.length;
    }, Promise.resolve(0));
    return transactions;
  }

  async getModeTransactions(eoas: string[]) {
    const transactions = eoas.reduce(async (accPromise, eoa) => {
      const resp =
        await this.covalent.TransactionService.getAllTransactionsForAddressByPage(
          'mode-testnet',
          eoa
        );
      return (await accPromise) + resp.data.items.length;
    }, Promise.resolve(0));
    return transactions;
  }

  async isCitizen(eoas: string[]) {
    const csvData = await this.loadCsvData(CitizenFilePath);

    for (const eoa of eoas) {
      const citizen = csvData.find((row) => row.Address ? row.Address.toLocaleLowerCase() === eoa.toLowerCase() : false);
      if (citizen) {
        return true;
      }
    }
    return false;
  }

  async hasNouns(eoas: string[]) {
    const provider = new ethers.JsonRpcProvider('https://rpc.ankr.com/eth	');
    const contract = new ethers.Contract(
      process.env.NOUNS_ADDRESS!,
      ['function balanceOf(address owner) public view returns (uint256)'],
      provider
    );
    let countNouns = 0;
    for (const eoa of eoas) {
      const balance = await contract.balanceOf(eoa);
      if (balance.gt(0)) countNouns++;
    }
    return countNouns;
  }

  private async loadCsvData(filePath: string): Promise<CsvRow[]> {
    return new Promise((resolve, reject) => {
      const results: CsvRow[] = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data: CsvRow) => results.push(data))
        .on('end', () => resolve(results))
    });
  }

}

export interface IBadgesHelper {
  getOptimisimTransactions(eoas: string[]): Promise<number>;
  getBaseTransactions(eoas: string[]): Promise<number>;
  getSepoliaTransactions(eoas: string[]): Promise<number>
  getModeTransactions(eoas: string[]): Promise<number>;
  isCitizen(eoas: string[]): Promise<boolean>;
  hasNouns(eoas: string[]): Promise<number>;
}
