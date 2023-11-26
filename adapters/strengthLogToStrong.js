import { isValid, parse, set, format } from "date-fns";
import { convertExerciseName } from "./exerciseLookUp.js";

export class StrengthLogToStrongConverter {
  constructor(records) {
    this.records = records;
  }

  getPreparedRawData() {
    const workoutsIndex = this.records.findIndex(
      (record) =>
        Array.isArray(record) && record.length === 1 && record[0] === "Workouts"
    );

    const workoutsRaw = this.records.slice(workoutsIndex + 2); // strip meta data out

    return workoutsRaw.reduce(
      (acc, row) => {
        if (row.length === 1 && row[0] === "") {
          acc.workouts.push([]);

          acc.currentWorkoutIndex++;
        } else {
          acc.workouts[acc.currentWorkoutIndex].push(row);
        }

        return acc;
      },
      { workouts: [[]], currentWorkoutIndex: 0 }
    ).workouts;
  }

  convert() {
    const partitionedWorkouts = this.getPreparedRawData();

    const convertedWorkoutRows = partitionedWorkouts
      .map((workout) => {
        let headerData = [];

        return workout
          .map((row, index) => {
            if (index === 0) {
              if (!this.#rowIsWorkoutHeader(row)) {
                throw new Error(
                  "One or more workout blocks do not contain a header"
                );
              }

              const [workoutName, date] = row;

              const transformedDate = set(new Date(date), {
                hours: 12,
              });

              headerData = [
                format(transformedDate, "yyyy-MM-dd H:mm:ss"),
                workoutName,
              ];

              return undefined; // we don't actually want a row for this - will be filtered out below
            }

            try {
              const convertedExerciseRow = this.#getConvertedExerciseRow(row);
              return [...headerData, ...convertedExerciseRow];
            } catch (error) {
              return undefined;
            }
          })
          .filter((row) => row);
      })
      .flat();

    if (convertedWorkoutRows.length > 0) {
      return [
        [
          "Date",
          "Workout Name",
          "Duration",
          "Exercise Name",
          "Set Order",
          "Weight",
          "Reps",
          "Distance",
          "Seconds",
          "Notes",
          "Workout Notes",
          "RPE",
        ],
        ...convertedWorkoutRows,
      ];
    }

    return [];
  }

  // Private methods
  #rowIsWorkoutHeader(row) {
    // the only reliable identifier here is whether the 2nd entry in the row is a date
    return isValid(parse(row[1], "yyyy-MM-dd", new Date()));
  }

  #rowHasRpe(row) {
    return row.includes("rpe");
  }

  #convertExerciseName(name) {
    const trimmed = name.replace("Exercise, ", "");

    return convertExerciseName(trimmed, "strengthLog", "strong") || trimmed;
  }

  #getConvertedExerciseRow(row) {
    let exerciseName;
    let set;
    let rpe = "";
    let reps;
    let weight;

    if (this.#rowHasRpe(row)) {
      [exerciseName, , set, , rpe, , reps, , weight] = row;
    } else {
      [exerciseName, , set, , reps, , weight] = row;
    }

    if (!exerciseName || !set || !reps || !weight) {
      throw new Error("One or more exercise rows do not have sufficient data");
    }

    return [
      "1m",
      this.#convertExerciseName(exerciseName),
      set,
      weight,
      reps,
      0,
      0,
      "",
      "",
      rpe,
    ];
  }
}
