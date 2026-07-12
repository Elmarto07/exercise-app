---
baseline_commit: NO_VCS
---

# Story 2.1: Estado de hoy y marcar Workout Day

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user (Martin),
I want to mark today as a workout day with one tap,
So that I record my habit in seconds (FR-1, FR-3, UJ-1).

## Acceptance Criteria

1. **Given** Home loads and today has no Workout Day **When** I tap "Marcar entreno de hoy" **Then** UI shows registered state with check within 500ms perceived (NFR-1)
2. **And** repository persists one Workout Day for today's local date with default category `no-especificado`
3. **And** reload preserves the registered state (localStorage via repository)
4. **And** duplicate entries for same date are impossible — repository upsert only (AD-8; already implemented in 1.2)
5. **And** headline shows "¿Entrenaste hoy?" with today's date in Spanish below (UX-DR9)
6. **And** registered CTA shows check + copy `alreadyMarked` per UX-DR2 (DESIGN.md button-primary registered variant); unmark tap is **no-op** in this story (Story 2.2 adds confirmation dialog)

## Tasks / Subtasks

- [x] Task 1: Today status hook and pure helpers (AC: 1, 2, 4)
  - [x] Create `lib/hooks/use-today.ts` — derive `todayDate`, `isTodayMarked`, `todayWorkoutDay` from `useExerciseLog()` + `todayLocalDate()`
  - [x] Export testable pure helpers: `getTodayWorkoutDay(log, date)`, `isTodayMarked(log, date?)`
  - [x] Export `markToday()` calling `exerciseLogRepository.markWorkoutDay(todayLocalDate())` — no direct localStorage
  - [x] Unit tests for pure helpers (marked/unmarked, wrong date)
- [x] Task 2: Workout mark button component (AC: 1, 6)
  - [x] Create `components/home/workout-mark-button.tsx` (`"use client"`)
  - [x] Unmarked: min-h-14, full width, green primary — label `copy.home.markToday`
  - [x] Marked: white/raised bg, 2px green border, green-deep text, circular check badge + `copy.home.alreadyMarked` (DESIGN.md registered state)
  - [x] `onClick` when unmarked → `markToday()`; when marked → no-op (defer unmark to 2.2)
  - [x] `aria-label` reflects state; min tap target ≥44px
- [x] Task 3: Wire Home page (AC: 1, 3, 5)
  - [x] Update `app/page.tsx` — replace placeholder `<button>` with `<WorkoutMarkButton />`
  - [x] Keep headline + `<TodayDate />` unchanged (already satisfy AC 5)
  - [x] Do NOT wire category chips, post-workout card, or unmark dialog (Stories 2.2–2.4)
- [x] Task 4: Copy and quality gates (AC: 1–6)
  - [x] Ensure `lib/copy/es.ts` has `alreadyMarked` (exists — verify test covers it)
  - [x] `bun test`, `bun run lint`, `bun run build` pass
  - [x] Manual: mark → reload → still registered; double-mark same day → single entry in log

### Review Findings

- [x] [Review][Defer] Midnight rollover stale `todayDate` [`lib/hooks/use-today.ts:24-34`] — deferred, tab open past midnight without re-render may show yesterday's registered state until reload; acceptable MVP edge case

## Senior Developer Review (AI)

**Review outcome:** Approve  
**Review date:** 2026-07-12  
**Layers:** Blind Hunter, Edge Case Hunter, Acceptance Auditor

### Summary

Implementation satisfies all 6 acceptance criteria. Architecture compliance verified (AD-1, AD-2, AD-6, AD-8, AD-9). Repository upsert and `useSyncExternalStore` reactivity correctly wired. Registered CTA styling matches UX-DR2 mockup. Unmark no-op is intentional per story scope (2.2).

### Action Items

- [x] [Defer] Midnight rollover — `todayDate` not refreshed without re-render; defer to future hardening (visibility listener or interval)

## Dev Notes

### Architecture compliance (MUST)

- **AD-1:** Mutations only via `exerciseLogRepository.markWorkoutDay()` — never localStorage in components
- **AD-2:** Use `todayLocalDate()` from `lib/domain/dates.ts` for persistence date
- **AD-6:** Interactive mark button = `"use client"`; `app/page.tsx` may stay Server Component importing client child
- **AD-8:** Repository upsert already guarantees one WorkoutDay per date — do NOT reimplement dedup in UI
- **AD-9:** `components/home/` → `lib/hooks/use-today.ts` → `lib/storage/exercise-log-repository.ts`

