import stretchRoutines from "@/data/stretch-routines.json";
import type { ConcreteWorkoutCategory } from "@/lib/domain/categories";
import type {
  StretchRoutine,
  StretchRoutineType,
  StretchSession,
} from "@/lib/domain/types";

export type PostWorkoutRoutine = {
  id: string;
  title: string;
  durationMinutes: number;
  meta: string;
};

const CATEGORY_TO_ROUTINE_ID: Record<ConcreteWorkoutCategory, string> = {
  piernas: "post-piernas",
  torso: "post-torso",
  cardio: "post-cardio",
  "cuerpo-completo": "post-cuerpo-completo",
};

type RoutineRecord = StretchRoutine;

const routinesById = new Map<string, RoutineRecord>(
  stretchRoutines.routines.map((routine) => [
    routine.id,
    {
      id: routine.id,
      type: routine.type as StretchRoutineType,
      title: routine.title,
      durationMinutes: routine.durationMinutes,
      meta: routine.meta,
      exercises: routine.exercises,
    },
  ]),
);

export function getPostWorkoutRoutineId(
  category: ConcreteWorkoutCategory,
): string {
  return CATEGORY_TO_ROUTINE_ID[category];
}

export function getPostWorkoutRoutine(
  category: ConcreteWorkoutCategory,
): PostWorkoutRoutine | undefined {
  return getPostWorkoutRoutineForCategories([category]);
}

/** Resolve one post-workout card from a multi-select set (Story 2.5). */
export function getPostWorkoutRoutineForCategories(
  categories: readonly ConcreteWorkoutCategory[],
): PostWorkoutRoutine | undefined {
  if (categories.length === 0) {
    return undefined;
  }

  let routineId: string;
  if (categories.length === 1) {
    routineId = getPostWorkoutRoutineId(categories[0]!);
  } else if (
    categories.includes("cuerpo-completo") ||
    categories.length >= 2
  ) {
    routineId = "post-cuerpo-completo";
  } else {
    routineId = getPostWorkoutRoutineId(categories[0]!);
  }

  const routine = routinesById.get(routineId);
  if (!routine) {
    return undefined;
  }

  return {
    id: routine.id,
    title: routine.title,
    durationMinutes: routine.durationMinutes,
    meta: routine.meta,
  };
}

export function getRoutineById(
  routineId: string,
): StretchRoutine | undefined {
  return routinesById.get(routineId);
}

export function getDailyRoutine(): StretchRoutine | undefined {
  return getRoutineById("daily");
}

export function getRoutineTotalSeconds(routine: StretchRoutine): number {
  return routine.exercises.reduce(
    (total, exercise) => total + exercise.durationSeconds,
    0,
  );
}

export function formatRoutineDurationMeta(routine: {
  durationMinutes: number;
  meta: string;
}): string {
  return `~${routine.durationMinutes} min · ${routine.meta}`;
}

/** True when a stretch session for this routineId exists on the given date. */
export function hasLoggedRoutineOnDate(
  sessions: readonly StretchSession[],
  date: string,
  routineId: string,
): boolean {
  return sessions.some(
    (session) => session.date === date && session.routineId === routineId,
  );
}
