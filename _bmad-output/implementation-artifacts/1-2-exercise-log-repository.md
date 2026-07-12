---
baseline_commit: NO_VCS
---

# Story 1.2: ExerciseLogRepository y schema v1

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want my workout and stretch data stored reliably in one place,
So that the app remembers my activity across sessions.

## Acceptance Criteria

1. **Given** empty localStorage **When** the repository initializes **Then** it reads/writes key `marcafit:log` with schema v1 (`workoutDays`, `stretchSessions`, `prefs`)
2. **And** only `ExerciseLogRepository` touches localStorage (no direct access from components)
3. **And** `markWorkoutDay`, `unmarkWorkoutDay`, `addStretchSession`, `getLog`, `updatePrefs` exist with typed domain models
4. **And** dates use `YYYY-MM-DD` from local timezone util (AD-2)
5. **And** `useExerciseLog` hook notifies React on changes (useSyncExternalStore or equivalent)

## Tasks / Subtasks

- [x] Task 1: Domain types and date utility (AC: 3, 4)
  - [x] Create `lib/domain/types.ts` — `WorkoutDay`, `StretchSession`, `UserPrefs`, `ExerciseLog`, `WorkoutCategory`, `StretchRoutineType`
  - [x] Create `lib/domain/dates.ts` — `formatLocalDate(date?: Date): string`, `todayLocalDate(): string` using local timezone
  - [x] Create `lib/domain/categories.ts` — category union + `isConcreteCategory()` for AD-5 (used later; export now)
  - [x] Unit tests for `dates.ts` (local formatting, zero-padding)
- [x] Task 2: Schema v1 and repository (AC: 1, 2, 3)
  - [x] Create `lib/storage/schema.ts` — `STORAGE_KEY = 'marcafit:log'`, `SCHEMA_VERSION = 1`, `createEmptyLog()`, `parseLog(raw)`, defaults for `prefs`
  - [x] Create `lib/storage/exercise-log-repository.ts` — singleton class with:
    - `getLog(): ExerciseLog`
    - `markWorkoutDay(date, category?)` — upsert by date (AD-8), default category `no-especificado`
    - `unmarkWorkoutDay(date)` — remove entry; no-op if missing
    - `addStretchSession(session)` — append to `stretchSessions` (AD-3; never touches workoutDays)
    - `updatePrefs(partial)` — merge into prefs
    - `subscribe(listener)` / `notify()` for external store pattern
  - [x] Guard: all localStorage access ONLY in this file
  - [x] Unit tests with in-memory localStorage mock (vitest)
- [x] Task 3: React hook (AC: 5)
  - [x] Create `lib/hooks/use-exercise-log.ts` — `useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)`
  - [x] Server snapshot returns empty log (SSR-safe, AD-6)
  - [x] Test hook subscription fires after repository mutation
- [x] Task 4: Quality gates (AC: 1–5)
  - [x] `bun test` — all new tests pass
  - [x] `bun run lint` and `bun run build` pass
  - [x] No UI wiring in this story (Epic 2 connects Home)

### Review Findings

- [x] [Review][Patch] `getLog()` expone referencia mutable al cache interno [`lib/storage/exercise-log-repository.ts:19-21`] — snapshot congelado; `commitSnapshot` reemplaza referencia solo en `persist()`
- [x] [Review][Patch] `subscribe.bind()` inestable en cada render [`lib/hooks/use-exercise-log.ts:11`] — arrow property en repo + referencias estables en hook
- [x] [Review][Patch] `parseLog` no valida forma de entradas en arrays [`lib/storage/schema.ts:41-52`] — sanitizers filtran items malformados
- [x] [Review][Defer] Sin sync cross-tab vía `storage` event — deferred, pre-existing scope (no está en AC 1.2; mejora futura PWA)

## Dev Notes

### Architecture compliance (MUST)

- **AD-1:** Single key `marcafit:log`; all reads/writes via `ExerciseLogRepository` in `lib/storage/`
- **AD-2:** Persist dates as `YYYY-MM-DD` from `lib/domain/dates.ts` — never `toISOString().slice(0,10)` (UTC bug)
- **AD-3:** `workoutDays[]` and `stretchSessions[]` are independent; `addStretchSession` never creates workout entries
- **AD-8:** `markWorkoutDay` upserts — max one WorkoutDay per date
- **AD-9:** `lib/domain` must NOT import React/Next; `lib/storage` may import domain only

