import { describe, expect, it } from "vitest";

import stretchRoutines from "@/data/stretch-routines.json";
import {
  formatRoutineDurationMeta,
  getDailyRoutine,
  getPostWorkoutRoutine,
  getPostWorkoutRoutineForCategories,
  getPostWorkoutRoutineId,
  hasLoggedRoutineOnDate,
  getRoutineById,
  getRoutineTotalSeconds,
} from "@/lib/services/stretch-resolver";

const EXPECTED_ROUTINE_IDS = [
  "daily",
  "post-piernas",
  "post-torso",
  "post-cardio",
  "post-cuerpo-completo",
] as const;

const POST_ROUTINE_IDS = [
  "post-piernas",
  "post-torso",
  "post-cardio",
  "post-cuerpo-completo",
] as const;

describe("lib/services/stretch-resolver", () => {
  it("maps each concrete category to a post-workout routine id", () => {
    expect(getPostWorkoutRoutineId("piernas")).toBe("post-piernas");
    expect(getPostWorkoutRoutineId("torso")).toBe("post-torso");
    expect(getPostWorkoutRoutineId("cardio")).toBe("post-cardio");
    expect(getPostWorkoutRoutineId("cuerpo-completo")).toBe(
      "post-cuerpo-completo",
    );
  });

  it("resolves multi-select categories to one post-workout routine", () => {
    expect(getPostWorkoutRoutineForCategories([])).toBeUndefined();
    expect(getPostWorkoutRoutineForCategories(["piernas"])?.id).toBe(
      "post-piernas",
    );
    expect(
      getPostWorkoutRoutineForCategories(["piernas", "torso"])?.id,
    ).toBe("post-cuerpo-completo");
  });

  it("returns routine metadata for card display", () => {
    const routine = getPostWorkoutRoutine("piernas");

    expect(routine).toEqual({
      id: "post-piernas",
      title: "Estiramiento post-piernas",
      durationMinutes: 4,
      meta: "isquios, cuádriceps, glúteos, gemelos",
    });
    expect(formatRoutineDurationMeta(routine!)).toBe(
      "~4 min · isquios, cuádriceps, glúteos, gemelos",
    );
  });

  it("exposes exactly five routines by id via the resolver", () => {
    expect(stretchRoutines.routines).toHaveLength(5);
    const ids = stretchRoutines.routines.map((routine) => routine.id);
    expect(new Set(ids).size).toBe(5);

    for (const id of EXPECTED_ROUTINE_IDS) {
      const routine = getRoutineById(id);
      expect(routine, `missing routine ${id}`).toBeDefined();
      expect(routine!.id).toBe(id);
    }
  });

  it("keeps post-workout routines typed as post-workout", () => {
    for (const id of POST_ROUTINE_IDS) {
      expect(getRoutineById(id)?.type).toBe("post-workout");
    }
  });

  it("returns full daily routine with exercises via getDailyRoutine and getRoutineById", () => {
    const byHelper = getDailyRoutine();
    const byId = getRoutineById("daily");

    expect(byHelper).toBeDefined();
    expect(byId).toEqual(byHelper);
    expect(byHelper!.type).toBe("daily");
    expect(byHelper!.exercises.length).toBeGreaterThan(0);
  });

  it("formats daily routine meta for Home card and keeps routineId daily", () => {
    const daily = getDailyRoutine();
    expect(daily).toBeDefined();
    expect(daily!.id).toBe("daily");
    expect(formatRoutineDurationMeta(daily!)).toBe(
      `~${daily!.durationMinutes} min · ${daily!.meta}`,
    );
  });

  it("keeps daily exercise count and total duration within FR-7 bounds", () => {
    const daily = getDailyRoutine();
    expect(daily).toBeDefined();

    const count = daily!.exercises.length;
    expect(count).toBeGreaterThanOrEqual(4);
    expect(count).toBeLessThanOrEqual(8);

    const totalSeconds = getRoutineTotalSeconds(daily!);
    expect(totalSeconds).toBeGreaterThanOrEqual(180);
    expect(totalSeconds).toBeLessThanOrEqual(420);
  });

  it("keeps each post-workout routine at or under five minutes", () => {
    for (const id of POST_ROUTINE_IDS) {
      const routine = getRoutineById(id);
      expect(routine, `missing ${id}`).toBeDefined();
      expect(getRoutineTotalSeconds(routine!)).toBeLessThanOrEqual(300);
    }
  });

  it("requires complete Spanish exercise fields on every routine", () => {
    for (const id of EXPECTED_ROUTINE_IDS) {
      const routine = getRoutineById(id);
      expect(routine).toBeDefined();
      expect(routine!.title.trim().length).toBeGreaterThan(0);
      expect(routine!.meta.trim().length).toBeGreaterThan(0);
      expect(["daily", "post-workout"]).toContain(routine!.type);
      expect(routine!.exercises.length).toBeGreaterThan(0);

      const exerciseIds = new Set<string>();
      for (const exercise of routine!.exercises) {
        expect(exercise.id.trim().length).toBeGreaterThan(0);
        expect(exerciseIds.has(exercise.id)).toBe(false);
        exerciseIds.add(exercise.id);

        expect(exercise.name.trim().length).toBeGreaterThan(0);
        expect(exercise.durationSeconds).toBeGreaterThan(0);
        expect(exercise.instruction.trim().length).toBeGreaterThan(0);
        // Light Spanish-copy guard: accented vowels or common Spanish tokens
        expect(
          /[áéíóúñ¿¡]| de | la | el | hacia | sin | Respira/i.test(
            exercise.instruction,
          ),
        ).toBe(true);
      }
    }
  });

  it("detects a logged routine on a given date", () => {
    const sessions = [
      {
        date: "2026-07-25",
        routineType: "post-workout" as const,
        routineId: "post-piernas",
      },
    ];
    expect(
      hasLoggedRoutineOnDate(sessions, "2026-07-25", "post-piernas"),
    ).toBe(true);
    expect(
      hasLoggedRoutineOnDate(sessions, "2026-07-25", "post-torso"),
    ).toBe(false);
    expect(
      hasLoggedRoutineOnDate(sessions, "2026-07-24", "post-piernas"),
    ).toBe(false);
  });

  it("keeps durationMinutes coherent with exercise totals", () => {
    for (const id of EXPECTED_ROUTINE_IDS) {
      const routine = getRoutineById(id)!;
      const totalSeconds = getRoutineTotalSeconds(routine);
      const expectedMinutes = Math.round(totalSeconds / 60);
      expect(routine.durationMinutes).toBe(expectedMinutes);
    }
  });

  it("keeps post-workout routines distinct from daily exercise sets", () => {
    const daily = getDailyRoutine()!;
    const dailyIds = new Set(daily.exercises.map((exercise) => exercise.id));
    const dailyNameInstruction = new Set(
      daily.exercises.map(
        (exercise) => `${exercise.name}\0${exercise.instruction}`,
      ),
    );

    for (const id of POST_ROUTINE_IDS) {
      const post = getRoutineById(id)!;
      const overlap = post.exercises.filter((exercise) =>
        dailyIds.has(exercise.id),
      );
      expect(
        overlap,
        `${id} should not reuse daily exercise ids`,
      ).toHaveLength(0);

      const clonedCopy = post.exercises.filter((exercise) =>
        dailyNameInstruction.has(`${exercise.name}\0${exercise.instruction}`),
      );
      expect(
        clonedCopy,
        `${id} should not clone daily name+instruction`,
      ).toHaveLength(0);
    }
  });
});
