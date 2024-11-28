import { BaseBadgeStrategy } from "./badgeStrategy";
import fs from "fs";
import csv from "csv-parser";


type CsvRow = {
  Address: string;
};


const SuperCohort0FileData = "src/data/superCohort0.csv";

export class SuperCohort0Strategy extends BaseBadgeStrategy {


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
        const csvData = await this.loadCsvData(SuperCohort0FileData);

        for (const eoa of eoas) {
            const assistant = csvData.find((row) =>
                row.Address
                    ? row.Address.toLocaleLowerCase() === eoa.toLowerCase()
                    : false,
            );
            if (assistant) {
                return true;
            }
        }
        return false;
    }
}