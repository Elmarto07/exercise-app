import Link from "next/link";

import { copy } from "@/lib/copy/es";
import {
  formatRoutineDurationMeta,
  getDailyRoutine,
} from "@/lib/services/stretch-resolver";

export function DailyStretchCard() {
  const routine = getDailyRoutine();

  if (!routine) {
    return null;
  }

  const { home } = copy;

  return (
    <section className="rounded-xl border border-border bg-white p-4">
      <h2 className="text-base font-semibold">{home.dailyStretchTitle}</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        {formatRoutineDurationMeta(routine)}
      </p>
      <Link
        href={`/stretch/${routine.id}`}
        className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl border border-border bg-white text-base font-medium"
      >
        {home.stretchNow}
      </Link>
    </section>
  );
}
