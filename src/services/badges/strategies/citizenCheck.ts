import { BaseBadgeStrategy } from "./badgeStrategy";
import fs from "fs";
import csv from "csv-parser";


type CsvRow = {
  Address: string;
  ENS: string;
};


const CitizenFilePath = "src/data/citizen.csv";

export class CitizenCheckStrategy extends BaseBadgeStrategy {


    private async loadCsvData(filePath: string): Promise<CsvRow[]> {
        return new Promise((resolve, reject) => {
            const results: CsvRow[] = [];
            fs.createReadStream(filePath)
                .pipe(csv())
                .on("data", (data: CsvRow) => results.push(data))
                .on("end", () => resolve(results));
        });
    }

    async getValue(eoas: string[]): Promise<boolean> {
        const csvData = await this.loadCsvData(CitizenFilePath);

        for (const eoa of eoas) {
            const citizen = csvData.find((row) =>
                row.Address
                    ? row.Address.toLocaleLowerCase() === eoa.toLowerCase()
                    : false,
            );
            if (citizen) {
                return true;
            }
        }
        return false;
    }
}