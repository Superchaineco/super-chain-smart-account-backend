import { WORLD_ID_ACTION, WORLD_ID_APP_ID, WORLD_ID_SIGNAL } from "@/config/superChain/constants";
import { redisService } from "@/services/redis.service";
import { superChainAccountService } from "@/services/superChainAccount.service";
import axios from "axios";
import { Bytes, Hex, Hash } from 'ox'

export async function verifyWorldId(req, res) {
    const { proof, merkle_root, nullifier_hash, verification_level } = req.body;
    const action = WORLD_ID_ACTION
    const app_id = WORLD_ID_APP_ID
    const signal = WORLD_ID_SIGNAL
    const account = req.params.account;
    const eoas = await superChainAccountService.getEOAS(account);
    const CACHE_KEY = `worldID-${eoas.join(',')}`;
    try {
        const response = await axios.post(`https://developer.worldcoin.org/api/v2/verify/${app_id}`, {
            app_id,
            action,
            signal: "verify",
            proof,
            merkle_root,
            nullifier_hash,
            verification_level,
            signal_hash: hashToField(signal ?? '').digest,
        });
        console.log(response.data)
        if (response.data.success) {

            redisService.setCachedData(CACHE_KEY, req.body, 10 * 60)
            return res.json({ success: true });
        } else {
            return res.status(400).json({ success: false, message: "Verification failed." });
        }
    } catch (err) {
        if (err.response?.data.code == 'max_verifications_reached') {
            redisService.setCachedData(CACHE_KEY, req.body, 10 * 60)
            return res.json({ success: true });
        }
        console.error("World ID verification error:", err.response?.data);
        return res.status(500).json({ success: false, message: "Server error." });
    }
}

interface HashFunctionOutput {
    hash: bigint
    digest: `0x${string}`
}

function hashToField(input: Bytes.Bytes | string): HashFunctionOutput {
    if (Bytes.validate(input) || Hex.validate(input)) return hashEncodedBytes(input)

    return hashString(input)
}
function hashEncodedBytes(input: Hex.Hex | Bytes.Bytes): HashFunctionOutput {
    const hash = BigInt(Hash.keccak256(input, { as: 'Hex' })) >> BigInt(8)
    const rawDigest = hash.toString(16)

    return { hash, digest: `0x${rawDigest.padStart(64, '0')}` }
}
function hashString(input: string): HashFunctionOutput {
    const bytesInput = Buffer.from(input)

    return hashEncodedBytes(bytesInput)
}
