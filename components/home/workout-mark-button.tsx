"use client";

import { useState } from "react";
import { Check } from "lucide-react";

import { UnmarkWorkoutDialog } from "@/components/home/unmark-workout-dialog";
import { copy } from "@/lib/copy/es";
import { useToday } from "@/lib/hooks/use-today";
import { cn } from "@/lib/utils";

type WorkoutMarkButtonProps = {
  onMarked?: () => void;
  onUnmarked?: () => void;
};

export function WorkoutMarkButton({
  onMarked,
  onUnmarked,
}: WorkoutMarkButtonProps = {}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { isTodayMarked, markToday, unmarkToday } = useToday();
  const { home } = copy;

  const handleClick = () => {
    if (isTodayMarked) {
      setDialogOpen(true);
      return;
    }

    markToday();
    onMarked?.();
  };

  const handleConfirmUnmark = () => {
    unmarkToday();
    onUnmarked?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        aria-label={isTodayMarked ? home.alreadyMarked : home.markToday}
        className={cn(
          "flex min-h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold transition-colors",
          isTodayMarked
            ? "border-2 border-primary bg-white text-[#16A34A]"
            : "bg-primary text-primary-foreground",
        )}
      >
        {isTodayMarked ? (
          <>
            <span
              aria-hidden
              className="flex size-[22px] items-center justify-center rounded-full bg-primary text-primary-foreground"
            >
              <Check className="size-3.5 stroke-[3]" />
            </span>
            {home.alreadyMarked}
          </>
        ) : (
          home.markToday
        )}
      </button>

      <UnmarkWorkoutDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onConfirm={handleConfirmUnmark}
      />
    </>
  );
}
