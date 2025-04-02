

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
            "optimism-10": [130693412, 137000612],//2 secs x block
            "base-8453": [25098127, 31405327], //2 secs x block
            "unichain-130": [10151172, 22765572], //1 sec x block
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

        let totalTxs = await this.getRoutescanValue("optimism-10", eoas, season);
        totalTxs += await this.getRoutescanValue("base-8453", eoas, season);
        totalTxs += await this.getRoutescanValue("mode-34443", eoas, season);
        totalTxs += await this.getRoutescanValue("ink-57073", eoas, season);

        totalTxs += await this.getBlockscoutValue("unichain-130", eoas, season);
        totalTxs += await this.getBlockscoutValue("Soneium", eoas, season);

        return totalTxs;
    }


    async getBlockscoutValue(chain: string, eoas: string[], season: Season): Promise<number> {
        const cacheKey = `${chain}-${season.season}Transactions-${eoas.join(",")}`;

        const fromBlock = season.blockRanges[chain][0];
        const toBlock = Date.now() >= new Date(2025, 5, 11).getTime() ? '&to_block=' + season.blockRanges[chain][1] : ''
        const fetchFunction = async () => {
            const transactions = eoas.reduce(async (accPromise, eoa) => {

                const baseUrl = chain === "Soneium" ? "https://soneium.blockscout.com" : `https://unichain.blockscout.com`
                const response = await axios.get(`${baseUrl}/api/v2/addresses/${eoa}/transactions?from_block=${fromBlock}${toBlock}`)
                const transactions = Number(response.data.items.length);
                return (await accPromise) + transactions;


            }, Promise.resolve(0));

            return transactions;
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }

    async getRoutescanValue(chain: string, eoas: string[], season: Season): Promise<number> {
        const cacheKey = `${chain}-${season.season}Transactions-${eoas.join(",")}`;

        const chainId = chain.split("-")[1];
        const fromBlock = season.blockRanges[chain][0];
        const toBlock = Date.now() >= new Date(2025, 5, 11).getTime() ? '&startblock=' + season.blockRanges[chain][1] : ''
        const fetchFunction = async () => {

            const transactions = eoas.reduce(async (accPromise, eoa) => {
                const response = await axios.get(`https://api.routescan.io/v2/network/mainnet/evm/${chainId}/etherscan/api?module=account&action=txlist&address=${eoa}&startblock=${fromBlock}${toBlock}&page=1&offset=1000&sort=asc`)
                const transactions = response.data.result.filter((tx: any) => tx.from.toLowerCase() === eoa.toLowerCase()).length;
                return (await accPromise) + transactions;
            }, Promise.resolve(0));

            return transactions;


        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }


}