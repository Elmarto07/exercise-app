"use client";

import { useSyncExternalStore } from "react";

import { exerciseLogRepository } from "@/lib/storage/exercise-log-repository";
import { createEmptyLog } from "@/lib/storage/schema";
import type { ExerciseLog } from "@/lib/domain/types";

/** Stable reference — getServerSnapshot must not return a new object each call (React 19). */
const SERVER_SNAPSHOT: ExerciseLog = createEmptyLog();

function getClientSnapshot(): ExerciseLog {
  return exerciseLogRepository.getLog();
}

function getServerSnapshot(): ExerciseLog {
  return SERVER_SNAPSHOT;
}

export function useExerciseLog(): ExerciseLog {
  return useSyncExternalStore(
    exerciseLogRepository.subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
}
