import { expect, describe, it, beforeEach } from "vitest";
import { StrengthLogToStrongConverter } from "./strengthLogToStrong";
import {
  csvTestDataWorkoutsShort,
  csvMetaData,
  csvTestDataWorkoutSingle,
  getWorkoutHeaderRow,
  getExerciseRow,
  dividerRow,
} from "../testData/strengthLog";

describe("prep", () => {
  it("removes meta data", () => {
    const converter = new StrengthLogToStrongConverter([
      ...csvMetaData,
      ...csvTestDataWorkoutSingle,
    ]);

    expect(converter.getPreparedRawData()).toEqual([csvTestDataWorkoutSingle]);
  });

  it("handles multiple workouts", () => {
    const converter = new StrengthLogToStrongConverter([
      ...csvMetaData,
      ...csvTestDataWorkoutsShort,
    ]);

    expect(converter.getPreparedRawData()).toEqual([
      [
        ["Phark GSLP: Week 2 Workout 3", "2023-11-11", "0", "6", "5", "5", "5"],
        [
          "Exercise, Squat",
          "Set",
          "1",
          "rpe",
          "7",
          "reps",
          "5",
          "weight",
          "68",
        ],
        [
          "Exercise, Squat",
          "Set",
          "2",
          "rpe",
          "8",
          "reps",
          "5",
          "weight",
          "68",
        ],
        [
          "Exercise, Squat",
          "Set",
          "3",
          "rpe",
          "8.5",
          "reps",
          "7",
          "weight",
          "68",
        ],
        [
          "Exercise, Overhead Press",
          "Set",
          "1",
          "rpe",
          "9.5",
          "reps",
          "5",
          "weight",
          "36",
        ],
        [
          "Exercise, Overhead Press",
          "Set",
          "2",
          "rpe",
          "9",
          "reps",
          "5",
          "weight",
          "36",
        ],
        [
          "Exercise, Overhead Press",
          "Set",
          "3",
          "rpe",
          "9.5",
          "reps",
          "5",
          "weight",
          "36",
        ],
        [
          "Exercise, Lat Pulldown",
          "Set",
          "1",
          "rpe",
          "7.5",
          "reps",
          "5",
          "weight",
          "56",
        ],
        [
          "Exercise, Lat Pulldown",
          "Set",
          "2",
          "rpe",
          "8.5",
          "reps",
          "5",
          "weight",
          "56",
        ],
        [
          "Exercise, Lat Pulldown",
          "Set",
          "3",
          "rpe",
          "9.5",
          "reps",
          "8",
          "weight",
          "56",
        ],
        [
          "Exercise, Pause Bench Press",
          "Set",
          "1",
          "reps",
          "8",
          "weight",
          "40",
        ],
        [
          "Exercise, Pause Bench Press",
          "Set",
          "2",
          "reps",
          "8",
          "weight",
          "40",
        ],
        [
          "Exercise, Pause Bench Press",
          "Set",
          "3",
          "reps",
          "8",
          "weight",
          "40",
        ],
        [
          "Exercise, Standing Cable Chest Fly",
          "Set",
          "1",
          "reps",
          "12",
          "weight",
          "9",
        ],
        [
          "Exercise, Standing Cable Chest Fly",
          "Set",
          "2",
          "reps",
          "12",
          "weight",
          "9",
        ],
        [
          "Exercise, Standing Cable Chest Fly",
          "Set",
          "3",
          "reps",
          "12",
          "weight",
          "9",
        ],
        [
          "Exercise, Standing Cable Chest Fly",
          "Set",
          "4",
          "reps",
          "12",
          "weight",
          "9",
        ],
      ],
      [
        ["Phark GSLP: Week 2 Workout 2", "2023-11-09", "0", "5", "5", "3", "6"],
        [
          "Exercise, Trap Bar Deadlift With Low Handles",
          "Set",
          "1",
          "rpe",
          "8.5",
          "reps",
          "8",
          "weight",
          "115",
        ],
        [
          "Exercise, Bench Press",
          "Set",
          "1",
          "rpe",
          "9",
          "reps",
          "5",
          "weight",
          "54",
        ],
        [
          "Exercise, Bench Press",
          "Set",
          "2",
          "rpe",
          "9",
          "reps",
          "5",
          "weight",
          "54",
        ],
        [
          "Exercise, Bench Press",
          "Set",
          "3",
          "rpe",
          "10",
          "reps",
          "5",
          "weight",
          "54",
        ],
        [
          "Exercise, Barbell Row",
          "Set",
          "1",
          "rpe",
          "8",
          "reps",
          "5",
          "weight",
          "59",
        ],
        [
          "Exercise, Barbell Row",
          "Set",
          "2",
          "rpe",
          "8.5",
          "reps",
          "5",
          "weight",
          "59",
        ],
        [
          "Exercise, Barbell Row",
          "Set",
          "3",
          "rpe",
          "10",
          "reps",
          "8",
          "weight",
          "59",
        ],
        [
          "Exercise, Single Leg Romanian Deadlift",
          "Set",
          "1",
          "rpe",
          "8",
          "reps",
          "9",
          "weight",
          "40",
        ],
        [
          "Exercise, Single Leg Romanian Deadlift",
          "Set",
          "2",
          "rpe",
          "8",
          "reps",
          "9",
          "weight",
          "40",
        ],
      ],
    ]);
  });
});

