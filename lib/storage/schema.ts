import type {
  ExerciseLog,
  HistoryView,
  StretchRoutineType,
  StretchSession,
  UserPrefs,
  WorkoutCategory,
  WorkoutDay,
} from "@/lib/domain/types";

export const STORAGE_KEY = "marcafit:log";
export const SCHEMA_VERSION = 1 as const;

const WORKOUT_CATEGORIES = new Set<WorkoutCategory>([
  "piernas",
  "torso",
  "cardio",
  "cuerpo-completo",
  "no-especificado",
]);

const STRETCH_ROUTINE_TYPES = new Set<StretchRoutineType>([
  "daily",
  "post-workout",
]);

const HISTORY_VIEWS = new Set<HistoryView>(["calendar", "list"]);

export const DEFAULT_PREFS: UserPrefs = {
  historyView: "calendar",
  lastCategory: "no-especificado",
  pwaInstallDismissed: false,
};

export function createEmptyLog(): ExerciseLog {
  return {
    v: SCHEMA_VERSION,
    workoutDays: [],
    stretchSessions: [],
    prefs: { ...DEFAULT_PREFS },
  };
}

function isWorkoutDay(value: unknown): value is WorkoutDay {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const day = value as Record<string, unknown>;
  return (
    typeof day.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(day.date) &&
    typeof day.category === "string" &&
    WORKOUT_CATEGORIES.has(day.category as WorkoutCategory)
  );
}

function isStretchSession(value: unknown): value is StretchSession {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const session = value as Record<string, unknown>;
  return (
    typeof session.date === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(session.date) &&
    typeof session.routineType === "string" &&
    STRETCH_ROUTINE_TYPES.has(session.routineType as StretchRoutineType) &&
    typeof session.routineId === "string" &&
    session.routineId.length > 0
  );
}

function parsePrefs(value: unknown): UserPrefs {
  if (typeof value !== "object" || value === null) {
    return { ...DEFAULT_PREFS };
  }

  const prefs = value as Record<string, unknown>;
  const historyView =
    typeof prefs.historyView === "string" &&
    HISTORY_VIEWS.has(prefs.historyView as HistoryView)
      ? (prefs.historyView as HistoryView)
      : DEFAULT_PREFS.historyView;

  const lastCategory =
    typeof prefs.lastCategory === "string" &&
    WORKOUT_CATEGORIES.has(prefs.lastCategory as WorkoutCategory)
      ? (prefs.lastCategory as WorkoutCategory)
      : DEFAULT_PREFS.lastCategory;

  const pwaInstallDismissed =
    typeof prefs.pwaInstallDismissed === "boolean"
      ? prefs.pwaInstallDismissed
      : DEFAULT_PREFS.pwaInstallDismissed;

  return { historyView, lastCategory, pwaInstallDismissed };
}

function sanitizeWorkoutDays(value: unknown): WorkoutDay[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isWorkoutDay);
}

function sanitizeStretchSessions(value: unknown): StretchSession[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isStretchSession);
}

export function parseLog(raw: string | null): ExerciseLog {
  if (!raw) {
    return createEmptyLog();
  }

  try {
    const parsed: unknown = JSON.parse(raw);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("v" in parsed) ||
      (parsed as { v: unknown }).v !== SCHEMA_VERSION
    ) {
      console.error("[ExerciseLogRepository] Invalid schema version, resetting log");
      return createEmptyLog();
    }

    const log = parsed as Partial<ExerciseLog>;

    return {
      v: SCHEMA_VERSION,
      workoutDays: sanitizeWorkoutDays(log.workoutDays),
      stretchSessions: sanitizeStretchSessions(log.stretchSessions),
      prefs: parsePrefs(log.prefs),
    };
  } catch {
    console.error("[ExerciseLogRepository] Failed to parse log, resetting");
    return createEmptyLog();
  }
}
