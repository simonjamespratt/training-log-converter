import { strengthLevelUnknownExercises } from "./exerciseLookUp.js";

export function prepStrongForStrengthLevel(records = []) {
  // remove all exercises that Strength Level does not understand
  return records.filter((row, index) => {
    // always include first row as it is the header
    if (index === 0) {
      return true;
    }

    const exerciseName = row[3];

    return !strengthLevelUnknownExercises.includes(exerciseName);
  });
}
