"use client";

import type { HistoryView } from "@/lib/domain/types";
import {
  buildHistoryCalendarGrid,
  buildHistoryListRows,
  countWorkoutDaysInRange,
  getHistoryWindowDates,
  indexWorkoutDaysByDate,
} from "@/lib/domain/history-window";
import { todayLocalDate } from "@/lib/domain/dates";
import { useExerciseLog } from "@/lib/hooks/use-exercise-log";
import { exerciseLogRepository } from "@/lib/storage/exercise-log-repository";

export function setHistoryView(view: HistoryView): void {
  if (exerciseLogRepository.getLog().prefs.historyView === view) {
    return;
  }

  exerciseLogRepository.updatePrefs({ historyView: view });
}

export function useHistory() {
  const log = useExerciseLog();
  const today = todayLocalDate();
  const windowDates = getHistoryWindowDates(today);
  const workoutByDate = indexWorkoutDaysByDate(log.workoutDays);
  const calendarCells = buildHistoryCalendarGrid(windowDates, today);
  const listRows = buildHistoryListRows(windowDates, today, workoutByDate);

  return {
    today,
    historyView: log.prefs.historyView,
    windowDates,
    summaryCount: countWorkoutDaysInRange(log.workoutDays, windowDates),
    calendarCells,
    listRows,
    workoutByDate,
    setHistoryView,
  };
}
