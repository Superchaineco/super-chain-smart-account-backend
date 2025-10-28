import { Contract, JsonRpcProvider } from "ethers";
import { Pool, QueryResult } from "pg";
import { redisService } from "./redis.service";
import {
  JSON_RPC_PROVIDER,
  SUPERCHAIN_ECO_AIRDROP_ADDRESS,
  SUPERCHAIN_ECO_AIRDROP_ABI,
} from "@/config/superChain/constants";

// -----------------------------
// Types
// -----------------------------

export type UpdateRecipientHashInput = {
  account: string;
  airdropId: string;
  txHash: string;
};

export type UpdateRecipientHashResult = {
  found: boolean;
  updatedRowHash?: string | null;
};

export type FetchAirdropForAccountInput = {
  account: string;
};

export type GetAirdropResponse = {
  eligible: boolean;
  address: string;
  value: string;
  proofs: string[];
  claimed: boolean;
  reasons: string[];
  airdrop_id: number | null;
  expiration_date: string | Date; // keep DB type passthrough
};

// -----------------------------
// Helpers
// -----------------------------

/** Normalize an EVM address string to 20-byte Buffer (bytea) and lower hex. */
function normalizeAccountToBytea(account: string): { addrHex: string; addrBuf: Buffer } {
  const hexNo0x: string = (account.startsWith("0x") ? account.slice(2) : account).toLowerCase();
  if (!/^[0-9a-f]{40}$/.test(hexNo0x)) {
    throw new Error("Invalid account (must be 20-byte hex address)");
  }
  return {
    addrHex: hexNo0x,
    addrBuf: Buffer.from(hexNo0x, "hex"),
  };
}

/** Map Postgres bytea[] proofs to '0x...' strings. */
function mapProofs(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((p: unknown) => {
    if (Buffer.isBuffer(p)) return `0x${p.toString("hex")}`;
    if (typeof p === "string") return p.startsWith("0x") ? p : `0x${p}`;
    return String(p);
  });
}

// -----------------------------
// Service
// -----------------------------

export class AirdropService {
  private readonly pool: Pool;
  private readonly airdropContract: Contract;

  constructor(pool?: Pool) {
    // You can inject a shared Pool from outside for tests / DI.
    this.pool =
      pool ??
      new Pool({
        connectionString: process.env.DATABASE_URL,
        // optional: max, idleTimeoutMillis, etc.
      });

    const provider = new JsonRpcProvider(JSON_RPC_PROVIDER);
    this.airdropContract = new Contract(SUPERCHAIN_ECO_AIRDROP_ADDRESS, SUPERCHAIN_ECO_AIRDROP_ABI, provider);
  }

  // ---------------------------
  // Public: Redis (as you had)
  // ---------------------------
  public async getAirdropData(account: string): Promise<unknown> {
    const airdropData = await redisService.JSONGet("airdrop-allowlist", account);
    return airdropData;
  }

  // ---------------------------
  // Public: On-chain check
  // ---------------------------
  public async isAirdropClaimed(account: string, tokenAddress: string, conditionId: number): Promise<boolean> {
    // Adjust the third param (conditionId) if needed
    return await this.airdropContract.isClaimed(account, tokenAddress, conditionId);
  }

  // ---------------------------
  // Public: DB mutations/queries
  // ---------------------------

  /** Update airdrop_recipients.hash for a given (address, airdropId). */
  public async updateRecipientHash(input: UpdateRecipientHashInput): Promise<UpdateRecipientHashResult> {
    const { account, airdropId, txHash } = input;

    // Validate address format here so controller can stay thin.
    const { addrBuf } = normalizeAccountToBytea(account);

    const sql: string = `
UPDATE airdrop_recipients AS ar
SET hash = $1
FROM airdrops
WHERE airdrops.id = ar.airdrop_id
  AND ar.address = $2
  AND LOWER(airdrops.label) = LOWER($3)
RETURNING ar.hash;

    `;
    const params: [string, Buffer, string] = [txHash, addrBuf, airdropId];

    const result: QueryResult = await this.pool.query(sql, params);

    if (result.rowCount === 0) {
      return { found: false };
    }

    return {
      found: true,
      updatedRowHash: result.rows?.[0]?.hash ?? null,
    };
  }

  /** Fetch latest airdrop row for an account and shape the API response. */
  public async fetchAirdropForAccount(input: FetchAirdropForAccountInput, conditionId: number): Promise<GetAirdropResponse> {
    const { account } = input;
    const { addrBuf } = normalizeAccountToBytea(account);

    const q: string = `
      SELECT
        a.id                             AS airdrop_id,
        a.label                          AS label,
        ar.amount::text                  AS amount,
        ar.proof                         AS proof,
        ar.reasons                       AS reasons,
        '0x' || encode(ar.address,'hex') AS address_hex,
        '0x' || encode(ar.leaf,'hex')    AS leaf_hex,
        '0x' || encode(a.root,'hex')     AS root_hex,
        '0x' || encode(a.token_address,'hex')     AS token_address_hex,
        a.expiration_date                AS expiration_date
      FROM airdrops a
      JOIN airdrop_recipients ar ON ar.airdrop_id = a.id
      WHERE ar.address = $1
      ORDER BY a.created_at DESC
      LIMIT 1;
    `;

    const { rows } = await this.pool.query(q, [addrBuf]);

    // Not found: mirror your previous fallback payload
    if (!rows || rows.length === 0) {
      const fallback: GetAirdropResponse = {
        eligible: false,
        address: "0x0000000000000000000000000000000000000000",
        value: "0",
        proofs: [],
        claimed: false,
        reasons: [],
        airdrop_id: null,
        expiration_date: new Date(),
      };
      return fallback;
    }

    const row = rows[0];

    const proofs: string[] = mapProofs(row.proof);
    const reasons: string[] = Array.isArray(row.reasons) ? row.reasons.map((r: unknown) => String(r)) : [];
    const amount: string = String(row.amount ?? "0");
    const tokenForClaimCheck = row.token_address_hex;
    // On-chain claimed check (keep exact behavior)
    const isClaimed: boolean = await this.isAirdropClaimed(account, tokenForClaimCheck, conditionId);

    const eligible: boolean = !!amount && amount !== "0";

    if (!eligible) {
      return {
        eligible: false,
        address: "0x0000000000000000000000000000000000000000",
        value: "0",
        proofs: [],
        claimed: false,
        reasons: [],
        airdrop_id: null,
        expiration_date: row.expiration_date,
      };
    }

    return {
      eligible: true,
      address: row.address_hex,
      value: amount,
      proofs,
      claimed: isClaimed,
      reasons,
      expiration_date: row.expiration_date,
      airdrop_id: row.airdrop_id,
    };
  }
}
