import { describe, expect, it } from "vitest";

import {
  WORKOUT_CATEGORY_OPTIONS,
  isConcreteCategory,
} from "@/lib/domain/categories";

describe("lib/domain/categories", () => {
  it("exports concrete category options in display order", () => {
    expect(WORKOUT_CATEGORY_OPTIONS).toEqual([
      "piernas",
      "torso",
      "cardio",
      "cuerpo-completo",
    ]);
  });

  it("identifies concrete workout categories", () => {
    expect(isConcreteCategory("piernas")).toBe(true);
    expect(isConcreteCategory("torso")).toBe(true);
    expect(isConcreteCategory("cardio")).toBe(true);
    expect(isConcreteCategory("cuerpo-completo")).toBe(true);
  });

  it("rejects no-especificado", () => {
    expect(isConcreteCategory("no-especificado")).toBe(false);
  });
});
