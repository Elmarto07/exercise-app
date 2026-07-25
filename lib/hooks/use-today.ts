"use client";

import {
  isConcreteCategory,
  normalizeCategories,
  primaryCategoryFromSelection,
  type ConcreteWorkoutCategory,
} from "@/lib/domain/categories";
import { todayLocalDate } from "@/lib/domain/dates";
import type { ExerciseLog, WorkoutCategory, WorkoutDay } from "@/lib/domain/types";
import { useExerciseLog } from "@/lib/hooks/use-exercise-log";
import { exerciseLogRepository } from "@/lib/storage/exercise-log-repository";

export function getTodayWorkoutDay(
  log: ExerciseLog,
  date: string,
): WorkoutDay | undefined {
  return log.workoutDays.find((day) => day.date === date);
}

export function isTodayMarked(log: ExerciseLog, date?: string): boolean {
  const targetDate = date ?? todayLocalDate();
  return getTodayWorkoutDay(log, targetDate) !== undefined;
}

export function markToday(): void {
  exerciseLogRepository.markWorkoutDay(todayLocalDate());
}

export function unmarkToday(): void {
  exerciseLogRepository.unmarkWorkoutDay(todayLocalDate());
}

export function selectTodayCategory(category: WorkoutCategory): void {
  const today = todayLocalDate();
  exerciseLogRepository.markWorkoutDay(today, category);

  if (isConcreteCategory(category)) {
    exerciseLogRepository.updatePrefs({ lastCategory: category });
  }
}

export function selectTodayCategories(
  categories: ConcreteWorkoutCategory[],
): void {
  const today = todayLocalDate();
  const normalized = normalizeCategories(categories);
  exerciseLogRepository.markWorkoutDay(
    today,
    primaryCategoryFromSelection(normalized),
    normalized,
  );

  const primary = primaryCategoryFromSelection(normalized);
  if (isConcreteCategory(primary)) {
    exerciseLogRepository.updatePrefs({ lastCategory: primary });
  }
}

export function omitTodayCategory(): void {
  exerciseLogRepository.markWorkoutDay(
    todayLocalDate(),
    "no-especificado",
    [],
  );
}

export function useToday() {
  const log = useExerciseLog();
  const todayDate = todayLocalDate();
  const todayWorkoutDay = getTodayWorkoutDay(log, todayDate);

  return {
    todayDate,
    isTodayMarked: todayWorkoutDay !== undefined,
    todayWorkoutDay,
    lastCategory: log.prefs.lastCategory,
    markToday,
    unmarkToday,
    selectTodayCategory,
    selectTodayCategories,
    omitTodayCategory,
  };
}
