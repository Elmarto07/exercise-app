import { describe, expect, it } from "vitest";

import {
  addDaysToDateString,
  buildHistoryCalendarGrid,
  buildHistoryListRows,
  countWorkoutDaysInRange,
  getCategoryDisplayLabel,
  getHistoryWindowDates,
  HISTORY_WINDOW_DAYS,
  indexWorkoutDaysByDate,
} from "@/lib/domain/history-window";
import type { WorkoutDay } from "@/lib/domain/types";

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
    const rows = buildHistoryListRows(windowDates, "2026-07-12", workoutByDate);

    expect(rows).toHaveLength(HISTORY_WINDOW_DAYS);
    expect(rows[0]?.date).toBe("2026-07-12");
    expect(rows[0]?.workoutDay?.category).toBe("piernas");
    expect(rows.at(-1)?.date).toBe("2026-06-13");
  });

  it("maps category display labels for all categories", () => {
    expect(getCategoryDisplayLabel("piernas")).toBe("Piernas");
    expect(getCategoryDisplayLabel("torso")).toBe("Torso");
    expect(getCategoryDisplayLabel("cardio")).toBe("Cardio");
    expect(getCategoryDisplayLabel("cuerpo-completo")).toBe("Cuerpo completo");
    expect(getCategoryDisplayLabel("no-especificado")).toBe("no especificado");
  });
});
