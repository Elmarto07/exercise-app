import { describe, expect, it } from "vitest";

import {
  WORKOUT_CATEGORY_OPTIONS,
  getEffectiveCategories,
  isConcreteCategory,
  normalizeCategories,
  toggleCategorySelection,
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

  it("normalizes multi-select with cuerpo-completo XOR", () => {
    expect(normalizeCategories(["torso", "piernas"])).toEqual([
      "piernas",
      "torso",
    ]);
    expect(normalizeCategories(["piernas", "cuerpo-completo"])).toEqual([
      "cuerpo-completo",
    ]);
  });

  it("toggles selection with XOR rules", () => {
    expect(toggleCategorySelection([], "piernas")).toEqual(["piernas"]);
    expect(toggleCategorySelection(["piernas"], "torso")).toEqual([
      "piernas",
      "torso",
    ]);
    expect(toggleCategorySelection(["piernas", "torso"], "cuerpo-completo")).toEqual([
      "cuerpo-completo",
    ]);
    expect(toggleCategorySelection(["cuerpo-completo"], "piernas")).toEqual([
      "piernas",
    ]);
  });

  it("reads effective categories from legacy and multi days", () => {
    expect(
      getEffectiveCategories({ date: "2026-07-19", category: "piernas" }),
    ).toEqual(["piernas"]);
    expect(
      getEffectiveCategories({
        date: "2026-07-19",
        category: "piernas",
        categories: ["torso", "piernas"],
      }),
    ).toEqual(["piernas", "torso"]);
    expect(
      getEffectiveCategories({
        date: "2026-07-19",
        category: "no-especificado",
      }),
    ).toEqual([]);
  });
});
