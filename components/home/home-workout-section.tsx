"use client";

import { useState } from "react";

import { PostWorkoutCard } from "@/components/home/post-workout-card";
import { WorkoutCategorySelector } from "@/components/home/workout-category-selector";
import { WorkoutMarkButton } from "@/components/home/workout-mark-button";
import { isConcreteCategory } from "@/lib/domain/categories";
import type { WorkoutCategory } from "@/lib/domain/types";
import { useToday } from "@/lib/hooks/use-today";

export function HomeWorkoutSection() {
  const [showCategorySelector, setShowCategorySelector] = useState(false);
  const [dismissedCategory, setDismissedCategory] =
    useState<WorkoutCategory | null>(null);
  const { isTodayMarked, todayWorkoutDay, lastCategory } = useToday();

  const category = todayWorkoutDay?.category;
  const categoryPending =
    isTodayMarked && todayWorkoutDay?.category === "no-especificado";

  const selectorVisible = showCategorySelector && categoryPending;

  const showPostWorkout =
    isTodayMarked &&
    category !== undefined &&
    isConcreteCategory(category) &&
    dismissedCategory !== category;

  return (
    <div>
      <WorkoutMarkButton
        onMarked={() => setShowCategorySelector(true)}
        onUnmarked={() => {
          setShowCategorySelector(false);
          setDismissedCategory(null);
        }}
      />
      <WorkoutCategorySelector
        visible={selectorVisible}
        suggestedCategory={lastCategory}
        onDismiss={() => setShowCategorySelector(false)}
      />
      {showPostWorkout ? (
        <PostWorkoutCard
          category={category}
          onDismiss={() => setDismissedCategory(category)}
        />
      ) : null}
    </div>
  );
}
