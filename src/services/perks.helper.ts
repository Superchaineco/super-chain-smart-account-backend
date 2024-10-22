import { Perk } from "./perks.service";
import config from "../config/perks.json";
import { ethers, JsonRpcProvider } from "ethers";
import { JSON_RPC_PROVIDER } from "../config/superChain/constants";
import { redisService } from "./redis.service"; // Importar RedisService

export class PerksHelper {
    private readonly config: typeof config;

    constructor() {
        this.config = config;
    }

    public async getRafflePerks(accountLevel: number): Promise<Perk> {
        const cacheKey = `rafflePerks-${accountLevel}`;
        const ttl = 1800; // 30 minutes

        const fetchFunction = async () => {
            const { contractAddress, functionAbi } = this.config.SuperChainRaffle;
            const provider = new JsonRpcProvider(JSON_RPC_PROVIDER);
            const contract = new ethers.Contract(contractAddress, functionAbi, provider);
            const freeTicketsPerLevel: bigint[] = await contract.getFreeTicketsPerLevel();

            if (accountLevel === 0) {
                return {
                    name: "SuperChainRaffle",
                    value: 0,
                };
            }

            const freeTickets = freeTicketsPerLevel[accountLevel - 1] ?? freeTicketsPerLevel[freeTicketsPerLevel.length - 1];
            return {
                name: "SuperChainRaffle",
                value: Number(freeTickets),
            };
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}