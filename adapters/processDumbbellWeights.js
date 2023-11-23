import { trainingLogTypes } from "./trainingLogTypes.js";

export function processDumbbellWeights(records = [], from, to) {
  // NB: assumes for now that records will formatted in Strong format

  function getWeight(from, to, weight, exerciseName) {
    const dumbbellExercises = {
      upper: ["Dumbbell Curl", "Hammer Curl (Dumbbell)"],
      lower: [
        "Single Leg Romanian Deadlift",
        "Bulgarian Split Squat",
        "Dumbbell Lunge",
      ],
    };

    if (
      from === trainingLogTypes.STRENGTH_LOG &&
      to === trainingLogTypes.STRENGTH_LEVEL
    ) {
      return dumbbellExercises.lower.includes(exerciseName)
        ? weight / 2
        : weight;
    }

    if (
      from === trainingLogTypes.STRONG &&
      to === trainingLogTypes.STRENGTH_LEVEL
    ) {
      return dumbbellExercises.lower.includes(exerciseName) ||
        dumbbellExercises.upper.includes(exerciseName)
        ? weight / 2
        : weight;
    }

    return weight;
  }

  return records.map((row, index) => {
    if (index === 0) {
      return row;
    }

    const [
      date,
      workoutName,
      duration,
      exerciseName,
      setOrder,
      weight,
      ...rest
    ] = row;

    return [
      date,
      workoutName,
      duration,
      exerciseName,
      setOrder,
      getWeight(from, to, weight, exerciseName),
      ...rest,
    ];
  });
}
