import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();

export const pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    max: Number(process.env.PG_POOL_MAX ?? 10),
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
});
pgPool.on('connect', (c) => {
    c.query("SET statement_timeout='30s'; SET idle_in_transaction_session_timeout='30s';").catch(() => { });
});
