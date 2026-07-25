"use client";

import Link from "next/link";

import type { ConcreteWorkoutCategory } from "@/lib/domain/categories";
import { copy } from "@/lib/copy/es";
import {
  formatRoutineDurationMeta,
  getPostWorkoutRoutineForCategories,
} from "@/lib/services/stretch-resolver";

type PostWorkoutCardProps = {
  categories: ConcreteWorkoutCategory[];
  onDismiss: () => void;
};

export function PostWorkoutCard({
  categories,
  onDismiss,
}: PostWorkoutCardProps) {
  const routine = getPostWorkoutRoutineForCategories(categories);

  if (!routine) {
    return null;
  }

  const { home } = copy;

  return (
    <section className="mt-4 rounded-xl border border-border bg-white p-4">
      <h2 className="text-base font-semibold">{routine.title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatRoutineDurationMeta(routine)}
      </p>
      <div className="mt-3 flex items-center gap-2">
        <Link
          href={`/stretch/${routine.id}`}
          className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-border bg-white text-base font-medium"
        >
          {home.stretchNow}
        </Link>
        <button
          type="button"
          onClick={onDismiss}
          className="min-h-12 px-3 text-sm text-muted-foreground"
        >
          {home.dismissPostWorkout}
        </button>
      </div>
    </section>
  );
}
