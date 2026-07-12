import { formatLocalDate } from "@/lib/domain/dates";
import { copy } from "@/lib/copy/es";
import type { WorkoutCategory, WorkoutDay } from "@/lib/domain/types";

export const HISTORY_WINDOW_DAYS = 30;

export type HistoryDayCell = {
  date: string;
  dayOfMonth: number;
  inWindow: boolean;
  isToday: boolean;
};

export type HistoryListRow = {
  date: string;
  isToday: boolean;
  workoutDay?: WorkoutDay;
};

function parseLocalDateString(date: string): Date {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function addDaysToDateString(date: string, deltaDays: number): string {
  const next = parseLocalDateString(date);
  next.setDate(next.getDate() + deltaDays);
  return formatLocalDate(next);
}

/** Inclusive range: today and the previous 29 days (30 total). */
export function getHistoryWindowDates(endDate: string): string[] {
  const startDate = addDaysToDateString(endDate, -(HISTORY_WINDOW_DAYS - 1));
  const dates: string[] = [];
  let cursor = startDate;

  while (cursor <= endDate) {
    dates.push(cursor);
    cursor = addDaysToDateString(cursor, 1);
  }

  return dates;
}

export function countWorkoutDaysInRange(
  workoutDays: WorkoutDay[],
  windowDates: string[],
): number {
  const windowSet = new Set(windowDates);
  return workoutDays.filter((day) => windowSet.has(day.date)).length;
}

function getMondayBasedWeekday(date: string): number {
  const day = parseLocalDateString(date).getDay();
  return (day + 6) % 7;
}

export function buildHistoryCalendarGrid(
  windowDates: string[],
  today: string,
): HistoryDayCell[] {
  if (windowDates.length === 0) {
    return [];
  }

  const windowSet = new Set(windowDates);
  const startDate = windowDates[0];
  const endDate = windowDates[windowDates.length - 1];
  const leadingPadding = getMondayBasedWeekday(startDate);

  const cells: HistoryDayCell[] = [];

  for (let index = leadingPadding; index > 0; index -= 1) {
    const date = addDaysToDateString(startDate, -index);
    cells.push({
      date,
      dayOfMonth: parseLocalDateString(date).getDate(),
      inWindow: windowSet.has(date),
      isToday: date === today,
    });
  }

  for (const date of windowDates) {
    cells.push({
      date,
      dayOfMonth: parseLocalDateString(date).getDate(),
      inWindow: true,
      isToday: date === today,
    });
  }

  let trailingDate = endDate;
  while (cells.length % 7 !== 0) {
    trailingDate = addDaysToDateString(trailingDate, 1);
    cells.push({
      date: trailingDate,
      dayOfMonth: parseLocalDateString(trailingDate).getDate(),
      inWindow: windowSet.has(trailingDate),
      isToday: trailingDate === today,
    });
  }

  return cells;
}

export function indexWorkoutDaysByDate(
  workoutDays: WorkoutDay[],
): Map<string, WorkoutDay> {
  return new Map(workoutDays.map((day) => [day.date, day]));
}

export function buildHistoryListRows(
  windowDates: string[],
  today: string,
  workoutByDate: Map<string, WorkoutDay>,
): HistoryListRow[] {
  return [...windowDates].reverse().map((date) => ({
    date,
    isToday: date === today,
    workoutDay: workoutByDate.get(date),
  }));
}

export function getCategoryDisplayLabel(category: WorkoutCategory): string {
  if (category === "no-especificado") {
    return copy.history.categoryUnspecified;
  }

  return copy.home.categories[category];
}

export function getCategoryShortLabel(category: WorkoutCategory): string {
  switch (category) {
    case "piernas":
      return "piernas";
    case "torso":
      return "torso";
    case "cardio":
      return "cardio";
    case "cuerpo-completo":
      return "c. compl.";
    case "no-especificado":
      return "no esp.";
  }
}
