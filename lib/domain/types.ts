export type WorkoutCategory =
  | "piernas"
  | "torso"
  | "cardio"
  | "cuerpo-completo"
  | "no-especificado";

export type StretchRoutineType = "daily" | "post-workout";

export type HistoryView = "calendar" | "list";

export interface WorkoutDay {
  date: string;
  category: WorkoutCategory;
}

export interface StretchSession {
  date: string;
  routineType: StretchRoutineType;
  routineId: string;
}

export interface UserPrefs {
  historyView: HistoryView;
  lastCategory: WorkoutCategory;
  pwaInstallDismissed: boolean;
}

export interface ExerciseLog {
  v: 1;
  workoutDays: WorkoutDay[];
  stretchSessions: StretchSession[];
  prefs: UserPrefs;
}
