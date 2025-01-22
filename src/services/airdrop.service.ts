import { redisService } from "./redis.service";

export class AirdropService {

    public async getAirdropData(account: string): Promise<any> {
        const airdropData = await redisService.JSONGet('airdrop-allowlist', account);
        return airdropData;
    }
}