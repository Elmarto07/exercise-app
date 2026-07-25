"use client";

import { useEffect, useState } from "react";

import {
  WORKOUT_CATEGORY_OPTIONS,
  isConcreteCategory,
  toggleCategorySelection,
  type ConcreteWorkoutCategory,
} from "@/lib/domain/categories";
import type { WorkoutCategory } from "@/lib/domain/types";
import { copy } from "@/lib/copy/es";
import {
  omitTodayCategory,
  selectTodayCategories,
} from "@/lib/hooks/use-today";
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
  const [selected, setSelected] = useState<ConcreteWorkoutCategory[]>([]);

  useEffect(() => {
    if (!visible) {
      setSelected([]);
      return;
    }

    setSelected(
      isConcreteCategory(suggestedCategory) ? [suggestedCategory] : [],
    );
  }, [visible, suggestedCategory]);

  if (!visible) {
    return null;
  }

  const { home } = copy;

  const handleToggle = (category: ConcreteWorkoutCategory) => {
    setSelected((current) => toggleCategorySelection(current, category));
  };

  const handleConfirm = () => {
    if (selected.length === 0) {
      return;
    }

    selectTodayCategories(selected);
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
        role="group"
        aria-label={home.categoryPrompt}
        className="mt-2 flex flex-wrap gap-2"
      >
        {WORKOUT_CATEGORY_OPTIONS.map((category) => {
          const isSelected = selected.includes(category);

          return (
            <button
              key={category}
              type="button"
              aria-pressed={isSelected}
              onClick={() => handleToggle(category)}
              className={cn(
                "min-h-11 rounded-full border px-4 text-sm transition-colors",
                isSelected
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
      <button
        type="button"
        disabled={selected.length === 0}
        onClick={handleConfirm}
        className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground disabled:opacity-40"
      >
        {home.confirmCategories}
      </button>
    </div>
  );
}
