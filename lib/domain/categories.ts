import type {
  ConcreteWorkoutCategoryValue,
  WorkoutCategory,
  WorkoutDay,
} from "@/lib/domain/types";

const CONCRETE_CATEGORIES = new Set<WorkoutCategory>([
  "piernas",
  "torso",
  "cardio",
  "cuerpo-completo",
]);

export const WORKOUT_CATEGORY_OPTIONS = [
  "piernas",
  "torso",
  "cardio",
  "cuerpo-completo",
] as const satisfies readonly ConcreteWorkoutCategoryValue[];

export type ConcreteWorkoutCategory = (typeof WORKOUT_CATEGORY_OPTIONS)[number];

/** True when category qualifies for post-workout suggestion (AD-5). */
export function isConcreteCategory(
  category: WorkoutCategory,
): category is ConcreteWorkoutCategory {
  return CONCRETE_CATEGORIES.has(category);
}

const ZONE_ORDER: ConcreteWorkoutCategory[] = [
  "piernas",
  "torso",
  "cardio",
  "cuerpo-completo",
];

/** Normalize selection: dedupe, stable order, cuerpo-completo XOR zones. */
export function normalizeCategories(
  categories: readonly ConcreteWorkoutCategory[],
): ConcreteWorkoutCategory[] {
  const unique = new Set(categories.filter(isConcreteCategory));

  if (unique.has("cuerpo-completo") && unique.size > 1) {
    return ["cuerpo-completo"];
  }

  return ZONE_ORDER.filter((category) => unique.has(category));
}

/** Toggle a chip with XOR rules for cuerpo-completo. */
export function toggleCategorySelection(
  current: readonly ConcreteWorkoutCategory[],
  tapped: ConcreteWorkoutCategory,
): ConcreteWorkoutCategory[] {
  const set = new Set(normalizeCategories(current));

  if (tapped === "cuerpo-completo") {
    return set.has("cuerpo-completo") ? [] : ["cuerpo-completo"];
  }

  set.delete("cuerpo-completo");
  if (set.has(tapped)) {
    set.delete(tapped);
  } else {
    set.add(tapped);
  }

  return normalizeCategories([...set]);
}

/** Effective concrete categories from a WorkoutDay (legacy-safe). */
export function getEffectiveCategories(
  day: WorkoutDay | undefined,
): ConcreteWorkoutCategory[] {
  if (!day) {
    return [];
  }

  if (day.categories && day.categories.length > 0) {
    return normalizeCategories(day.categories);
  }

  if (isConcreteCategory(day.category)) {
    return [day.category];
  }

  return [];
}

export function categoriesSelectionKey(
  categories: readonly ConcreteWorkoutCategory[],
): string {
  return normalizeCategories(categories).join("|");
}

export function primaryCategoryFromSelection(
  categories: readonly ConcreteWorkoutCategory[],
): WorkoutCategory {
  const normalized = normalizeCategories(categories);
  return normalized[0] ?? "no-especificado";
}
