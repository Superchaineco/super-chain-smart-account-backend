import { Interface, Wallet } from "ethers";
import { ATTESTATOR_SIGNER_PRIVATE_KEY, EAS_CONTRACT_ADDRESS, ENV, ENVIRONMENTS, ETHERSCAN_API_KEY, JSON_RPC_PROVIDER } from "../config/superChain/constants";
import axios from "axios";

type Txn = {
    gas: string,
    gasUsed: string,
    gasPrice: string,
    timestamp: string,
    input: string,
    recipient: string,
}

/**
 * Function to get all the transactions of a user, based on a specific timestamp
 * @param {number} startTime - Timestamp in seconds
 * @param {string} account - User address
 * @returns {Promise<Array>} - List of all transactions
 */
export async function getTransactions(startTime: number, account: string): Promise<number> {
    const startBlock = await getBlockNumberFromTimestamp(startTime);

    try {
        // const response = await axios.get(`https://api-sepolia.etherscan.io/api`, {
        //     params: {
        //         module: 'account',
        //         action: 'txlist',
        //         address: account,
        //         startblock: startBlock,
        //         endblock: 'latest',
        //         sort: 'asc',
        //         apikey: ETHERSCAN_API_KEY
        //     },
        //     timeout: 50000

        // });



        // const transactions = response.data.result as Txn[];
        const transactions: Txn[] = [];

        const badgeTransactions = await getBadgeTransactions(startBlock, account);
      
        const badgeTransactionsGas = badgeTransactions.reduce((acc, transaction) => (
            acc + parseInt(transaction.gasUsed) * parseInt(transaction.gasPrice)
        ), 0);
        const transactionsGas = transactions.reduce((acc, transaction) => (
            acc + parseInt(transaction.gasUsed) * parseInt(transaction.gasPrice)

        ), 0);
        return badgeTransactionsGas + transactionsGas;
    } catch (error) {
        console.error('Error fetching transactions:', error);
        return 0
    }
}


/**
 * Function to get all the transactions of a user related the claim badges flow
 * @param {number} startBlock - Timestamp in seconds
 * @param {string} account - User address
 * @returns {Promise<Array>} - List of all transactions
 */
async function getBadgeTransactions(startBlock: number, account: string) {
    try {
        const wallet = new Wallet(ATTESTATOR_SIGNER_PRIVATE_KEY);

        const response = await axios.get(`https://api-${ENV === ENVIRONMENTS.development ? 'sepolia' : 'optimistic'}.etherscan.io/api`, {
            params: {
                module: 'account',
                action: 'txlist',
                address: wallet.address,
                startblock: startBlock,
                endblock: 'latest',
                sort: 'asc',
                apikey: ETHERSCAN_API_KEY
            },
            timeout: 50000

        });


        const transactions = response.data.result as Txn[];
        const abi = [
            "function attest((bytes32 schema, (address recipient, uint64 expirationTime, bool revocable, bytes32 refUID, bytes data, uint256 value) data) request)"
        ];

        const iface = new Interface(abi);

        const filteredTransactions = transactions.filter((tx: any) => tx.to.toLowerCase() === EAS_CONTRACT_ADDRESS.toLowerCase())
        const decodedTransactions = filteredTransactions.map(tx => {
            try {
                const decodedData = iface.decodeFunctionData("attest", tx.input);
                const recipient = decodedData[0].data.recipient.toLowerCase();
                return {
                    ...tx,
                    decodedData,
                    recipient
                };
            } catch (error) {
                console.error('Error decoding transaction:', error);
                return null;
            }
        }).filter(tx => tx !== null) as Txn[];

        if (decodedTransactions.length > 0) {
            const transactionsForAccount = decodedTransactions.filter(tx => tx.recipient.toLowerCase() === account.toLowerCase());
            return transactionsForAccount;
        }
        else {
            return []
        }

    } catch (e) {
        console.error(e)
        return []
    }
}

/**
 * Function to validate the sponsorship of a specific user
 * @param {string} account - User address
 * @returns {Promise<boolean>} - List of all transactions
 */
export async function isAbleToSponsor(account: string, level: number): Promise<boolean> {
    const startTime = getLastMondayTimestampCET();
    const transactions = await getTransactions(startTime, account)
    const isValid = await validateMaxSponsorship(transactions, level);
    return isValid

}

export function getMaxGasInUSD(level: number): number {
    switch (level) {
        case 0:
            return 0.20;
        case 1:
            return 0.30;
        case 2:
            return 0.40;
        default:
            return 0.20 + (level * 0.10);
    }
}


async function validateMaxSponsorship(currentTransactionsGas: number, level: number): Promise<boolean> {
    const ethPriceInUSD = await getETHPriceInUSD();
    const gasUsedInUSD = currentTransactionsGas * ethPriceInUSD / 1e18;
    console.log('gasUsedInUSD:', gasUsedInUSD);
    const maxGasInUSD = getMaxGasInUSD(level);

    return gasUsedInUSD <= maxGasInUSD;

}

async function getETHPriceInUSD(): Promise<number> {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
            ids: 'ethereum',
            vs_currencies: 'usd'
        }
    });

    return response.data.ethereum.usd;
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
        const response = await axios.get(`https://api-${ENV === ENVIRONMENTS.development ? 'sepolia' : 'optimistic'}.etherscan.io/api`, {
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

