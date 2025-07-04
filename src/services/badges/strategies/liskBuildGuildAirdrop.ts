import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";

type Response = {
    "guildId": number,
    "joinedAt": string,
    "roleIds": number[],
    "isAdmin": boolean,
    "isOwner": boolean
}[]

export class LiskBuildGuildAirdropStrategy extends BaseBadgeStrategy {

    LISK_GUILD_ID = 74004
    LISK_GUILD_AIRDROP_ROLE_ID = 146573

    async getValue(eoas: string[]): Promise<boolean> {
        const cacheKey = `liskBuildGuildAirdropStrategy-${eoas.join(",")}`;
        const ttl = 3600

        const fetchFunction = async () => {
            let hasRole = false;
            for (const eoa of eoas) {
                try {
                    const response = await axios.get<Response>(`https://api.guild.xyz/v2/users/${eoa}/memberships`);
                    const liskGuild = response.data.find((guild) => guild.guildId === this.LISK_GUILD_ID);
                    if (liskGuild && liskGuild.roleIds) {
                        hasRole = liskGuild.roleIds.some(role => role === this.LISK_GUILD_AIRDROP_ROLE_ID);
                        if (hasRole) {
                            break;
                        }
                    }
                } catch (e) {
                    if (axios.isAxiosError(e) && (e.response?.status === 404 || e.response?.status === 503)) {
                        continue;
                    }
                    console.error(e)
                }
            }
            return hasRole
        };

        return redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);
    }
}