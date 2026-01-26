import type { Request, Response } from "express";
import fs from "fs";
import path from "path";
import csv from "csv-parser";

/**
 * Merkl expects:
 *   [{ address: string, boost: string }]
 *
 * For this campaign:
 *   - If address is in badge holders (Account or any EOA in the CSV row): boost = "3000000000" (3 * 1e9)
 *   - Otherwise: boost = "1000000000" (1 * 1e9)
 *   - Always include ZERO_ADDRESS with "1000000000"
 *
 * Notes:
 * - Lowercase on both sides.
 * - Dedupe response addresses (Merkl uses first occurrence).
 * - Supports both request payload shapes:
 *     sendScores=true  => body: { address: string; score: string }[]
 *     sendScores=false => body: { addresses: string[] }
 */

/** Constants */
const ZERO_ADDRESS: string = "0x0000000000000000000000000000000000000000";
const BOOST_1X_9D: string = "1000000000";
const BOOST_3X_9D: string = "3000000000";

/**
 * CSV file (adjust path as needed)
 * Example file header (your sample):
 * Account;EOA;Lisk Badge Tier;Points
 *
 * IMPORTANT: Your CSV uses ';' delimiter, so we set `separator: ';'`.
 */
const LISK_BADGE_CSV_FILE_PATH: string = "src/data/liskHolders.csv"

/** Types (explicit, no inference) */
type MerklSendScoresRow = { address: string; score: string };
type MerklNoScoresBody = { addresses: string[] };

type MerklBoostResponseRow = {
    address: string;
    boost: string;
};

type LiskBadgeCsvRow = {
    Account?: string;
    EOA?: string;
    "Lisk Badge Tier"?: string;
    Points?: string;
};

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

function normalizeAddress(address: string): string {
    return address.trim().toLowerCase();
}

function extractRequestedAddresses(body: unknown): string[] {
    // sendScores=true => array of {address, score}
    if (Array.isArray(body)) {
        const out: string[] = [];
        for (const item of body) {
            if (isObject(item) && typeof item.address === "string") {
                out.push(item.address);
            }
        }
        return out;
    }

    // sendScores=false => { addresses: string[] }
    if (isObject(body) && Array.isArray(body.addresses)) {
        const out: string[] = [];
        for (const addr of body.addresses) {
            if (typeof addr === "string") out.push(addr);
        }
        return out;
    }

    return [];
}

function splitEoasCell(cell: string): string[] {
    // Your sample has multiple EOAs separated by commas in the same cell
    const parts: string[] = cell.split(",");
    const out: string[] = [];
    for (const p of parts) {
        const v: string = normalizeAddress(p);
        if (v.length > 0) out.push(v);
    }
    return out;
}

async function loadEligibleAddressSetFromCsv(
    filePath: string
): Promise<Set<string>> {
    return new Promise((resolve, reject) => {
        const eligible: Set<string> = new Set<string>();

        fs.createReadStream(filePath)
            .pipe(
                csv({
                    separator: ";",
                    mapHeaders: ({ header }: { header: string }): string => {
                        return header.replace(/^\uFEFF/, "").trim();
                    },

                    mapValues: ({ value }: { value: string }): string => value.trim(),
                })
            )

            .on("data", (row: LiskBadgeCsvRow) => {
                const accountRaw: string | undefined = row.Account;
                if (typeof accountRaw === "string" && accountRaw.trim().length > 0) {
                    eligible.add(normalizeAddress(accountRaw));
                }

                const eoaRaw: string | undefined = row.EOA;
                if (typeof eoaRaw === "string" && eoaRaw.trim().length > 0) {
                    const eoas: string[] = splitEoasCell(eoaRaw);
                    for (const eoa of eoas) eligible.add(eoa);
                }
            })
            .on("end", () => resolve(eligible))
            .on("error", (err: unknown) => reject(err));
    });
}

/**
 * Cache in-memory to avoid re-reading the CSV on every request.
 * If you want hot-reload, I can give you a TTL-based refresh.
 */
let ELIGIBLE_ADDRESS_SET: Set<string> | null = null;
let ELIGIBLE_LOADING: Promise<Set<string>> | null = null;

async function getEligibleAddressSet(): Promise<Set<string>> {
    if (ELIGIBLE_ADDRESS_SET) return ELIGIBLE_ADDRESS_SET;

    if (!ELIGIBLE_LOADING) {
        ELIGIBLE_LOADING = loadEligibleAddressSetFromCsv(LISK_BADGE_CSV_FILE_PATH)
            .then((set: Set<string>) => {
                ELIGIBLE_ADDRESS_SET = set;
                return set;
            })
            .finally(() => {
                ELIGIBLE_LOADING = null;
            });
    }

    return ELIGIBLE_LOADING;
}

export async function liskBoost(req: Request, res: Response): Promise<void> {
    try {
        const requestedRaw: string[] = extractRequestedAddresses(req.body);

        if (requestedRaw.length === 0) {
            res.status(400).json({
                error:
                    "Invalid body. Expected either Array<{address, score}> or { addresses: string[] }.",
            });
            return;
        }

        const eligibleSet: Set<string> = await getEligibleAddressSet();

        // Dedupe while preserving order (Merkl uses first occurrence)
        const seen: Set<string> = new Set<string>();
        const responseRows: MerklBoostResponseRow[] = [];

        for (const addr of requestedRaw) {
            const normalized: string = normalizeAddress(addr);

            if (seen.has(normalized)) continue;
            seen.add(normalized);

            const isEligible: boolean = eligibleSet.has(normalized);

            responseRows.push({
                address: normalized,
                boost: isEligible ? BOOST_3X_9D : BOOST_1X_9D,
            });
        }

        // Always include ZERO_ADDRESS with 1x (if not already present)
        const zeroNormalized: string = ZERO_ADDRESS.toLowerCase();
        if (!seen.has(zeroNormalized)) {
            responseRows.push({ address: zeroNormalized, boost: BOOST_1X_9D });
        }

        res.status(200).json(responseRows);
    } catch (err: unknown) {
        res.status(500).json({ error: "Internal error computing boosts." });
    }
}
