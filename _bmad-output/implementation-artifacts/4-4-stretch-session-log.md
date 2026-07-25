---
baseline_commit: 9fe12c957265b6c0744be6b40a1561271bf3e050
---

# Story 4.4: Registrar Stretch Session al completar

Status: done

## Story

As a user,
I want completed stretch routines recorded separately from workouts,
So that I track mobility work on its own (FR-15, AD-3, UJ-3).

## Acceptance Criteria

1. Completing last exercise → “Listo. Buen trabajo.” and append Stretch Session
2. No Workout Day created/modified
3. History stretch indicator works (3.3)
4. Multiple sessions same day allowed
5. Exit without complete does not log

## Tasks / Subtasks

- [x] Log via `exerciseLogRepository.addStretchSession` on completion only
- [x] Quality gates

### Review Findings

- [x] [Review][Patch] Hide PostWorkoutCard after today’s post-workout stretch is logged [`components/home/home-workout-section.tsx:28`] — decided: implement now (code review 2026-07-25)
- [x] [Review][Patch] Exit confirm with `remaining === 0` can complete and log (AC5) [`components/stretch/stretch-player.tsx:176`]
- [x] [Review][Patch] `loggedRef` set true before `addStretchSession`; throw loses log with no retry [`components/stretch/stretch-player.tsx:128`]
- [x] [Review][Defer] History `pushState` guard not cleaned on complete/exit [`components/stretch/stretch-player.tsx:136`] — deferred, pre-existing
- [x] [Review][Defer] Pause/resume can inflate timer via `Math.ceil` re-arm [`components/stretch/stretch-player.tsx:49`] — deferred, pre-existing

## Dev Agent Record

### Completion Notes List

- `StretchPlayer` logs `{ date: todayLocalDate(), routineType, routineId }` once on completion screen; exit path skips logging.
- Code review 2026-07-25: hide post-workout card when matching routine logged today; AC5 exit race fixed; `loggedRef` only after successful persist.

### File List

- `components/stretch/stretch-player.tsx`
- `components/stretch/exit-stretch-dialog.tsx`
- `components/home/home-workout-section.tsx`
- `lib/services/stretch-resolver.ts`
- `lib/services/stretch-resolver.test.ts`

## Change Log

- 2026-07-19: Wired completion logging; status → review
- 2026-07-25: Code review patches applied; status → done
