
import { redisService } from "@/services/redis.service";
import { superChainAccountService } from "@/services/superChainAccount.service";
import { createAppClient, viemConnector } from "@farcaster/auth-client";


export async function verifyFarcaster(req, res) {

    const { message, signature, nonce } = req.body;
    const appClient = createAppClient({
        ethereum: viemConnector(),
    });

    console.log("Verifying Farcaster link with:", req.body);
    const verifyResponse = await appClient.verifySignInMessage({
        message: message as string,
        signature: signature as `0x${string}`,
        domain: "staging.account.superchain.eco",
        nonce: nonce,
    });
    const { success, fid } = verifyResponse;
    console.log("Response Farcaster link :", verifyResponse);
    if (!success) {
        return res.status(400).json({ success: false, message: "Verification failed." });
    }

    console.log("Saved!!");
    const account = req.params.account;
    const eoas = await superChainAccountService.getEOAS(account);
    const CACHE_KEY = `farcasterLink-${eoas.join(',')}`;
    redisService.setCachedData(CACHE_KEY, req.body, 10 * 60)
    return res.json({ success: true });
}