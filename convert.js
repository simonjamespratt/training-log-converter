// command: node convert.js -filepath=some/path.csv
import minimist from "minimist";
import { promises as fs, writeFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { format } from "date-fns";
import { StrengthLogToStrongConverter } from "./adapters/strengthLogToStrong";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { filepath = null, jobType = null } = minimist(process.argv.slice(2));

if (!filepath) {
  throw new Error("No filepath provided!");
}

const content = await fs.readFile(filepath);
const records = parse(content, { bom: true, relax_column_count: true });

// TODO: allow option to specify a date to go back as far as (i.e. filter out entries after that date)
// TODO: add help for the function

let convertedRecords;

if (jobType === "prep-strength-log-data-for-strength-level-import") {
  const converter = new StrengthLogToStrongConverter(records);
  // TODO: add function to prep strong data for strength level import
  convertedRecords = converter.convert();
}

// TODO: add function to prep strong data for strength level import

const writeFileName = `${format(
  new Date(),
  "yyyy-MM-dd"
)}-strengthlog-to-strong-format.csv`;
try {
  writeFileSync(
    `${__dirname}/converted-files/${writeFileName}`,
    stringify(convertedRecords)
  );
  console.log(`file named ${writeFileName} created in ${__dirname}`);
} catch (err) {
  console.error(err);
}
