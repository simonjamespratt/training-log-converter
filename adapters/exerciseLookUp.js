const lookUp = [
  { strengthLog: "Squat", strong: "Squat (Barbell)" },
  { strengthLog: "Overhead Press", strong: "Overhead Press (Barbell)" },
];

export function convertExerciseName(name, from, to) {
  const record = lookUp.find((record) => name === record[from]);

  if (record) {
    return record[to];
  }

  return null;
}
