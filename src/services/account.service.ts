// src/data/accounts.repo.ts
import { pgPool } from '@/config/db';

export interface AccountRecord {
  account: string;
  nationality: string | null;
  username: string | null;
  eoas: string[];
  level: number;
  noun: any;
  total_points: number;
  total_badges: number;
}



export async function getAccountByAddress(account: string): Promise<AccountRecord | null> {
  const client = await pgPool.connect();
  try {
    const sql = `
      SELECT account, nationality, username, eoas,level,noun,total_points,total_badges
      FROM super_accounts
      WHERE LOWER(account) = LOWER($1)
      LIMIT 1
    `;
    const params: [string] = [account?.trim() ?? ""];
    const { rows } = await client.query<AccountRecord>(sql, params);
    return rows[0] ?? null;
  } finally {
    client.release();
  }
}


export async function getAccountByUsername(username: string): Promise<AccountRecord | null> {
  const client = await pgPool.connect();
  try {
    const sql = `
      SELECT account, nationality, username, eoas,level,noun,total_points,total_badges
      FROM super_accounts
      WHERE LOWER(username) = LOWER($1)
      LIMIT 1
    `;
    const params: [string] = [username?.trim() ?? ""];
    const { rows } = await client.query<AccountRecord>(sql, params);
    return rows[0] ?? null;
  } finally {
    client.release();
  }
}


export async function getAccounts(): Promise<AccountRecord[]> {
  const client = await pgPool.connect();
  try {
    const sql = `
      SELECT account,
             nationality,
             username,
             eoas,
             level,
             noun,
             total_points,
             total_badges
      FROM super_accounts
      ORDER BY username ASC
    `;
    const { rows } = await client.query<AccountRecord>(sql);
    return rows;
  } finally {
    client.release();
  }
}

function normalizeEoaLower(input: string): string {
  const s: string = (input ?? "").trim().toLowerCase();
  return s.startsWith("0x") ? s : `0x${s}`;
}

export async function listAccountsByEOAs(eoas: string[], page: number): Promise<AccountRecord[]> {
  const needles: string[] = Array.from(
    new Set((eoas ?? [])
      .map(normalizeEoaLower)
      .filter((s): s is string => !!s))
  );

  if (needles.length === 0) return [];

  const PAGE_SIZE: number = 100;
  const safePage: number = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const offset: number = (safePage - 1) * PAGE_SIZE;

  const client = await pgPool.connect();
  try {
    const sql: string = `
      SELECT account, nationality, username, eoas,level,noun,total_points,total_badges
      FROM super_accounts
      WHERE eoas && $1::text[]      
      ORDER BY account ASC
      OFFSET $2
      LIMIT $3
    `;
    const { rows } = await client.query<AccountRecord>(sql, [needles, offset, PAGE_SIZE]);
    return rows;
  } finally {
    client.release();
  }
}

export async function countAccountsByEOAs(eoas: string[]): Promise<number> {
  const needles: string[] = Array.from(
    new Set((eoas ?? [])
      .map(normalizeEoaLower)
      .filter((s): s is string => !!s))
  );

  if (needles.length === 0) return 0;

  const client = await pgPool.connect();
  try {
    const sql: string = `SELECT count(*)::int AS c FROM super_accounts WHERE eoas && $1::text[]`;
    const { rows } = await client.query<{ c: number }>(sql, [needles]);
    return rows[0]?.c ?? 0;
  } finally {
    client.release();
  }
}

function sanitizeEoas(list: unknown): string[] {
  const arr = Array.isArray(list) ? (list as string[]) : [];
  const lowered = arr
    .filter((x) => typeof x === "string")
    .map(normalizeEoaLower)
    .filter(Boolean);
  return Array.from(new Set(lowered)).sort();
}


export async function setAccountEOAs(
  account: string,
  eoas: string[]
): Promise<boolean> {
  const cleaned = sanitizeEoas(eoas);
  const client = await pgPool.connect();
  try {
    const sql = `
      UPDATE public.super_accounts
      SET eoas = ARRAY(
        SELECT DISTINCT lower(e)
        FROM unnest($1::text[]) AS t(e)
        ORDER BY 1
      )
      WHERE lower(account) = lower($2)
    `;
    const { rowCount } = await client.query(sql, [cleaned, account]);
    return rowCount > 0;
  } finally {
    client.release();
  }
}

export async function updateAccountStats(
  account: string,
  stats: { level?: number; total_points?: number; total_badges?: number }
): Promise<boolean> {
  const toIntOrNull = (v: unknown) =>
    typeof v === "number" && Number.isFinite(v)
      ? Math.floor(v)
      : null;

  const level = toIntOrNull(stats.level);
  const total_points = toIntOrNull(stats.total_points);
  const total_badges = toIntOrNull(stats.total_badges);

  if (level === null && total_points === null && total_badges === null) {
    return false;
  }

  const client = await pgPool.connect();
  try {
    const sql = `
      UPDATE public.super_accounts
      SET
        level        = COALESCE($1::int, level),
        total_points = COALESCE($2::int, total_points),
        total_badges = COALESCE($3::int, total_badges)
      WHERE lower(account) = lower($4)
    `;
    const { rowCount } = await client.query(sql, [
      level,
      total_points,
      total_badges,
      account,
    ]);
    return rowCount > 0;
  } finally {
    client.release();
  }
}


export async function setAccountNoun(
  account: string,
  noun: unknown
): Promise<boolean> {

  const payload =
    noun === null || typeof noun === "undefined"
      ? null
      : JSON.stringify(noun);

  const client = await pgPool.connect();
  try {
    const sql = `
      UPDATE public.super_accounts
      SET noun = $1::jsonb
      WHERE lower(account) = lower($2)
    `;
    const { rowCount } = await client.query(sql, [payload, account]);
    return rowCount > 0;
  } finally {
    client.release();
  }
}

export async function setAccountNationality(
  account: string,
  nationality: string
): Promise<boolean> {
  const acc = (account ?? "").trim();
  const nat = (nationality ?? "").trim();

  if (!acc) throw new Error("account is required");

  const client = await pgPool.connect();
  try {

    const sql = `
  MERGE INTO public.super_accounts u
  USING (SELECT lower($1) AS account, $2 AS nationality) s
  ON (lower(u.account) = s.account)
  WHEN MATCHED THEN
    UPDATE SET nationality = s.nationality
  WHEN NOT MATCHED THEN
    INSERT (account, nationality) VALUES (s.account, s.nationality)
`;
    const { rowCount } = await client.query(sql, [acc, nat]);
    return rowCount > 0;
  } finally {
    client.release();
  }
}