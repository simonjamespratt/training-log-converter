import { expect, describe, it, beforeEach } from "vitest";
import { processDumbbellWeights } from "./processDumbbellWeights";
import { trainingLogTypes } from "./trainingLogTypes";

const strongHeader = [
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
];

function getExerciseRow(exerciseName = "", weight = 0) {
  return [
    "2021-11-22 12:30:00",
    "",
    "40m",
    exerciseName,
    1,
    weight,
    8,
    0,
    0,
    "",
    "",
  ];
}

describe("when converting from Strength Log to Strength Level", () => {
  describe("when the exercise uses dumbbells", () => {
    describe("and when the exercise is for upper body", () => {
      it("does not change the weight", () => {
        const weight = 40;

        const records = [strongHeader, getExerciseRow("Dumbbell Curl", weight)];

        const processedRecords = processDumbbellWeights(
          records,
          trainingLogTypes.STRENGTH_LOG,
          trainingLogTypes.STRENGTH_LEVEL
        );
        const processedWeight = processedRecords[1][5];

        expect(processedWeight).toEqual(weight);
      });
    });

    describe.each([
      "Single Leg Romanian Deadlift",
      "Bulgarian Split Squat",
      "Dumbbell Lunge",
    ])("and when the exercise is for lower body: %s", (exerciseName) => {
      let records;
      let processedRecords;
      let weight;

      beforeEach(() => {
        weight = 40;

        records = [strongHeader, getExerciseRow(exerciseName, weight)];

        processedRecords = processDumbbellWeights(
          records,
          trainingLogTypes.STRENGTH_LOG,
          trainingLogTypes.STRENGTH_LEVEL
        );
      });

      it("halves the weight", () => {
        const processedWeight = processedRecords[1][5];

        expect(processedWeight).toEqual(weight / 2);
      });

      it("all other data remains the same", () => {
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
          "RPE";

        processedRecords[1].forEach((element, index) => {
          if (index !== 5) {
            expect(element).toEqual(records[1][index]);
          }
        });
      });
    });
  });

  describe("when the exercise does not use dumbbells", () => {
    it("does not change the weight", () => {
      const weight = 40;

      const records = [strongHeader, getExerciseRow("Front Squat", weight)];

      const processedRecords = processDumbbellWeights(
        records,
        trainingLogTypes.STRENGTH_LOG,
        trainingLogTypes.STRENGTH_LEVEL
      );
      const processedWeight = processedRecords[1][5];

      expect(processedWeight).toEqual(weight);
    });
  });
});

describe("when converting from Strong to Strength Level", () => {
  describe("when the exercise uses dumbbells", () => {
    describe.each(["Dumbbell Curl", "Hammer Curl (Dumbbell)"])(
      "and when the exercise is for upper body: %s",
      (exerciseName) => {
        let records;
        let processedRecords;
        let weight;

        beforeEach(() => {
          weight = 40;

          records = [strongHeader, getExerciseRow(exerciseName, weight)];

          processedRecords = processDumbbellWeights(
            records,
            trainingLogTypes.STRONG,
            trainingLogTypes.STRENGTH_LEVEL
          );
        });

        it("halves the weight", () => {
          const processedWeight = processedRecords[1][5];

          expect(processedWeight).toEqual(weight / 2);
        });

        it("all other data remains the same", () => {
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
            "RPE";

          processedRecords[1].forEach((element, index) => {
            if (index !== 5) {
              expect(element).toEqual(records[1][index]);
            }
          });
        });
      }
    );

    describe.each([
      "Single Leg Romanian Deadlift",
      "Bulgarian Split Squat",
      "Dumbbell Lunge",
    ])("and when the exercise is for lower body: %s", (exerciseName) => {
      let records;
      let processedRecords;
      let weight;

      beforeEach(() => {
        weight = 40;

        records = [strongHeader, getExerciseRow(exerciseName, weight)];

        processedRecords = processDumbbellWeights(
          records,
          trainingLogTypes.STRONG,
          trainingLogTypes.STRENGTH_LEVEL
        );
      });

      it("halves the weight", () => {
        const processedWeight = processedRecords[1][5];

        expect(processedWeight).toEqual(weight / 2);
      });

      it("all other data remains the same", () => {
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
          "RPE";

        processedRecords[1].forEach((element, index) => {
          if (index !== 5) {
            expect(element).toEqual(records[1][index]);
          }
        });
      });
    });
  });

  describe("when the exercise does not use dumbbells", () => {
    it("does not change the weight", () => {
      const weight = 40;

      const records = [strongHeader, getExerciseRow("Front Squat", weight)];

      const processedRecords = processDumbbellWeights(
        records,
        trainingLogTypes.STRONG,
        trainingLogTypes.STRENGTH_LEVEL
      );
      const processedWeight = processedRecords[1][5];

      expect(processedWeight).toEqual(weight);
    });
  });
});
