import { describe, expect, it } from "vitest";

import {
  addDaysToDateString,
  buildHistoryCalendarGrid,
  buildHistoryListRows,
  countWorkoutDaysInRange,
  dayHasStretchSession,
  getCategoryDisplayLabel,
  getHistoryWindowDates,
  HISTORY_WINDOW_DAYS,
  indexStretchDates,
  indexWorkoutDaysByDate,
} from "@/lib/domain/history-window";
import type { StretchSession, WorkoutDay } from "@/lib/domain/types";

describe("lib/domain/history-window", () => {
  it("returns 30 inclusive dates ending on today", () => {
    const dates = getHistoryWindowDates("2026-07-12");

    expect(dates).toHaveLength(HISTORY_WINDOW_DAYS);
    expect(dates[0]).toBe("2026-06-13");
    expect(dates.at(-1)).toBe("2026-07-12");
  });

  it("counts workout days only inside the window", () => {
    const windowDates = getHistoryWindowDates("2026-07-12");
    const workoutDays: WorkoutDay[] = [
      { date: "2026-06-13", category: "piernas" },
      { date: "2026-06-12", category: "torso" },
      { date: "2026-07-12", category: "cardio" },
    ];

    expect(countWorkoutDaysInRange(workoutDays, windowDates)).toBe(2);
  });

  it("pads calendar grid to full weeks with outside cells", () => {
    const windowDates = getHistoryWindowDates("2026-07-12");
    const grid = buildHistoryCalendarGrid(windowDates, "2026-07-12");

    expect(grid.length % 7).toBe(0);
    expect(grid.some((cell) => !cell.inWindow)).toBe(true);
    expect(grid.some((cell) => cell.isToday)).toBe(true);
  });

  it("addDaysToDateString shifts across month boundaries", () => {
    expect(addDaysToDateString("2026-07-01", -1)).toBe("2026-06-30");
  });

  it("builds list rows newest-first with workout attachment", () => {
    const windowDates = getHistoryWindowDates("2026-07-12");
    const workoutByDate = indexWorkoutDaysByDate([
      { date: "2026-07-12", category: "piernas" },
      { date: "2026-06-20", category: "torso" },
    ]);
    const rows = buildHistoryListRows(
      windowDates,
      "2026-07-12",
      workoutByDate,
      new Set(),
    );

    expect(rows).toHaveLength(HISTORY_WINDOW_DAYS);
    expect(rows[0]?.date).toBe("2026-07-12");
    expect(rows[0]?.workoutDay?.category).toBe("piernas");
    expect(rows[0]?.hasStretchSession).toBe(false);
    expect(rows.at(-1)?.date).toBe("2026-06-13");
  });

  it("indexes stretch dates as presence-only set", () => {
    const sessions: StretchSession[] = [
      { date: "2026-07-12", routineType: "daily", routineId: "a" },
      { date: "2026-07-12", routineType: "post-workout", routineId: "b" },
      { date: "2026-07-10", routineType: "daily", routineId: "c" },
    ];
    const stretchDates = indexStretchDates(sessions);

    expect(stretchDates.size).toBe(2);
    expect(dayHasStretchSession("2026-07-12", stretchDates)).toBe(true);
    expect(dayHasStretchSession("2026-07-11", stretchDates)).toBe(false);
  });

  it("marks stretch-only, workout+stretch, and no-stretch list rows", () => {
    const windowDates = getHistoryWindowDates("2026-07-12");
    const workoutByDate = indexWorkoutDaysByDate([
      { date: "2026-07-12", category: "piernas" },
    ]);
    const stretchDates = indexStretchDates([
      { date: "2026-07-12", routineType: "daily", routineId: "a" },
      { date: "2026-07-12", routineType: "post-workout", routineId: "b" },
      { date: "2026-07-11", routineType: "daily", routineId: "c" },
    ]);
    const rows = buildHistoryListRows(
      windowDates,
      "2026-07-12",
      workoutByDate,
      stretchDates,
    );
    const todayRow = rows.find((row) => row.date === "2026-07-12");
    const stretchOnlyRow = rows.find((row) => row.date === "2026-07-11");
    const emptyRow = rows.find((row) => row.date === "2026-07-10");

    expect(todayRow?.workoutDay?.category).toBe("piernas");
    expect(todayRow?.hasStretchSession).toBe(true);
    expect(stretchOnlyRow?.workoutDay).toBeUndefined();
    expect(stretchOnlyRow?.hasStretchSession).toBe(true);
    expect(emptyRow?.hasStretchSession).toBe(false);
  });

  it("does not count stretch-only days in workout summary", () => {
    const windowDates = getHistoryWindowDates("2026-07-12");
    const workoutDays: WorkoutDay[] = [];
    const stretchSessions: StretchSession[] = [
      { date: "2026-07-12", routineType: "daily", routineId: "seed" },
      { date: "2026-07-11", routineType: "daily", routineId: "seed-2" },
    ];

    expect(countWorkoutDaysInRange(workoutDays, windowDates)).toBe(0);
    expect(indexStretchDates(stretchSessions).size).toBe(2);
  });

  it("maps category display labels for all categories", () => {
    expect(getCategoryDisplayLabel("piernas")).toBe("Piernas");
    expect(getCategoryDisplayLabel("torso")).toBe("Torso");
    expect(getCategoryDisplayLabel("cardio")).toBe("Cardio");
    expect(getCategoryDisplayLabel("cuerpo-completo")).toBe("Cuerpo completo");
    expect(getCategoryDisplayLabel("no-especificado")).toBe("no especificado");
  });
});
