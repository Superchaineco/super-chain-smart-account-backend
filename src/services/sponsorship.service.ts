import { Interface, Wallet } from "ethers";
import {
  ATTESTATOR_SIGNER_PRIVATE_KEY,
  COINGECKO_API_KEY,
  EAS_CONTRACT_ADDRESS,
  ENV,
  ENVIRONMENTS,
  ETHERSCAN_API_KEY,
  GELATO_API_KEY,
  JSON_RPC_PROVIDER,
} from "../config/superChain/constants";
import axios from "axios";
import { GelatoRelay, SponsoredCallRequest } from "@gelatonetwork/relay-sdk";
import { redisService } from "./redis.service";
import sponsorshipValues from "../data/sponsorship.values.json";

type Txn = {
  gas: string;
  gasUsed: string;
  gasPrice: string;
  timestamp: string;
  input: string;
  recipient: string;
};

async function getBlockNumberFromTimestamp(timestamp: number): Promise<number> {
  try {
    const response = await axios.get(
      `https://api-${ENV === ENVIRONMENTS.development ? "sepolia" : "optimistic"}.etherscan.io/api`,
      {
        params: {
          module: "block",
          action: "getblocknobytime",
          timestamp: 1652459409,
          closest: "before",
          apikey: ETHERSCAN_API_KEY,
        },
        timeout: 50000,
      },
    );

    return parseInt(response.data.result);
  } catch (error) {
    console.error("Error fetching block number:", error);
    return 0;
  }
}

export async function getTransactionsCount(
  startTime: number,
  account: string,
): Promise<number> {
  const startBlock = await getBlockNumberFromTimestamp(startTime);

  try {
    const badgeTransactions = await getBadgeTransactions(startBlock, account);
    const relayCount = await getRelayCount(account);
    return badgeTransactions.length + relayCount;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return 0;
  }
}

async function getBadgeTransactions(startBlock: number, account: string) {
  try {
    const wallet = new Wallet(ATTESTATOR_SIGNER_PRIVATE_KEY);
    const response = await axios.get(
      `https://api-${ENV === ENVIRONMENTS.development ? "sepolia" : "optimistic"}.etherscan.io/api`,
      {
        params: {
          module: "account",
          action: "txlist",
          address: wallet.address,
          startblock: startBlock,
          endblock: "latest",
          sort: "asc",
          apikey: ETHERSCAN_API_KEY,
        },
        timeout: 50000,
      },
    );

    const transactions = response.data.result as Txn[];
    const abi = [
      "function attest((bytes32 schema, (address recipient, uint64 expirationTime, bool revocable, bytes32 refUID, bytes data, uint256 value) data) request)",
    ];

    const iface = new Interface(abi);

    const filteredTransactions = transactions.filter(
      (tx: any) => tx.to.toLowerCase() === EAS_CONTRACT_ADDRESS.toLowerCase(),
    );
    const decodedTransactions = filteredTransactions
      .map((tx) => {
        try {
          const decodedData = iface.decodeFunctionData("attest", tx.input);
          const recipient = decodedData[0].data.recipient.toLowerCase();
          return {
            ...tx,
            decodedData,
            recipient,
          };
        } catch (error) {
          console.error("Error decoding transaction:", error);
          return null;
        }
      })
      .filter((tx) => tx !== null) as Txn[];

    if (decodedTransactions.length > 0) {
      const transactionsForAccount = decodedTransactions.filter(
        (tx) => tx.recipient.toLowerCase() === account.toLowerCase(),
      );
      return transactionsForAccount;
    } else {
      return [];
    }
  } catch (e) {
    console.error(e);
    return [];
  }
}

export async function isAbleToSponsor(
  account: string,
  level: number,
): Promise<boolean> {
  const startTime = getLastMondayTimestampUTC();
  const transactions = await getTransactionsCount(startTime, account);
  const isValid = await validateMaxSponsorship(transactions, level);
  return isValid;
}

async function validateMaxSponsorship(
  transactions: number,
  level: number,
): Promise<boolean> {
  const maxTransactions = sponsorshipValues.levels[level - 1].raffleTickets;
  return transactions < maxTransactions;
}

export async function getCurrentSponsorhipValue(
  account: string,
  level: number,
) {
  const maxRelayedTransactions = sponsorshipValues.levels[level - 1].raffleTickets;
  const relayedTransactions = await getTransactionsCount(
    getLastMondayTimestampUTC(),
    account,
  );
  return { relayedTransactions, maxRelayedTransactions };
}


export async function relayTransaction(
  target: string,
  data: string,
  account: string,
  level: number,
) {
  const isSponsorAble = await isAbleToSponsor(account, level);
  if (!isSponsorAble) {
    throw new Error("User is not able to sponsor");
  }
  try {
    const relay = new GelatoRelay();
    const request: SponsoredCallRequest = {
      chainId: BigInt(10),
      target,
      data,
    };
    const relayResponse = await relay.sponsoredCall(request, GELATO_API_KEY);
    const taskId = relayResponse.taskId;
    // If the update fails, it will not affect the transaction
    await updateRelayCount(account).catch((error) => {
      console.error("Error updating relay count:", error);
    });
    return taskId;
  } catch (error) {
    console.error("Error relaying transaction:", error);
    throw error;
  }
}

async function updateRelayCount(account: string) {
  const key = `relayCount:${account}`;
  const relayCount = await getRelayCount(account);

  if (relayCount < 5) {
    const nextMondayTimestamp = getNextMondayTimestampUTC();
    const currentTime = Math.floor(Date.now() / 1000);
    const timeUntilNextMonday = nextMondayTimestamp - currentTime;
    await redisService.setCachedData(key, relayCount + 1, timeUntilNextMonday);
  } else {
    throw new Error("User has reached the weekly limit of relayed transactions.");
  }
}

async function getRelayCount(account: string) {
  const key = `relayCount:${account}`;
  const value = await redisService.getCachedData(key);
  return value ? parseInt(value) : 0;
}

function getNextMondayTimestampUTC(): number {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = 8 - day; 
  const nextMonday = new Date(now.getTime() + diff * 24 * 60 * 60 * 1000);
  nextMonday.setUTCHours(0, 1, 0, 0); 
  return Math.floor(nextMonday.getTime() / 1000);
}

function getLastMondayTimestampUTC(): number {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  const lastMonday = new Date(now.getTime() + diff * 24 * 60 * 60 * 1000);
  lastMonday.setUTCHours(0, 1, 0, 0); 
  return Math.floor(lastMonday.getTime() / 1000);
}
