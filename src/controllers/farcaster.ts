
import { redisService } from "@/services/redis.service";
import { superChainAccountService } from "@/services/superChainAccount.service";
import { createAppClient, viemConnector } from "@farcaster/auth-client";


export async function verifyFarcaster(req, res) {

    const { message, signature, nonce } = req.body;
    const appClient = createAppClient({
        ethereum: viemConnector(),
    });

    const verifyResponse = await appClient.verifySignInMessage({
        message: message as string,
        signature: signature as `0x${string}`,
        domain: "staging.account.superchain.eco",
        nonce: nonce,
    });
    const { success, fid } = verifyResponse;

    if (!success) {
        return res.status(400).json({ success: false, message: "Verification failed." });
    }
    const account = req.params.account;
    const eoas = await superChainAccountService.getEOAS(account);
    const CACHE_KEY = `farcasterLink-${eoas.join(',')}`;
    redisService.setCachedData(CACHE_KEY, req.body, 10 * 60)
    return res.json({ success: true });
}