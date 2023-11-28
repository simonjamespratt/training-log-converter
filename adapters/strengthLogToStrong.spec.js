import { expect, describe, it, beforeEach } from "vitest";
import { StrengthLogToStrongConverter } from "./strengthLogToStrong";
import {
  csvMetaData,
  getWorkoutHeaderRow,
  getExerciseRow,
  dividerRow,
} from "../testData/strengthLog";

describe("prep", () => {
  it("removes meta data and collects workouts into separate arrays", () => {
    const converter = new StrengthLogToStrongConverter([
      ...csvMetaData,
      getWorkoutHeaderRow(),
      getExerciseRow(),
      getExerciseRow(),
      dividerRow,
      getWorkoutHeaderRow(),
      getExerciseRow(),
      getExerciseRow(),
      getExerciseRow(),
    ]);

    expect(converter.getPreparedRawData()).toEqual([
      [getWorkoutHeaderRow(), getExerciseRow(), getExerciseRow()],
      [
        getWorkoutHeaderRow(),
        getExerciseRow(),
        getExerciseRow(),
        getExerciseRow(),
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

  it.each([
    { name: "duration", value: "1m", rowIndex: 2 },
    { name: "distance", value: 0, rowIndex: 7 },
    { name: "seconds", value: 0, rowIndex: 8 },
  ])(
    "gives each exercise row a valid default for $name",
    ({ name, value, rowIndex }) => {
      // disregard first row as it's the main header
      expect(convertedData[1][rowIndex]).toEqual(value);
      expect(convertedData[2][rowIndex]).toEqual(value);
      expect(convertedData[3][rowIndex]).toEqual(value);
      expect(convertedData[4][rowIndex]).toEqual(value);
      expect(convertedData[5][rowIndex]).toEqual(value);
    }
  );

  it("populates the exercise row with the data in the order of a Strong csv output", () => {
    expect(convertedData[1]).toEqual([
      "2023-11-11 12:00:00",
      "Workout one",
      "1m",
      exercise.title,
      exercise.set,
      exercise.weight,
      exercise.reps,
      0,
      0,
      "",
      "",
      exercise.rpe,
    ]);
  });

  it("handles exercise rows without rpe", () => {
    expect(convertedData[2]).toEqual([
      "2023-11-11 12:00:00",
      "Workout one",
      "1m",
      "Exercise row",
      exercise.set,
      exercise.weight,
      exercise.reps,
      0,
      0,
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
      {
        input: "Dumbbell Chest Press",
        output: "Dumbbell Bench Press",
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