describe("conversion", () => {
  let converter;
  let convertedData;
  let exercise;

  beforeEach(() => {
    exercise = {
      title: "Foo",
      set: "1",
      reps: "5",
      rpe: "7",
      weight: "68",
    };

    converter = new StrengthLogToStrongConverter([
      ...csvMetaData,
      getWorkoutHeaderRow("Workout one", "2023-11-11"),
      getExerciseRow(...Object.values(exercise)),
      getExerciseRow(), // no rpe, values as above
      dividerRow,
      getWorkoutHeaderRow("Workout two", "2023-12-12"),
      getExerciseRow(...Object.values(exercise)),
      getExerciseRow(...Object.values(exercise)),
      getExerciseRow(...Object.values(exercise)),
    ]);

    convertedData = converter.convert();
  });

  it("outputs a header row that conforms to Strong csv output", () => {
    expect(convertedData[0]).toEqual([
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
    ]);
  });

  it("outputs a row for each exercise, discount: the the header", () => {
    expect(convertedData.length - 1).toEqual(5);
  });

  it("populates each row with the transformed date and workout name taken from the workout header", () => {
    // disregard first row as it's the main header
    expect(convertedData[1][0]).toEqual("2023-11-11 12:00:00");
    expect(convertedData[1][1]).toEqual("Workout one");

    expect(convertedData[2][0]).toEqual("2023-11-11 12:00:00");
    expect(convertedData[2][1]).toEqual("Workout one");

    expect(convertedData[3][0]).toEqual("2023-12-12 12:00:00");
    expect(convertedData[3][1]).toEqual("Workout two");

    expect(convertedData[4][0]).toEqual("2023-12-12 12:00:00");
    expect(convertedData[4][1]).toEqual("Workout two");

    expect(convertedData[5][0]).toEqual("2023-12-12 12:00:00");
    expect(convertedData[5][1]).toEqual("Workout two");
  });

  it("populates the exercise row with the data in the order of a Strong csv output", () => {
    expect(convertedData[1]).toEqual([
      "2023-11-11 12:00:00",
      "Workout one",
      "",
      exercise.title,
      exercise.set,
      exercise.weight,
      exercise.reps,
      "",
      "",
      "",
      "",
      exercise.rpe,
    ]);
  });

  it("handles exercise rows without rpe", () => {
    expect(convertedData[2]).toEqual([
      "2023-11-11 12:00:00",
      "Workout one",
      "",
      exercise.title,
      exercise.set,
      exercise.weight,
      exercise.reps,
      "",
      "",
      "",
      "",
      "",
    ]);
  });

  it("throws if the first row for a workout block is not a header", () => {
    converter = new StrengthLogToStrongConverter([
      ...csvMetaData,
      getWorkoutHeaderRow("Workout one", "2023-11-11"),
      getExerciseRow(...Object.values(exercise)),
      getExerciseRow(), // no rpe, values as above
      dividerRow,
      getExerciseRow(...Object.values(exercise)),
      getExerciseRow(...Object.values(exercise)),
      getExerciseRow(...Object.values(exercise)),
    ]);

    expect(() => converter.convert()).toThrowError(
      "One or more workout blocks do not contain a header"
    );
  });

  it.each([
    {
      records: [
        ...csvMetaData,
        getWorkoutHeaderRow("Workout one", "2023-11-11"),
        ["some workout notes"],
      ],
      context: "workout notes",
    },
    {
      records: [
        ...csvMetaData,
        getWorkoutHeaderRow("Workout one", "2023-11-11"),
        getExerciseRow(null), // title missing
      ],
      context: "exercises with no valid title",
    },
    {
      records: [
        ...csvMetaData,
        getWorkoutHeaderRow("Workout one", "2023-11-11"),
        getExerciseRow("title", null), // set missing
      ],
      context: "exercises with no valid set number",
    },
    {
      records: [
        ...csvMetaData,
        getWorkoutHeaderRow("Workout one", "2023-11-11"),
        getExerciseRow("title", "set number", null), // reps missing
      ],
      context: "exercises with no valid reps",
    },
    {
      records: [
        ...csvMetaData,
        getWorkoutHeaderRow("Workout one", "2023-11-11"),
        getExerciseRow("title", "set number", "reps", null, null), // weight missing
      ],
      context: "exercises with no valid weight",
    },
  ])("ignores rows that are $context", ({ records }) => {
    converter = new StrengthLogToStrongConverter(records);

    expect(converter.convert()).toEqual([]);
  });

  describe("Exercise name conversion", () => {
    it("strips out the 'Exercise, ' prefix if present", () => {
      converter = new StrengthLogToStrongConverter([
        ...csvMetaData,
        getWorkoutHeaderRow(),
        getExerciseRow("Exercise, Foo"),
      ]);

      const [, , , firstExerciseName] = converter.convert()[1];

      expect(firstExerciseName).toEqual("Foo");
    });

    it.each([
      { input: "Squat", output: "Squat (Barbell)" },
      { input: "Overhead Press", output: "Overhead Press (Barbell)" },
      { input: "Lat Pulldown", output: "Lat Pulldown (Cable)" },
      { input: "Standing Cable Chest Fly", output: "Cable Fly" },
      { input: "Bench Press", output: "Bench Press (Barbell)" },
      { input: "Pause Bench Press", output: "Paused Bench Press" },
      { input: "Barbell Row", output: "Bent Over Row (Barbell)" },
      { input: "Front Squat", output: "Front Squat (Barbell)" },
      { input: "Close-Grip Pulldown", output: "Lat Pulldown (Cable)" },
      { input: "Cable Lateral Raise", output: "Lateral Raise (Cable)" },
      { input: "Kneeling Ab Wheel", output: "Ab Wheel" },
      { input: "Dumbbell Curl", output: "Bicep Curl (Dumbbell)" },
      { input: "Kneeling Push-Up", output: "Push Up (Knees)" },
      { input: "Leg Extension", output: "Leg Extension (Machine)" },
      { input: "Dumbbell Lunge", output: "Lunge (Dumbbell)" },
      {
        input: "Dumbbell Lying Triceps Extension",
        output: "Lying Dumbbell Tricep Extension",
      },
      {
        input: "Lying Dumbbell External Shoulder Rotation",
        output: "Lying Dumbbell External Rotation",
      },
      {
        input: "Lat Pulldown With Supinated Grip",
        output: "Lat Pulldown (Cable)",
      },
      { input: "Face Pull", output: "Face Pull (Cable)" },
      {
        input: "Trap Bar Deadlift With Low Handles",
        output: "Trap Bar Deadlift",
      },
    ])("converts $input to $output", ({ input, output }) => {
      converter = new StrengthLogToStrongConverter([
        ...csvMetaData,
        getWorkoutHeaderRow(),
        getExerciseRow(input),
      ]);

      const [, , , firstExerciseName] = converter.convert()[1];

      expect(firstExerciseName).toEqual(output);
    });
  });
});
