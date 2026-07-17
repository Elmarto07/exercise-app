import { describe, expect, it } from "vitest";

import {
  formatRoutineDurationMeta,
  getPostWorkoutRoutine,
  getPostWorkoutRoutineId,
} from "@/lib/services/stretch-resolver";

describe("lib/services/stretch-resolver", () => {
  it("maps each concrete category to a post-workout routine id", () => {
    expect(getPostWorkoutRoutineId("piernas")).toBe("post-piernas");
    expect(getPostWorkoutRoutineId("torso")).toBe("post-torso");
    expect(getPostWorkoutRoutineId("cardio")).toBe("post-cardio");
    expect(getPostWorkoutRoutineId("cuerpo-completo")).toBe(
      "post-cuerpo-completo",
    );
  });

  it("returns routine metadata for card display", () => {
    const routine = getPostWorkoutRoutine("piernas");

    expect(routine).toEqual({
      id: "post-piernas",
      title: "Estiramiento post-piernas",
      durationMinutes: 4,
      meta: "isquios, cuádriceps, glúteos",
    });
    expect(formatRoutineDurationMeta(routine!)).toBe(
      "~4 min · isquios, cuádriceps, glúteos",
    );
  });
});
