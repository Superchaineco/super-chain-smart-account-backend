import axios from "axios";
import { Bytes, Hex, Hash } from 'ox'

export async function verifyWorldId(req, res) {
    const { proof, merkle_root, nullifier_hash, verification_level } = req.body;
    const action = 'super-account-badge-validation'
    const app_id = process.env.WORLD_ID_APP_ID ?? 'app_staging_7b1ab4e8a1f7e1e26a23b6040af1bded'
    const signal = "verify"
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
            return res.json({ success: true });
        } else {
            return res.status(400).json({ success: false, message: "Verification failed." });
        }
    } catch (err) {
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
