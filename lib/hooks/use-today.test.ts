import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getTodayWorkoutDay, isTodayMarked, omitTodayCategory, selectTodayCategory, unmarkToday } from "@/lib/hooks/use-today";
import { exerciseLogRepository } from "@/lib/storage/exercise-log-repository";
import { createEmptyLog } from "@/lib/storage/schema";

vi.mock("@/lib/domain/dates", () => ({
  todayLocalDate: () => "2026-07-12",
}));

const today = "2026-07-12";

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

describe("use-today helpers", () => {
  it("returns undefined when today has no workout day", () => {
    const log = createEmptyLog();
    expect(getTodayWorkoutDay(log, today)).toBeUndefined();
    expect(isTodayMarked(log, today)).toBe(false);
  });

  it("returns workout day when today is marked", () => {
    const log = createEmptyLog();
    log.workoutDays.push({ date: today, category: "no-especificado" });

    expect(getTodayWorkoutDay(log, today)).toEqual({
      date: today,
      category: "no-especificado",
    });
    expect(isTodayMarked(log, today)).toBe(true);
  });

  it("does not match a different date", () => {
    const log = createEmptyLog();
    log.workoutDays.push({ date: "2026-07-11", category: "piernas" });

    expect(getTodayWorkoutDay(log, today)).toBeUndefined();
    expect(isTodayMarked(log, today)).toBe(false);
  });
});

describe("unmarkToday", () => {
  beforeEach(() => {
    setupBrowserEnv();
    exerciseLogRepository._resetForTests();
  });

  afterEach(() => {
    exerciseLogRepository._resetForTests();
    teardownBrowserEnv();
  });

  it("removes today's workout day but preserves stretch sessions", () => {
    exerciseLogRepository.markWorkoutDay(today, "piernas");
    exerciseLogRepository.addStretchSession({
      date: today,
      routineType: "daily",
      routineId: "daily",
    });

    unmarkToday();

    const log = exerciseLogRepository.getLog();
    expect(log.workoutDays).toHaveLength(0);
    expect(log.stretchSessions).toHaveLength(1);
    expect(isTodayMarked(log, today)).toBe(false);
  });
});

describe("selectTodayCategory", () => {
  beforeEach(() => {
    setupBrowserEnv();
    exerciseLogRepository._resetForTests();
  });

  afterEach(() => {
    exerciseLogRepository._resetForTests();
    teardownBrowserEnv();
  });

  it("persists concrete category on today's workout day and lastCategory pref", () => {
    exerciseLogRepository.markWorkoutDay(today);

    selectTodayCategory("piernas");

    const log = exerciseLogRepository.getLog();
    expect(log.workoutDays).toEqual([
      { date: today, category: "piernas", categories: ["piernas"] },
    ]);
    expect(log.prefs.lastCategory).toBe("piernas");
  });
});

describe("omitTodayCategory", () => {
  beforeEach(() => {
    setupBrowserEnv();
    exerciseLogRepository._resetForTests();
  });

  afterEach(() => {
    exerciseLogRepository._resetForTests();
    teardownBrowserEnv();
  });

  it("keeps no-especificado and preserves prior lastCategory", () => {
    exerciseLogRepository.updatePrefs({ lastCategory: "torso" });
    exerciseLogRepository.markWorkoutDay(today);

    omitTodayCategory();

    const log = exerciseLogRepository.getLog();
    expect(log.workoutDays[0]?.category).toBe("no-especificado");
    expect(log.prefs.lastCategory).toBe("torso");
  });
});
