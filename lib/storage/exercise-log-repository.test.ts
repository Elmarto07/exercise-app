import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { exerciseLogRepository } from "@/lib/storage/exercise-log-repository";
import {
  createEmptyLog,
  parseLog,
  STORAGE_KEY,
} from "@/lib/storage/schema";

function createLocalStorageMock(): Storage {
  const store = new Map<string, string>();
  return {
    get length() {
      return store.size;
    },
    clear() {
      store.clear();
    },
    getItem(key: string) {
      return store.has(key) ? store.get(key)! : null;
    },
    key(index: number) {
      return [...store.keys()][index] ?? null;
    },
    removeItem(key: string) {
      store.delete(key);
    },
    setItem(key: string, value: string) {
      store.set(key, value);
    },
  };
}

const originalWindow = globalThis.window;

function setupBrowserEnv(): void {
  Object.defineProperty(globalThis, "window", {
    value: { localStorage: createLocalStorageMock() },
    configurable: true,
    writable: true,
  });
}

function teardownBrowserEnv(): void {
  if (originalWindow === undefined) {
    // @ts-expect-error — restore undefined window in node
    delete globalThis.window;
  } else {
    globalThis.window = originalWindow;
  }
}

describe("lib/storage/schema", () => {
  it("creates empty log with schema v1 defaults", () => {
    const log = createEmptyLog();
    expect(log.v).toBe(1);
    expect(log.workoutDays).toEqual([]);
    expect(log.stretchSessions).toEqual([]);
    expect(log.prefs.historyView).toBe("calendar");
    expect(log.prefs.lastCategory).toBe("no-especificado");
    expect(log.prefs.pwaInstallDismissed).toBe(false);
  });

  it("returns empty log for null or invalid JSON", () => {
    expect(parseLog(null)).toEqual(createEmptyLog());
    expect(parseLog("{ invalid")).toEqual(createEmptyLog());
    expect(parseLog(JSON.stringify({ v: 2 }))).toEqual(createEmptyLog());
  });

  it("filters malformed workout and stretch entries", () => {
    const raw = JSON.stringify({
      v: 1,
      workoutDays: [
        { date: "2026-07-11", category: "piernas" },
        { date: 123, category: "torso" },
        { date: "2026-07-10", category: "invalid-category" },
      ],
      stretchSessions: [
        { date: "2026-07-11", routineType: "daily", routineId: "daily" },
        { date: "2026-07-11", routineType: "unknown", routineId: "x" },
        { routineType: "daily", routineId: "daily" },
      ],
      prefs: {
        historyView: "list",
        lastCategory: "cardio",
        pwaInstallDismissed: true,
      },
    });

    const log = parseLog(raw);
    expect(log.workoutDays).toEqual([
      { date: "2026-07-11", category: "piernas" },
    ]);
    expect(log.stretchSessions).toEqual([
      { date: "2026-07-11", routineType: "daily", routineId: "daily" },
    ]);
    expect(log.prefs.historyView).toBe("list");
  });
});

describe("lib/storage/exercise-log-repository", () => {
  beforeEach(() => {
    setupBrowserEnv();
    exerciseLogRepository._resetForTests();
  });

  afterEach(() => {
    teardownBrowserEnv();
  });

  it("initializes empty log in localStorage", () => {
    const log = exerciseLogRepository.getLog();
    expect(log).toEqual(createEmptyLog());
    expect(window.localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it("markWorkoutDay upserts by date (AD-8)", () => {
    exerciseLogRepository.markWorkoutDay("2026-07-11", "piernas");
    exerciseLogRepository.markWorkoutDay("2026-07-11", "torso");

    const log = exerciseLogRepository.getLog();
    expect(log.workoutDays).toHaveLength(1);
    expect(log.workoutDays[0]).toEqual({
      date: "2026-07-11",
      category: "torso",
    });
  });

  it("defaults category to no-especificado", () => {
    exerciseLogRepository.markWorkoutDay("2026-07-11");

    expect(exerciseLogRepository.getLog().workoutDays[0].category).toBe(
      "no-especificado",
    );
  });

  it("unmarkWorkoutDay removes entry without affecting stretch sessions", () => {
    exerciseLogRepository.markWorkoutDay("2026-07-11", "piernas");
    exerciseLogRepository.addStretchSession({
      date: "2026-07-11",
      routineType: "daily",
      routineId: "daily",
    });

    exerciseLogRepository.unmarkWorkoutDay("2026-07-11");

    const log = exerciseLogRepository.getLog();
    expect(log.workoutDays).toHaveLength(0);
    expect(log.stretchSessions).toHaveLength(1);
  });

  it("addStretchSession appends without creating workout days (AD-3)", () => {
    exerciseLogRepository.addStretchSession({
      date: "2026-07-11",
      routineType: "post-workout",
      routineId: "post-piernas",
    });

    const log = exerciseLogRepository.getLog();
    expect(log.workoutDays).toHaveLength(0);
    expect(log.stretchSessions).toHaveLength(1);
  });

  it("updatePrefs merges partial prefs", () => {
    exerciseLogRepository.updatePrefs({
      historyView: "list",
      pwaInstallDismissed: true,
    });

    const log = exerciseLogRepository.getLog();
    expect(log.prefs.historyView).toBe("list");
    expect(log.prefs.pwaInstallDismissed).toBe(true);
    expect(log.prefs.lastCategory).toBe("no-especificado");
  });

  it("persists to marcafit:log key", () => {
    exerciseLogRepository.markWorkoutDay("2026-07-10", "cardio");

    const raw = window.localStorage.getItem(STORAGE_KEY);
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed.v).toBe(1);
    expect(parsed.workoutDays).toHaveLength(1);
  });

  it("notifies subscribers on mutation", () => {
    const listener = vi.fn();
    const unsubscribe = exerciseLogRepository.subscribe(listener);

    exerciseLogRepository.markWorkoutDay("2026-07-11", "piernas");
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    exerciseLogRepository.unmarkWorkoutDay("2026-07-11");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("getLog snapshot is immutable for external callers", () => {
    exerciseLogRepository.markWorkoutDay("2026-07-11", "piernas");

    const snapshot = exerciseLogRepository.getLog();
    expect(() => {
      snapshot.workoutDays.push({
        date: "2026-07-09",
        category: "torso",
      });
    }).toThrow();

    expect(exerciseLogRepository.getLog().workoutDays).toHaveLength(1);
  });
});

describe("lib/hooks/use-exercise-log integration", () => {
  beforeEach(() => {
    setupBrowserEnv();
    exerciseLogRepository._resetForTests();
  });

  afterEach(() => {
    teardownBrowserEnv();
  });

  it("subscribe receives updates when log changes (useSyncExternalStore contract)", () => {
    let snapshot = exerciseLogRepository.getLog();
    const listener = vi.fn(() => {
      snapshot = exerciseLogRepository.getLog();
    });

    exerciseLogRepository.subscribe(listener);
    exerciseLogRepository.markWorkoutDay("2026-07-11", "piernas");

    expect(listener).toHaveBeenCalled();
    expect(snapshot.workoutDays).toHaveLength(1);
  });
});
