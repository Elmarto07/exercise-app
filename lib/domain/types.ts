export type WorkoutCategory =
  | "piernas"
  | "torso"
  | "cardio"
  | "cuerpo-completo"
  | "no-especificado";

export type StretchRoutineType = "daily" | "post-workout";

export interface StretchExercise {
  id: string;
  name: string;
  durationSeconds: number;
  instruction: string;
}

export interface StretchRoutine {
  id: string;
  type: StretchRoutineType;
  title: string;
  durationMinutes: number;
  meta: string;
  exercises: StretchExercise[];
}

export type HistoryView = "calendar" | "list";

export type ConcreteWorkoutCategoryValue = Exclude<
  WorkoutCategory,
  "no-especificado"
>;

export interface WorkoutDay {
  date: string;
  /** Legacy primary category — always present for backward compatibility. */
  category: WorkoutCategory;
  /** Optional multi-select zones; absent on legacy days. */
  categories?: ConcreteWorkoutCategoryValue[];
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
