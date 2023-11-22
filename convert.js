// TODO: work out how each app handles dumbell weights: single or double

import { Argument, program } from "commander";
import { promises as fs, writeFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { format } from "date-fns";
import { StrengthLogToStrongConverter } from "./adapters/strengthLogToStrong.js";
import { filterByDate } from "./adapters/filterByDate.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function writeFile(records, from, to) {
  const writeFileName = `${format(
    new Date(),
    "yyyy-MM-dd"
  )}-${from}-to-${to}-format.csv`;

  try {
    writeFileSync(
      `${__dirname}/converted-files/${writeFileName}`,
      stringify(records)
    );
    console.log(`file named ${writeFileName} created in ${__dirname}`);
  } catch (err) {
    console.error(err);
  }
}

const trainingLogTypes = {
  STRENGTH_LEVEL: "strength-level",
  STRENGTH_LOG: "strength-log",
  STRONG: "strong",
};

program
  .description("Convert a csv file from one training log to another")
  .argument("<file>", "file to convert")
  .addArgument(
    new Argument("<from>", "type of training log the csv file is from").choices(
      Object.values(trainingLogTypes)
    )
  )
  .addArgument(
    new Argument(
      "<to>",
      "type of training log the csv file should be converted to"
    ).choices(Object.values(trainingLogTypes))
  )
  .option(
    "-d, --date <date>",
    "specify a cut off date to return only records on or after that date. Must be in yyyy-MM-dd format"
  )
  .action(async (file, from, to, options) => {
    const content = await fs.readFile(file);
    const records = parse(content, { bom: true, relax_column_count: true });

    if (
      from === trainingLogTypes.STRENGTH_LOG &&
      to === trainingLogTypes.STRENGTH_LEVEL
    ) {
      const converter = new StrengthLogToStrongConverter(records);
      // TODO: strip out exercises strength level won't understand - see below
      let records = converter.convert();

      if (options.date) {
        records = filterByDate(records, options.date);
      }

      writeFile(records, from, to);
    }

    // TODO: add function to prep strong data for strength level import
    // filter by date if passed

    // strip out exercises that strength level misinterpets
    // e.g. negative pull ups or assisted pull ups
    // Eccentric pull-up
  });

await program.parseAsync(process.argv);
