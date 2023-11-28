export const csvMetaData = [
  ["Name", "Language", "Sex", "Age", "Email"],
  ["Geoff", "en", "Male", "1949-08-23", "geoff@capeland.com"],
  [""],
  ["Workouts"],
  ["Name", "Date", "Body weight", "Shape", "Sleep", "Calories", "Stress"],
];

export const dividerRow = [""];

export function getWorkoutHeaderRow(
  title = "Workout header row",
  date = "2023-11-11"
) {
  return [title, date, "0", "6", "5", "5", "5"];
}

export function getExerciseRow(
  title = "Exercise row",
  set = "1",
  reps = "5",
  rpe = null,
  weight = "68"
) {
  if (rpe) {
    return [title, "Set", set, "rpe", rpe, "reps", reps, "weight", weight];
  }

  return [title, "Set", set, "reps", reps, "weight", weight];
}
