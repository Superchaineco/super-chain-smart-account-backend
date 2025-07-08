import { BaseBadgeStrategy } from './badgeStrategy';
import fs from 'fs';
import csv from 'csv-parser';
import axios from 'axios';

type CsvRow = {
  Address: string;
  ENS: string;
};

const CitizenFilePath = 'src/data/citizen.csv';

export class CitizenCheckStrategy extends BaseBadgeStrategy {
  // private async loadCsvData(filePath: string): Promise<CsvRow[]> {
  //     return new Promise((resolve, reject) => {
  //         const results: CsvRow[] = [];
  //         fs.createReadStream(filePath)
  //             .pipe(csv())
  //             .on("data", (data: CsvRow) => results.push(data))
  //             .on("end", () => resolve(results));
  //     });
  // }

  async getValue(eoas: string[]): Promise<boolean> {
    const citizenApiUrl = 'https://optimism.easscan.org/graphql';

    const citizenQuery = `
    query AddressGivethDonations($addresses: [String!]!) {
      attestations(
        take: 10,
        where: {
          schemaId: {
            equals: "0xc35634c4ca8a54dce0a2af61a9a9a5a3067398cb3916b133238c4f6ba721bc8a"
          }
          recipient: {
            in: $addresses
          }
        }
      ) {
        schemaId
        recipient
        data
      }
    }`;

    const response = await axios.post(citizenApiUrl, {
      query: citizenQuery,
      variables: {
        addresses: eoas,
      },
    });

    if (response.data.data.attestations.length > 0) return true;

    return false;
  }
}
