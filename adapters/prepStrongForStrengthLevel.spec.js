import { expect, describe, it } from "vitest";
import { prepStrongForStrengthLevel } from "./prepStrongForStrengthLevel";
import { strengthLevelUnknownExercises } from "./exerciseLookUp";

describe("removing Strong exercises that are unknown to Strength Level", () => {
  it.each(strengthLevelUnknownExercises)(
    "removes the exercise %s",
    (exercise) => {
      const header = ["Date", "Workout Name", "Duration", "Exercise Name"];
      const exerciseRow = ["2021-11-22 12:30:00", "Workout", "40m", exercise];

      expect(prepStrongForStrengthLevel([header, exerciseRow])).toEqual([
        header,
      ]);
    }
  );
});
