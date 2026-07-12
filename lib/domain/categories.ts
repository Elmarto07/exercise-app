import type { WorkoutCategory } from "@/lib/domain/types";

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
] as const satisfies readonly WorkoutCategory[];

export type ConcreteWorkoutCategory = (typeof WORKOUT_CATEGORY_OPTIONS)[number];

/** True when category qualifies for post-workout suggestion (AD-5). */
export function isConcreteCategory(
  category: WorkoutCategory,
): category is ConcreteWorkoutCategory {
  return CONCRETE_CATEGORIES.has(category);
}
