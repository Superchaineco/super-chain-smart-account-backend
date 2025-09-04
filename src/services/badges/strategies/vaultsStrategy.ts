import { BaseBadgeStrategy } from "./badgeStrategy";
import { redisService } from "../../redis.service";
import axios from "axios";
import { Pool } from 'pg';
import { DATABASE_URL } from '../../../config/superChain/constants';
import { parseEther, formatEther } from "ethers";

interface Threshold {
  amount: bigint;
  duration: number; // en milisegundos
}

export class VaultsStrategy extends BaseBadgeStrategy {
  private pool: Pool;

  constructor() {
    super();
    console.debug('DATABASE_URL:', DATABASE_URL);
    this.pool = new Pool({
      connectionString: DATABASE_URL,
    });
  }

  async getValue(eoas: string[], account: string, thresholds?: Threshold[]): Promise<any[]> {
    // Thresholds por defecto si no se pasan
    const defaultThresholds: Threshold[] = [
      { amount: parseEther("0.01"), duration: 7 * 24 * 3600 * 1000 }, // 0.01 ETH por 7 días
      { amount: parseEther("0.05"), duration: 7 * 24 * 3600 * 1000 }, // 0.05 ETH por 7 días
      { amount: parseEther("0.1"), duration: 7 * 24 * 3600 * 1000 }, // 0.1 ETH por 7 días
      { amount: parseEther("1"), duration: 7 * 24 * 3600 * 1000 }, // 1 ETH por 7 días
      { amount: parseEther("1"), duration: 28 * 24 * 3600 * 1000 }, // 1 ETH por 28 días
    ];
    const activeThresholds = thresholds || defaultThresholds;

    const cacheKey = `vaults_transactions-${account}`;
    const ttl = 3600; // 1 hora

    const fetchFunction = async () => {
      const client = await this.pool.connect();
      try {
        const query = `
          SELECT * FROM vaults_transactions
          WHERE account = $1
          ORDER BY block_time ASC
        `;
        const result = await client.query(query, [account]);
        return result.rows;
      } finally {
        client.release();
      }
    };

    const transactions = await redisService.getCachedDataWithCallback(cacheKey, fetchFunction, ttl);

    console.log(`Processing ${transactions.length} transactions for account ${account}`);
    if (transactions.length > 0) {
      const firstTx = new Date(transactions[0].block_time);
      const lastTx = new Date(transactions[transactions.length - 1].block_time);
      const totalDays = (lastTx.getTime() - firstTx.getTime()) / (24 * 3600 * 1000);
      console.log(`📅 First tx: ${firstTx.toISOString()}, Last tx: ${lastTx.toISOString()}, Total span: ${totalDays.toFixed(2)} days`);
      console.log(''); // spacing
    }

    // Compute running balance and continuous periods
    const results = activeThresholds.map(threshold => {
      const periods: { start: Date; end: Date }[] = [];
      let currentBalance = BigInt(0);
      let periodStart: Date | null = null;
      let inCount = 0;
      let outCount = 0;

      const thresholdAmount = threshold.amount;
      const days = threshold.duration / (24 * 3600 * 1000);

      console.log(''); // spacing before threshold block
      console.log(`📊 Evaluating threshold: ${formatEther(thresholdAmount)} ETH for ${days} days`);

      for (const tx of transactions) {
        const txTime = new Date(tx.block_time);
        const amount = BigInt(tx.amount);

        if (tx.direction === 'in') {
          currentBalance += amount;
          inCount++;
        } else if (tx.direction === 'out') {
          currentBalance -= amount;
          outCount++;
        }

        console.log(`🔁 TX ${tx.direction.toUpperCase()}: ${formatEther(amount)} ETH at ${txTime.toISOString()} → balance: ${formatEther(currentBalance)} ETH`);

        if (currentBalance >= thresholdAmount) {
          if (!periodStart) {
            periodStart = txTime;
            console.log(`▶️ Period started at ${txTime.toISOString()} (balance ${formatEther(currentBalance)} ETH)`);
          }
        } else {
          // Threshold broken at txTime — close the observed continuous period at this txTime
          if (periodStart) {
            const candidateEnd = txTime;
            const durationMs = candidateEnd.getTime() - periodStart.getTime();
            if (durationMs >= threshold.duration) {
              periods.push({ start: periodStart, end: candidateEnd });
              console.log(`✅ Period satisfied: ${periodStart.toISOString()} - ${candidateEnd.toISOString()} (closed by tx)`);
            } else {
              console.log(`⚠️ Observed period too short: ${periodStart.toISOString()} - ${candidateEnd.toISOString()} => ${(durationMs/(24*3600*1000)).toFixed(2)} days (required ${days} days)`);
            }
          }
          periodStart = null;
        }
      }

      // If period still open after processing all txs, count time until now
      if (periodStart) {
        const now = new Date();
        const durationMs = now.getTime() - periodStart.getTime();
        if (durationMs >= threshold.duration) {
          periods.push({ start: periodStart, end: now });
          console.log(`🎉 Period satisfied (open until now): ${periodStart.toISOString()} - ${now.toISOString()}`);
        } else {
          console.log(`⏳ Open period not long enough: ${periodStart.toISOString()} - ${now.toISOString()} => ${(durationMs/(24*3600*1000)).toFixed(2)} days (required ${days} days)`);
        }
      }

      console.log(`💸 Deposits: ${inCount}, Withdrawals: ${outCount}, Final balance: ${formatEther(currentBalance)} ETH`);
      if (periods.length === 0) {
        console.log(`❌ No continuous periods found meeting ${days} days for this threshold`);
      }
      console.log(`📈 Total periods found for this threshold: ${periods.length}`);
      console.log(''); // spacing after threshold block

      return {
        threshold: {
          amount: formatEther(thresholdAmount),
          duration: days,
        },
        periods,
      };
    });

    // Summary table (English)
    console.log('\n📋 Summary for ${account}:');
    console.table(results.map(r => ({
      'Threshold (ETH)': `${r.threshold.amount}`,
      'Duration (days)': `${r.threshold.duration}`,
      'Periods': r.periods.length,
    })));

    return transactions;
  }
}
