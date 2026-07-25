import {
  isConcreteCategory,
  normalizeCategories,
  primaryCategoryFromSelection,
  type ConcreteWorkoutCategory,
} from "@/lib/domain/categories";
import type {
  ExerciseLog,
  StretchSession,
  UserPrefs,
  WorkoutCategory,
  WorkoutDay,
} from "@/lib/domain/types";
import {
  createEmptyLog,
  parseLog,
  STORAGE_KEY,
} from "@/lib/storage/schema";

type Listener = () => void;

function cloneLog(log: ExerciseLog): ExerciseLog {
  return {
    v: log.v,
    workoutDays: log.workoutDays.map((day) => ({ ...day })),
    stretchSessions: log.stretchSessions.map((session) => ({ ...session })),
    prefs: { ...log.prefs },
  };
}

/** Deep-freeze so external readers cannot mutate the published snapshot. */
function freezeLog(log: ExerciseLog): ExerciseLog {
  Object.freeze(log);
  Object.freeze(log.workoutDays);
  Object.freeze(log.stretchSessions);
  Object.freeze(log.prefs);
  log.workoutDays.forEach((day) => Object.freeze(day));
  log.stretchSessions.forEach((session) => Object.freeze(session));
  return log;
}

class ExerciseLogRepository {
  /** Immutable snapshot returned by getLog(); replaced only on persist. */
  private snapshot: ExerciseLog = freezeLog(createEmptyLog());
  private loadedFromStorage = false;
  private listeners = new Set<Listener>();

  getLog(): ExerciseLog {
    if (typeof window === "undefined") {
      return createEmptyLog();
    }

    if (!this.loadedFromStorage) {
      this.commitSnapshot(parseLog(window.localStorage.getItem(STORAGE_KEY)));
      this.loadedFromStorage = true;
    }

    return this.snapshot;
  }

  markWorkoutDay(
    date: string,
    category: WorkoutCategory = "no-especificado",
    categories?: ConcreteWorkoutCategory[],
  ): void {
    const log = this.getMutableLog();
    const existingIndex = log.workoutDays.findIndex((day) => day.date === date);

    let next: WorkoutDay;
    if (categories !== undefined) {
      const normalized = normalizeCategories(categories);
      next =
        normalized.length === 0
          ? { date, category: "no-especificado" }
          : {
              date,
              category: primaryCategoryFromSelection(normalized),
              categories: normalized,
            };
    } else if (isConcreteCategory(category)) {
      next = { date, category, categories: [category] };
    } else {
      next = { date, category: "no-especificado" };
    }

    if (existingIndex >= 0) {
      log.workoutDays[existingIndex] = next;
    } else {
      log.workoutDays.push(next);
    }

    this.persist(log);
  }

  unmarkWorkoutDay(date: string): void {
    const log = this.getMutableLog();
    const nextWorkoutDays = log.workoutDays.filter((day) => day.date !== date);

    if (nextWorkoutDays.length === log.workoutDays.length) {
      return;
    }

    log.workoutDays = nextWorkoutDays;
    this.persist(log);
  }

  addStretchSession(session: StretchSession): void {
    const log = this.getMutableLog();
    log.stretchSessions.push({ ...session });
    this.persist(log);
  }

  updatePrefs(partial: Partial<UserPrefs>): void {
    const log = this.getMutableLog();
    log.prefs = { ...log.prefs, ...partial };
    this.persist(log);
  }

  subscribe = (listener: Listener): (() => void) => {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  };

  private getMutableLog(): ExerciseLog {
    return cloneLog(this.getLog());
  }

  private commitSnapshot(log: ExerciseLog): void {
    this.snapshot = freezeLog(cloneLog(log));
  }

  private persist(log: ExerciseLog): void {
    this.commitSnapshot(log);
    this.loadedFromStorage = true;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(log));
    }

    this.notify();
  }

  private notify(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /** Test-only: reset in-memory snapshot and storage. */
  _resetForTests(): void {
    this.snapshot = freezeLog(createEmptyLog());
    this.loadedFromStorage = false;
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    this.notify();
  }
}

export const exerciseLogRepository = new ExerciseLogRepository();
