---
baseline_commit: 9fe12c957265b6c0744be6b40a1561271bf3e050
---

# Story 4.3: Stretch Player — temporizador y controles

Status: done

## Story

As a user,
I want a fullscreen guided stretch session with countdown,
So that I follow each exercise without searching videos (FR-9, UX-DR6, UX-DR10).

## Acceptance Criteria

1. `/stretch/[routineId]` shows name, monospace countdown, instruction, progress, Pausa / Siguiente / Salir
2. Timer counts down; at 0 auto-advances or completion
3. Pausa freezes with “Pausado” label
4. Siguiente skips
5. Salir always opens “¿Salir de la rutina?”; confirm → Home without session log
6. Countdown uses `aria-live="polite"`

## Tasks / Subtasks

- [x] Route + StretchPlayer + exit dialog
- [x] Timer / pause / next / progress segments
- [x] Copy in `lib/copy/es.ts`
- [x] Quality gates

## Dev Agent Record

### Completion Notes List

- Implemented `app/stretch/[routineId]/page.tsx`, `StretchPlayer`, `ExitStretchDialog`, `formatStretchCountdown`.
- Unknown/empty routines → `StretchNotFound`.

### File List

- `app/stretch/[routineId]/page.tsx`
- `components/stretch/stretch-player.tsx`
- `components/stretch/exit-stretch-dialog.tsx`
- `components/stretch/stretch-not-found.tsx`
- `lib/domain/stretch-timer.ts`
- `lib/domain/stretch-timer.test.ts`
- `lib/copy/es.ts`
- `lib/copy/es.test.ts`

## Change Log

- 2026-07-19: Implemented Stretch Player; status → review
- 2026-07-25: Code review patches applied (wall-clock timer, exit freeze, back guard, tick generation); status → done

### Review Findings

- [x] [Review][Decision] Session logging on completion lives in StretchPlayer (Story 4.4 write-path) — resolved: keep bundled; 4.4 owns logging semantics in the shared Player.
- [x] [Review][Patch] System/browser back exits Player without confirmation — trap history/`popstate` so back opens the same exit dialog [`components/stretch/stretch-player.tsx`]
- [x] [Review][Patch] Timer keeps running while exit dialog is open — can auto-complete and log while user is abandoning [`components/stretch/stretch-player.tsx`]
- [x] [Review][Patch] Countdown uses bare `setInterval(1000)` — drifts under tab throttle / background; anchor end time and recompute remaining [`components/stretch/stretch-player.tsx` / `lib/domain/stretch-timer.ts`]
- [x] [Review][Patch] Race: Next click concurrent with interval tick can skip an extra exercise [`components/stretch/stretch-player.tsx`]
- [x] [Review][Patch] `clearInterval` inside `setRemaining` updater makes the state updater impure [`components/stretch/stretch-player.tsx`]
- [x] [Review][Defer] `loggedRef` set true before `addStretchSession`; throw loses the log with no retry [`components/stretch/stretch-player.tsx:67`] — deferred, owned by Story 4.4
- [x] [Review][Defer] No component/behavior tests for Player (pause, auto-advance, exit without log) — deferred, pre-existing quality gap beyond `formatStretchCountdown`
- [x] [Review][Defer] Progress segments are decorative `div`s without accessible name — deferred, progress also exposed as “N de M” text
