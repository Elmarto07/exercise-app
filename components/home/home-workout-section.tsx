"use client";

import { useState } from "react";

import { PostWorkoutCard } from "@/components/home/post-workout-card";
import { WorkoutCategorySelector } from "@/components/home/workout-category-selector";
import { WorkoutMarkButton } from "@/components/home/workout-mark-button";
import {
  categoriesSelectionKey,
  getEffectiveCategories,
} from "@/lib/domain/categories";
import { useExerciseLog } from "@/lib/hooks/use-exercise-log";
import { useToday } from "@/lib/hooks/use-today";
import {
  getPostWorkoutRoutineForCategories,
  hasLoggedRoutineOnDate,
} from "@/lib/services/stretch-resolver";

export function HomeWorkoutSection() {
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);
  const { isTodayMarked, todayWorkoutDay, lastCategory, todayDate } =
    useToday();
  const log = useExerciseLog();

  const effectiveCategories = getEffectiveCategories(todayWorkoutDay);
  const selectionKey = categoriesSelectionKey(effectiveCategories);
  const categoryPending =
    isTodayMarked &&
    (todayWorkoutDay?.category === "no-especificado" ||
      effectiveCategories.length === 0);

  const selectorVisible = showCategorySelector && categoryPending;

  const postWorkoutRoutine =
    getPostWorkoutRoutineForCategories(effectiveCategories);
  const postWorkoutAlreadyDone = postWorkoutRoutine
    ? hasLoggedRoutineOnDate(
        log.stretchSessions,
        todayDate,
        postWorkoutRoutine.id,
      )
    : false;

  const showPostWorkout =
    isTodayMarked &&
    effectiveCategories.length > 0 &&
    dismissedKey !== selectionKey &&
    !postWorkoutAlreadyDone;

  return (
    <div>
      <WorkoutMarkButton
        onMarked={() => setShowCategorySelector(true)}
        onUnmarked={() => {
          setShowCategorySelector(false);
          setDismissedKey(null);
        }}
      />
      <WorkoutCategorySelector
        visible={selectorVisible}
        suggestedCategory={lastCategory}
        onDismiss={() => setShowCategorySelector(false)}
      />
      {showPostWorkout ? (
        <PostWorkoutCard
          categories={effectiveCategories}
          onDismiss={() => setDismissedKey(selectionKey)}
        />
      ) : null}
    </div>
  );
}
