const lookUp = [
  { strengthLog: "Squat", strong: "Squat (Barbell)" },
  { strengthLog: "Overhead Press", strong: "Overhead Press (Barbell)" },
  { strengthLog: "Lat Pulldown", strong: "Lat Pulldown (Cable)" },
  { strengthLog: "Standing Cable Chest Fly", strong: "Cable Fly" }, // this one is actually what strength level calls it
  { strengthLog: "Bench Press", strong: "Bench Press (Barbell)" },
  { strengthLog: "Pause Bench Press", strong: "Paused Bench Press" }, // this one is actually what strength level calls it
  { strengthLog: "Front Squat", strong: "Front Squat (Barbell)" },
  { strengthLog: "Face Pull", strong: "Face Pull (Cable)" },
  { strengthLog: "Close-Grip Pulldown", strong: "Lat Pulldown (Cable)" },
  { strengthLog: "Cable Lateral Raise", strong: "Lateral Raise (Cable)" },
  { strengthLog: "Kneeling Ab Wheel", strong: "Ab Wheel" },
  { strengthLog: "Dumbbell Curl", strong: "Bicep Curl (Dumbbell)" },
  { strengthLog: "Kneeling Push-Up", strong: "Push Up (Knees)" },
  { strengthLog: "Leg Extension", strong: "Leg Extension (Machine)" },
  { strengthLog: "Dumbbell Lunge", strong: "Lunge (Dumbbell)" },
  {
    strengthLog: "Dumbbell Lying Triceps Extension",
    strong: "Lying Dumbbell Tricep Extension",
  },
  {
    strengthLog: "Lying Dumbbell External Shoulder Rotation",
    strong: "Lying Dumbbell External Rotation",
  },
  {
    strengthLog: "Lat Pulldown With Supinated Grip",
    strong: "Lat Pulldown (Cable)",
  },
  {
    strengthLog: "Trap Bar Deadlift With Low Handles",
    strong: "Trap Bar Deadlift",
  },
  { strengthLog: "Barbell Row", strong: "Bent Over Row (Barbell)" },
];

export function convertExerciseName(name, from, to) {
  const record = lookUp.find((record) => name === record[from]);

  if (record) {
    return record[to];
  }

  return null;
}

export const strengthLevelUnknownExercises = [
  "Ring Row",
  "Pull Up (Band)",
  "Pull Up Negative",
  "Triceps Dip (Assisted)",
  "Pull Up (Assisted)",
];