### Schema v1 shape (from ARCHITECTURE-SPINE)

```json
{
  "v": 1,
  "workoutDays": [{ "date": "2026-07-11", "category": "piernas" }],
  "stretchSessions": [{ "date": "2026-07-11", "routineType": "daily", "routineId": "daily" }],
  "prefs": {
    "historyView": "calendar",
    "lastCategory": "piernas",
    "pwaInstallDismissed": false
  }
}
```

### Default prefs

| Field | Default |
| --- | --- |
| `historyView` | `"calendar"` |
| `lastCategory` | `"no-especificado"` |
| `pwaInstallDismissed` | `false` |

### WorkoutCategory values

`piernas` | `torso` | `cardio` | `cuerpo-completo` | `no-especificado`

### Repository API signatures

```typescript
markWorkoutDay(date: string, category?: WorkoutCategory): void
unmarkWorkoutDay(date: string): void
addStretchSession(session: Omit<StretchSession, never>): void
getLog(): ExerciseLog
updatePrefs(partial: Partial<UserPrefs>): void
subscribe(listener: () => void): () => void
```

### useSyncExternalStore pattern

```typescript
export function useExerciseLog(): ExerciseLog {
  return useSyncExternalStore(
    exerciseLogRepository.subscribe.bind(exerciseLogRepository),
    () => exerciseLogRepository.getLog(),
    () => createEmptyLog() // SSR
  );
}
```

Export a named singleton `exerciseLogRepository` instance from storage module.

### Testing approach

- Vitest, colocated `*.test.ts` (matches Story 1.1)
- Mock `localStorage` in repository tests — clear between tests
- For hook test: use `@testing-library/react` only if already installed; otherwise test subscribe/getLog integration without RTL, or add `@testing-library/react` + `jsdom` if needed
- **Prefer:** repository unit tests cover business rules; hook test verifies subscribe callback invoked on mutation (can test repository subscribe directly without RTL to avoid new deps)

### Do NOT implement in this story

- Serwist / PWA (1.3)
- Home UI wiring / mark button handlers (Epic 2)
- `stretch-routines.json` (4.1)
- `history-range.ts` (Epic 3)
- Direct localStorage in any component or hook except via repository

### Previous story intelligence (1.1)

- Bun exclusive — `bun test`, `bun run build`
- Path alias `@/*` → repo root
- Vitest config: `environment: "node"`, `include: ["**/*.test.ts"]`
- Existing: `lib/copy/es.ts`, `lib/utils.ts`, `components/home/today-date.tsx` (client date display — do not duplicate; use `lib/domain/dates.ts` for persistence)
- Git has no commits yet; baseline_commit may be `NO_VCS`

### Project Structure Notes

```
lib/
  domain/
    types.ts          # NEW
    dates.ts          # NEW
    categories.ts     # NEW
  storage/
    schema.ts         # NEW
    exercise-log-repository.ts  # NEW
  hooks/
    use-exercise-log.ts  # NEW
```

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.2]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md#AD-1]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md#Schema-marcafitlog-v1]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

- `bun test` (Bun runner) lacks `vi.stubGlobal`; use `bun run test` (Vitest) for repository tests
- Browser env in tests via `globalThis.window` mock instead of vitest stubGlobal

### Completion Notes List

- Domain layer: typed models, local-date util (no UTC), `isConcreteCategory` for AD-5
- Storage: schema v1 parse/defaults, singleton repository with subscribe/notify
- Repository methods: upsert workout day, independent stretch sessions, prefs merge
- Hook: `useExerciseLog` with SSR-safe empty snapshot via `useSyncExternalStore`
- 16 new tests; full suite 17 pass; lint + build green

### File List

- lib/domain/types.ts
- lib/domain/dates.ts
- lib/domain/dates.test.ts
- lib/domain/categories.ts
- lib/domain/categories.test.ts
- lib/storage/schema.ts
- lib/storage/exercise-log-repository.ts
- lib/storage/exercise-log-repository.test.ts
- lib/hooks/use-exercise-log.ts

## Change Log

- 2026-07-12: Code review patches — immutable snapshot, stable subscribe, parseLog validation