### UX / DESIGN (UX-DR2)

Registered button styling from DESIGN.md + mockup `home-today-marked.html`:

| State | Background | Border | Text | Icon |
| --- | --- | --- | --- | --- |
| Unmarked | `#22C55E` (primary) | none | white | none |
| Marked | white (`surface-raised`) | 2px `#22C55E` | `#16A34A` (green-deep) | green circle + white check |

Use `lucide-react` `Check` icon (already in deps). Tailwind classes approximating tokens — full token story in 1.4.

### Existing code to REUSE (do NOT reinvent)

| Asset | Path | Use |
| --- | --- | --- |
| Repository | `lib/storage/exercise-log-repository.ts` | `markWorkoutDay(date)` — ready |
| Hook | `lib/hooks/use-exercise-log.ts` | subscribe + snapshot |
| Dates | `lib/domain/dates.ts` | `todayLocalDate()` |
| Copy | `lib/copy/es.ts` | `markToday`, `alreadyMarked`, `headline` |
| Date display | `components/home/today-date.tsx` | Spanish formatted date — keep as-is |
| Button primitive | `components/ui/button.tsx` | optional; custom classes OK for CTA sizing per DESIGN |

### Scope boundaries — do NOT implement

- Unmark confirmation dialog (Story 2.2)
- Category chips after mark (Story 2.3)
- Post-workout suggestion card (Story 2.4)
- PWA install banner (1.5)
- `/history` page (3.1)
- Daily stretch card navigation (4.2) — leave placeholder buttons without handlers

### Suggested file structure

```
lib/hooks/
  use-today.ts           # NEW
  use-today.test.ts      # NEW — pure helper tests
components/home/
  workout-mark-button.tsx  # NEW
  today-date.tsx           # unchanged
app/page.tsx               # UPDATE — wire WorkoutMarkButton
```

Architecture spine also mentions `use-today.ts` in capability map — use this filename.

### Testing approach

- Vitest, colocated `*.test.ts`, `environment: "node"` (existing config)
- Test pure helpers with `createEmptyLog()` + sample workout days — no RTL needed
- Repository upsert/dedup already tested in 1.2 — do not duplicate AD-8 tests unless hook adds logic
- Optional: extend `lib/copy/es.test.ts` to assert `alreadyMarked` string exists

### Performance (NFR-1)

Mark is synchronous localStorage write — UI must update on same tick via `useSyncExternalStore`. No artificial delay, no loading spinner. Avoid `useTransition` unless needed.

### Previous story intelligence (1.2)

- `markWorkoutDay(date, category?)` defaults category to `no-especificado`
- `getLog()` returns frozen immutable snapshot — derive state, never mutate
- `exerciseLogRepository.subscribe` is stable arrow property — pass directly to useSyncExternalStore
- SSR: server snapshot is empty log — button shows unmarked until hydration (expected)
- Run tests with `bun run test` (Vitest), not bare `bun test`

### Git intelligence

- Branch `main` has no commits yet; `baseline_commit: NO_VCS`

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.1]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md#AD-8]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/DESIGN.md#Botón-primario]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/mockups/home-today-marked.html]
- [Source: docs/project-context.md]
- [Source: _bmad-output/implementation-artifacts/1-2-exercise-log-repository.md]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

- PowerShell requires `;` instead of `&&` for chained commands

### Completion Notes List

- `useToday` hook derives today's workout state from `useExerciseLog` + `todayLocalDate()`
- `WorkoutMarkButton` toggles visual state on mark; unmark intentionally no-op until Story 2.2
- Registered styling matches DESIGN.md: green border, white bg, check badge, `alreadyMarked` copy
- 22 tests pass; lint and build green

### File List

- lib/hooks/use-today.ts
- lib/hooks/use-today.test.ts
- components/home/workout-mark-button.tsx
- app/page.tsx
- lib/copy/es.test.ts

## Change Log

- 2026-07-12: Story 2.1 implemented — today status hook, workout mark button, Home wiring
- 2026-07-12: Code review approved — midnight rollover deferred; story marked done
