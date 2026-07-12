import stretchRoutines from "@/data/stretch-routines.json";
import type { ConcreteWorkoutCategory } from "@/lib/domain/categories";

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

type RoutineRecord = {
  id: string;
  type: string;
  title: string;
  durationMinutes: number;
  meta: string;
};

const routinesById = new Map<string, RoutineRecord>(
  stretchRoutines.routines.map((routine) => [routine.id, routine]),
);

export function getPostWorkoutRoutineId(
  category: ConcreteWorkoutCategory,
): string {
  return CATEGORY_TO_ROUTINE_ID[category];
}

export function getPostWorkoutRoutine(
  category: ConcreteWorkoutCategory,
): PostWorkoutRoutine | undefined {
  const routineId = getPostWorkoutRoutineId(category);
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

export function formatRoutineDurationMeta(routine: PostWorkoutRoutine): string {
  return `~${routine.durationMinutes} min · ${routine.meta}`;
}
