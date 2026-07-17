"use client";

import {
  WORKOUT_CATEGORY_OPTIONS,
  isConcreteCategory,
  type ConcreteWorkoutCategory,
} from "@/lib/domain/categories";
import type { WorkoutCategory } from "@/lib/domain/types";
import { copy } from "@/lib/copy/es";
import { omitTodayCategory, selectTodayCategory } from "@/lib/hooks/use-today";
import { cn } from "@/lib/utils";

type WorkoutCategorySelectorProps = {
  visible: boolean;
  suggestedCategory: WorkoutCategory;
  onDismiss: () => void;
};

function getCategoryLabel(category: ConcreteWorkoutCategory): string {
  return copy.home.categories[category];
}

export function WorkoutCategorySelector({
  visible,
  suggestedCategory,
  onDismiss,
}: WorkoutCategorySelectorProps) {
  if (!visible) {
    return null;
  }

  const { home } = copy;
  const suggested = isConcreteCategory(suggestedCategory)
    ? suggestedCategory
    : null;

  const handleSelect = (category: ConcreteWorkoutCategory) => {
    selectTodayCategory(category);
    onDismiss();
  };

  const handleOmit = () => {
    omitTodayCategory();
    onDismiss();
  };

  return (
    <div className="mt-2">
      <p className="text-[13px] text-muted-foreground">{home.categoryPrompt}</p>
      <div
        role="radiogroup"
        aria-label={home.categoryPrompt}
        className="mt-2 flex flex-wrap gap-2"
      >
        {WORKOUT_CATEGORY_OPTIONS.map((category) => {
          const isSuggested = suggested === category;

          return (
            <button
              key={category}
              type="button"
              role="radio"
              aria-checked={false}
              onClick={() => handleSelect(category)}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm transition-colors",
                isSuggested
                  ? "border-primary bg-[#DCFCE7] font-medium text-[#16A34A]"
                  : "border-border bg-white text-foreground",
              )}
            >
              {getCategoryLabel(category)}
            </button>
          );
        })}
        <button
          type="button"
          onClick={handleOmit}
          className="min-h-11 rounded-full border border-dashed border-border px-4 text-sm text-muted-foreground"
        >
          {home.omitCategory}
        </button>
      </div>
    </div>
  );
}
