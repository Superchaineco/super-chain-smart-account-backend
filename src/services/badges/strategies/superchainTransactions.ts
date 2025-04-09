import { Alchemy, AssetTransfersCategory, Network } from "alchemy-sdk";
import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";
import { Season } from "@/types/index.types";
import { ROUTESCAN_API_KEY } from "@/config/superChain/constants";
import { badgesQueueService } from "../queue";


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

        let totalTxs = await this.getCachedValue("routescan", "optimism-10", eoas, season);
        totalTxs += await this.getCachedValue("routescan", "base-8453", eoas, season);
        totalTxs += await this.getCachedValue("routescan", "mode-34443", eoas, season);
        totalTxs += await this.getCachedValue("routescan", "ink-57073", eoas, season);
        totalTxs += await this.getCachedValue("blockscout", "unichain-130", eoas, season);
        totalTxs += await this.getCachedValue("blockscout", "Soneium", eoas, season);

        return totalTxs;
    }




    async getCachedValue(service: string, chain: string, eoas: string[], season: Season): Promise<number> {

        let value = 0;
        const fetchDataOfEOA = async (service: string, eoa: string): Promise<number> => {
            const chainId = chain.split("-")[1];
            const fromBlock = season.blockRanges[chain][0];
            const toBlock = Date.now() >= new Date(2025, 5, 11).getTime() ? '&to_block=' + season.blockRanges[chain][1] : ''

            const urlByService = {

                "blockscout": () => {
                    const baseUrl = chain === "Soneium" ? "https://soneium.blockscout.com" : `https://unichain.blockscout.com`
                    const urlGet = `${baseUrl}/api/v2/addresses/${eoa}/transactions?from_block=${fromBlock}${toBlock}`
                    return urlGet
                },
                "routescan": () => {
                    return `https://api.routescan.io/v2/network/mainnet/evm/${chainId}/etherscan/api?apikey=${ROUTESCAN_API_KEY}&module=account&action=txlist&address=${eoa}&startblock=${fromBlock}${toBlock}&page=1&offset=1000&sort=asc`
                }

            }

            const urlGet = urlByService[service]();
            const response = await badgesQueueService.getCachedDelayedResponse(urlGet)
            const totalTransactions = Number(response?.data.items.length ?? 0);
            return totalTransactions;
        };
        const cacheKey = `${service}-${chain}-${season.season}Transactions-${eoas.join(",")}`;
        for (const eoa of eoas) {
            value += await redisService.getCachedDataWithCallback(cacheKey, () => fetchDataOfEOA(service, eoa), ttl);
        }
        return value;

    }



    // async getBlockscoutValue(chain: string, eoas: string[], season: Season): Promise<number> {

    //     let value = 0;
    //     const fetchDataOfAddress = async (eoa: string) => {

    //         const fromBlock = season.blockRanges[chain][0];
    //         const toBlock = Date.now() >= new Date(2025, 5, 11).getTime() ? '&to_block=' + season.blockRanges[chain][1] : ''


    //         const baseUrl = chain === "Soneium" ? "https://soneium.blockscout.com" : `https://unichain.blockscout.com`
    //         const urlGet = `${baseUrl}/api/v2/addresses/${eoa}/transactions?from_block=${fromBlock}${toBlock}`
    //         const response = await badgesQueueService.getCachedDelayedResponse(urlGet)
    //         const totalTransactions = Number(response?.data.items.length ?? 0);
    //         return totalTransactions;
    //     };
    //     for (const eoa of eoas) {
    //         const cacheKey = `${chain}-${season.season}Transactions-${eoa}`;
    //         value += await redisService.getCachedDataWithCallback(cacheKey, () => fetchDataOfAddress(eoa), ttl);
    //     }
    //     return value;

    // }

    // async getRoutescanValue(chain: string, eoas: string[], season: Season): Promise<number> {
    //     const cacheKey = `${chain}-${season.season}Transactions-${eoas.join(",")}`;


    //     const fetchFunction = async () => {
    //         const chainId = chain.split("-")[1];
    //         const fromBlock = season.blockRanges[chain][0];
    //         const toBlock = Date.now() >= new Date(2025, 5, 11).getTime() ? '&startblock=' + season.blockRanges[chain][1] : ''
    //         let totalTransactions = 0;

    //         for (const eoa of eoas) {
    //             const response = await axios.get(`https://api.routescan.io/v2/network/mainnet/evm/${chainId}/etherscan/api?apikey=${ROUTESCAN_API_KEY}&module=account&action=txlist&address=${eoa}&startblock=${fromBlock}${toBlock}&page=1&offset=1000&sort=asc`)
    //             totalTransactions += response.data.result.filter((tx: any) => tx.from.toLowerCase() === eoa.toLowerCase()).length;


    //         }

    //         return totalTransactions;
    //     };

    //     return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    // }


}