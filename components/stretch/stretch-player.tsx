"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { ExitStretchDialog } from "@/components/stretch/exit-stretch-dialog";
import { todayLocalDate } from "@/lib/domain/dates";
import {
  formatStretchCountdown,
  remainingFromEndsAt,
} from "@/lib/domain/stretch-timer";
import type { StretchRoutine } from "@/lib/domain/types";
import { copy } from "@/lib/copy/es";
import { exerciseLogRepository } from "@/lib/storage/exercise-log-repository";
import { cn } from "@/lib/utils";

type StretchPlayerProps = {
  routine: StretchRoutine;
};

export function StretchPlayer({ routine }: StretchPlayerProps) {
  const router = useRouter();
  const { stretch } = copy;
  const exercises = routine.exercises;
  const total = exercises.length;

  const [index, setIndex] = useState(0);
  const [remaining, setRemaining] = useState(exercises[0]?.durationSeconds ?? 0);
  const [paused, setPaused] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [exitOpen, setExitOpen] = useState(false);
  const loggedRef = useRef(false);
  const endsAtRef = useRef<number | null>(null);
  const tickGenerationRef = useRef(0);
  const allowingExitRef = useRef(false);

  const exercise = exercises[index];

  const bumpTickGeneration = () => {
    tickGenerationRef.current += 1;
    endsAtRef.current = null;
  };

  useEffect(() => {
    const frozen = !exercise || completed || paused || exitOpen;

    if (frozen) {
      if (endsAtRef.current != null) {
        const left = remainingFromEndsAt(endsAtRef.current);
        endsAtRef.current = null;
        setRemaining(left);
      }
      return;
    }

    if (endsAtRef.current == null) {
      endsAtRef.current = Date.now() + remaining * 1000;
    }

    const generation = tickGenerationRef.current;

    const tick = () => {
      if (tickGenerationRef.current !== generation) {
        return;
      }
      if (endsAtRef.current == null) {
        return;
      }
      setRemaining(remainingFromEndsAt(endsAtRef.current));
    };

    tick();
    const id = window.setInterval(tick, 250);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        tick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
    // `remaining` is read only when arming a new endsAt after unfreeze / exercise change.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- avoid re-arming every tick
  }, [exercise, index, paused, completed, exitOpen]);

  useEffect(() => {
    if (
      !exercise ||
      completed ||
      paused ||
      exitOpen ||
      remaining > 0 ||
      allowingExitRef.current
    ) {
      return;
    }

    bumpTickGeneration();

    if (index >= total - 1) {
      setCompleted(true);
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    setRemaining(exercises[nextIndex]!.durationSeconds);
  }, [
    remaining,
    completed,
    paused,
    exitOpen,
    exercise,
    index,
    total,
    exercises,
  ]);

  useEffect(() => {
    if (!completed || loggedRef.current || allowingExitRef.current) {
      return;
    }

    try {
      exerciseLogRepository.addStretchSession({
        date: todayLocalDate(),
        routineType: routine.type,
        routineId: routine.id,
      });
      loggedRef.current = true;
    } catch {
      // Keep loggedRef false so a remount/retry can persist the session.
    }
  }, [completed, routine.id, routine.type]);

  useEffect(() => {
    if (completed) {
      return;
    }

    window.history.pushState({ stretchPlayerGuard: true }, "");

    const onPopState = () => {
      if (allowingExitRef.current) {
        return;
      }
      window.history.pushState({ stretchPlayerGuard: true }, "");
      setExitOpen(true);
    };

    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, [completed]);

  const handleNext = () => {
    if (completed) {
      return;
    }

    bumpTickGeneration();

    if (index >= total - 1) {
      setCompleted(true);
      setRemaining(0);
      return;
    }

    const nextIndex = index + 1;
    setIndex(nextIndex);
    setRemaining(exercises[nextIndex]!.durationSeconds);
    setPaused(false);
  };

  const handleConfirmExit = () => {
    allowingExitRef.current = true;
    bumpTickGeneration();
    // Leave exitOpen true until unmount so remaining === 0 cannot auto-complete.
    router.replace("/");
  };

  if (completed) {
    return (
      <main className="flex min-h-dvh flex-col bg-white px-4 py-8">
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            {stretch.completedTitle}
          </h1>
          <Link
            href="/"
            className="mt-8 flex min-h-12 w-full max-w-sm items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground"
          >
            {stretch.backHome}
          </Link>
        </div>
      </main>
    );
  }

  if (!exercise) {
    return null;
  }

  return (
    <main className="flex min-h-dvh flex-col bg-white">
      <header className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          className="min-h-11 min-w-11 text-base text-muted-foreground"
          onClick={() => setExitOpen(true)}
        >
          {stretch.exit}
        </button>
        <span className="text-sm font-medium text-muted-foreground">
          {stretch.progressTemplate(index + 1, total)}
        </span>
        <span className="inline-block min-w-11" aria-hidden />
      </header>

      <div className="flex gap-1 px-4">
        {exercises.map((item, segmentIndex) => (
          <div
            key={item.id}
            className={cn(
              "h-1 flex-1 rounded-sm bg-border",
              segmentIndex < index && "bg-primary",
              segmentIndex === index && "bg-primary/50",
            )}
          />
        ))}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-4 py-8 text-center">
        <h1 className="text-xl font-semibold tracking-tight">{exercise.name}</h1>
        {paused ? (
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            {stretch.paused}
          </p>
        ) : null}
        <p
          className="mt-6 font-mono text-5xl font-semibold tracking-tight tabular-nums"
          aria-live="polite"
        >
          {formatStretchCountdown(remaining)}
        </p>
        <p className="mt-8 max-w-sm text-base leading-relaxed text-muted-foreground">
          {exercise.instruction}
        </p>
      </div>

      <div className="flex gap-3 px-4 pb-8 pt-4">
        <button
          type="button"
          className="flex min-h-12 flex-1 items-center justify-center rounded-xl border border-border bg-white text-base font-medium"
          onClick={() => setPaused((value) => !value)}
        >
          {paused ? stretch.resume : stretch.pause}
        </button>
        <button
          type="button"
          className="flex min-h-12 flex-1 items-center justify-center rounded-xl bg-primary text-base font-semibold text-primary-foreground"
          onClick={handleNext}
        >
          {stretch.next}
        </button>
      </div>

      <ExitStretchDialog
        open={exitOpen}
        onOpenChange={setExitOpen}
        onConfirm={handleConfirmExit}
      />
    </main>
  );
}
