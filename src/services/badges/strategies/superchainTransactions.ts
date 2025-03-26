

import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";
import { Season } from "@/types/index.types";

const ttl = 3600

const seasons: Season[] = [
    {
        season: "S7",
        fromDate: new Date(2025, 0, 16),
        toDate: new Date(2025, 5, 11),
        blockRanges: {
            "opt-mainnet": [130693412, 137000612],//2 secs x block
            "base-mainnet": [25098127, 31405327], //2 secs x block
            "unichain-mainnet": [10151172, 22765572], //1 sec x block
            "mode-34443": [18418009, 24725209], //2 secs x block
            "ink-57073": [3505189, 16119589],//1 sec x block
            "Soneium": [1934425, 8241625], //2 secs x block
            //Not relevante yet
            "mint-185": [0, 0],
            "swell-1923": [0, 0],
            "Metal": [0, 0]
        }
    }
]




export class SuperChainTransactionsStrategy extends BaseBadgeStrategy {

    getSeason(): Season {
        return seasons.find(season => season.fromDate < new Date() && season.toDate > new Date());
    }

    async getValue(eoas: string[]) {


        const season = this.getSeason();
        let totalTxs = await this.getAlchemyValue(Network.OPT_MAINNET, eoas, season);
        totalTxs += await this.getAlchemyValue(Network.BASE_MAINNET, eoas, season);
        totalTxs += await this.getAlchemyValue(Network.UNICHAIN_MAINNET, eoas, season);

        totalTxs += await this.getRoutescanValue("mode-34443", eoas, season);
        totalTxs += await this.getRoutescanValue("ink-57073", eoas, season);

        totalTxs += await this.getSoneiumValue(eoas, season);

        // totalTxs += await this.getRoutescanValue("mint-185", eoas, season);
        // totalTxs += await this.getRoutescanValue("swell-1923", eoas, season);



        return totalTxs;
    }


    async getSoneiumValue(eoas: string[], season: Season): Promise<number> {
        const cacheKey = `soneiumTransactions-${eoas.join(",")}`;

        const fromBlock = season.blockRanges["Soneium"][0];
        const toBlock = season.blockRanges["Soneium"][1];
        const fetchFunction = async () => {
            const transactions = eoas.reduce(async (accPromise, eoa) => {
                const response = await axios.get(`https://soneium.blockscout.com/api/v2/addresses/${eoa}/transactions?from_block=${season}&to_block=${toBlock}`)
                const transactions = Number(response.data.result.transactions_count);
                return (await accPromise) + transactions;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }

    async getRoutescanValue(chain: string, eoas: string[], season: Season): Promise<number> {
        const cacheKey = `${chain}${season}Transactions-${eoas.join(",")}`;

        const chainId = chain.split("-")[1];
        const fromBlock = season.blockRanges[chain][0];
        const toBlock = season.blockRanges[chain][1];
        const fetchFunction = async () => {
            const transactions = eoas.reduce(async (accPromise, eoa) => {
                const response = await axios.get(`https://api.routescan.io/v2/network/mainnet/evm/${chainId}/etherscan/api?module=account&action=txlist&address=${eoa}&startblock=${fromBlock}&endblock=${toBlock}&page=1&offset=1000&sort=asc`)
                const transactions = response.data.result.filter((tx: any) => tx.from.toLowerCase() === eoa.toLowerCase()).length;
                return (await accPromise) + transactions;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }


    async getAlchemyValue(chain: Network, eoas: string[], season: Season): Promise<number> {
        const cacheKey = `${chain}${season}Transactions-${eoas.join(",")}`;


        const fetchFunction = async () => {
            const settings = {
                apiKey: process.env.ALCHEMY_PRIVATE_KEY!,
                network: chain,
            };

            const fromBlock = season.blockRanges[chain][0];
            const toBlock = season.blockRanges[chain][1];
            const alchemy = new Alchemy(settings);
            const transactions = await eoas.reduce(async (accPromise, fromAddress) => {
                const acc = await accPromise;
                const result = await alchemy.core.getAssetTransfers({
                    fromBlock, toBlock, fromAddress, category: [
                        AssetTransfersCategory.EXTERNAL,
                        AssetTransfersCategory.INTERNAL,
                        AssetTransfersCategory.ERC20,
                        AssetTransfersCategory.ERC721,
                        AssetTransfersCategory.ERC1155,
                        AssetTransfersCategory.SPECIALNFT]
                });
                return acc + result.transfers.length;
            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}