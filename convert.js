// command: node convert.js -filepath=some/path.csv
import minimist from "minimist";
import { promises as fs, writeFileSync } from "fs";
import { parse } from "csv-parse/sync";
import { stringify } from "csv-stringify/sync";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { format } from "date-fns";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const { filepath = null } = minimist(process.argv.slice(2));

if (!filepath) {
  throw new Error("No filepath provided!");
}

const content = await fs.readFile(filepath);
const records = parse(content, { bom: true, relax_column_count: true });

// TODO: trim the strings
// TODO: allow option to specify a date to go back as far as (i.e. filter out entries after that date)
// TODO: add help for the function

const [
  date,
  workoutName,
  duration,
  exerciseName,
  setOrder,
  weight,
  reps,
  distance,
  seconds,
  notes,
  workoutNotes,
  rpe,
] = records[1];

const workoutsIndex = records.findIndex(
  (record) =>
    Array.isArray(record) && record.length === 1 && record[0] === "Workouts"
);

const workoutsRaw = records.slice(workoutsIndex + 2); // strip meta data out
// console.log(workoutsRaw);

const workoutDividerIndices = workoutsRaw
  .map((row, index) => (row.length === 1 && row[0] === "" ? index : undefined))
  .filter((row) => row);

// console.log(workoutDividerIndices);

const workouts = workoutDividerIndices.map((dividerIndex, index, arr) => {
  // TODO: we're not handling the last entry in csv as it's not got a divider
  // if (i + 1 === arr.length) {}

  return workoutsRaw.slice(index > 0 ? arr[index - 1] + 1 : 0, dividerIndex);
});

console.log(workouts);

// TODO: check if rpe is present in a row
// TODO: check a row has sufficient info (min exercise name, set number, reps, weight. rpe optional)
// TODO: ignore rows that don't fit a profile of either workoutHeader or exerciseEntry

// console.log({
//   date,
//   workoutName,
//   duration,
//   exerciseName,
//   setOrder,
//   weight,
//   reps,
//   distance,
//   seconds,
//   notes,
//   workoutNotes,
//   rpe,
// });

// const writeFileName = `${format(
//   new Date(),
//   "yyyy-MM-dd"
// )}-strengthlog-to-strong-format.csv`;
// try {
//   writeFileSync(
//     `${__dirname}/converted-files/${writeFileName}`,
//     stringify(records)
//   );
//   console.log(`file named ${writeFileName} created in ${__dirname}`);
// } catch (err) {
//   console.error(err);
// }
