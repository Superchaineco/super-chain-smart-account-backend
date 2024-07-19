import { ETHERSCAN_API_KEY, JSON_RPC_PROVIDER } from "../config/superChain/constants";
import axios from "axios";

type Txn = {
    gas: string,
    gasPrice: string,
    timestamp: string
}

/**
 * Function to get all the transactions of a user, based on a specific timestamp
 * @param {number} startTime - Timestamp in seconds
 * @param {string} account - User address
 * @returns {Promise<Array>} - List of all transactions
 */
export async function getTransactions(startTime: number, account: string): Promise<{
    gas: number,
    gasPrice: number
}> {
    const startBlock = await getBlockNumberFromTimestamp(startTime);

    try {
        const response = await axios.get(`https://api-sepolia.etherscan.io/api`, {
            params: {
                module: 'account',
                action: 'txlist',
                address: account,
                startblock: startBlock,
                endblock: 'latest',
                sort: 'asc',
                apikey: ETHERSCAN_API_KEY
            },
            timeout: 50000

        });

        const transactions = response.data.result as Txn[];
        const filteredTransactions = transactions.filter((tx: any) => parseInt(tx.timeStamp) >= startTime);

        return filteredTransactions.reduce((acc, transaction) => ({
            gas: acc.gas + parseInt(transaction.gas),
            gasPrice: acc.gasPrice + parseInt(transaction.gasPrice)
        }), {
            gas: 0,
            gasPrice: 0
        });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return {
            gas: 0,
            gasPrice: 0
        };
    }
}

/**
 * Function to validate the sponsorship of a specific user
 * @param {string} account - User address
 * @returns {Promise<boolean>} - List of all transactions
 */
export async function isAbleToSponsor(account: string): Promise<boolean> {
    const startTime = getLastMondayTimestampCET();
    const transactions = await getTransactions(startTime, account)
    console.debug({ transactions })
    return true

}


/**
 * Function to obtain the timestamp of the last Monday at 00:01 CET
 * @returns {number} - Timestamp in seconds
 */
function getLastMondayTimestampCET(): number {
    const now = new Date();
    const day = now.getUTCDay();
    const diff = now.getUTCDate() - day + (day === 0 ? -6 : 1);
    const lastMonday = new Date(now.setUTCDate(diff));
    lastMonday.setUTCHours(23, 1, 0, 0); // 00:01 CET is 23:01 UTC of the previous day
    return Math.floor(lastMonday.getTime() / 1000);
}

/**
 * Function to get the nearest block to the timestamp
 * @param {number} timestamp - Timestamp in seconds 
 * @returns {Promise<number>} - Block number
 */
async function getBlockNumberFromTimestamp(timestamp: number): Promise<number> {
    try {
        console.debug(timestamp)
        const response = await axios.get(`https://api-sepolia.etherscan.io/api`, {
            params: {
                module: 'block',
                action: 'getblocknobytime',
                timestamp: 1652459409,
                closest: 'before',
                apikey: ETHERSCAN_API_KEY
            },
            timeout: 50000
        });

        return parseInt(response.data.result);
    } catch (error) {
        console.error('Error fetching block number:', error);
        return 0;
    }
}

