---
baseline_commit: d9d037ce9391a44d84380aa877ae18bfe3bafaea
---

# Story 3.3: Stretch Session indicator in History

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to see which days I completed stretching,
So that stretching progress is separate from workout marks (FR-4, FR-15 visibility, UX-DR5).

## Acceptance Criteria

1. **Given** I completed a Stretch Session on a date without a Workout Day **When** I view that date in History (calendar) **Then** a secondary neutral indicator (dot under the date) appears **And** the cell does **not** use workout green fill/border
2. **Given** I completed a Stretch Session on a date without a Workout Day **When** I view that date in History (list) **Then** the row shows **“Estiramientos ✓”** (from copy) without inventing a workout category
3. **Given** a day has both Workout Day and Stretch Session **When** displayed in calendar **Then** workout registered styling (green + short category) **and** the neutral stretch dot are both visible
4. **Given** a day has both Workout Day and Stretch Session **When** displayed in list **Then** full category label **and** “Estiramientos ✓” are both visible without conflating meanings
5. **And** summary “X de 30 días” still counts **only** Workout Days (unchanged from 3.1 / FR-5)
6. **And** multiple `stretchSessions` on the same date produce **one** indicator (presence, not count / routine metadata)
7. **And** data comes from `log.stretchSessions` via `useExerciseLog` → domain helpers — never `localStorage` in components
8. **And** no new libraries; Spanish copy only via `lib/copy/es.ts`

## Tasks / Subtasks

- [ ] Task 1: Domain — index stretch dates (AC: 1–6)
  - [ ] Add `indexStretchDates(stretchSessions: StretchSession[]): Set<string>` (or equivalent Map) in `lib/domain/history-window.ts` — unique dates only
  - [ ] Extend `HistoryListRow` with `hasStretchSession: boolean`
  - [ ] Update `buildHistoryListRows(...)` to set `hasStretchSession` from the stretch date set
  - [ ] Optional helper `dayHasStretchSession(date, stretchDates): boolean` if it clarifies calendar/list call sites
  - [ ] Unit tests in `lib/domain/history-window.test.ts`:
    - stretch-only day → `hasStretchSession: true`, no `workoutDay`
    - workout + stretch → both
    - no stretch → false
    - two sessions same date → still one `true`
    - `countWorkoutDaysInRange` unchanged when only stretches exist
- [ ] Task 2: Copy (AC: 2, 4, 8)
  - [ ] Add `copy.history.stretchCompleted: "Estiramientos ✓"` (exact product string)
  - [ ] Optional: `copy.history.stretchCompletedAria` (e.g. “Estiramientos completados”) for calendar dot `aria-label`
  - [ ] Extend `lib/copy/es.test.ts`
- [ ] Task 3: Hook (AC: 5–7)
  - [ ] In `useHistory()`, derive stretch date set from `log.stretchSessions`
  - [ ] Pass into `buildHistoryListRows` so `listRows` include `hasStretchSession`
  - [ ] Expose `stretchDates: Set<string>` (or Map) for `HistoryCalendar`
  - [ ] Do **not** change `summaryCount` formula
- [ ] Task 4: Calendar UI — neutral dot (AC: 1, 3, 6)
  - [ ] Update `components/history/history-calendar.tsx` props to accept stretch dates
  - [ ] For `cell.inWindow` days with stretch: render secondary dot under the date number
  - [ ] Dot color: `#737373` (`accent-stretch` / DESIGN `day-cell-stretch.dot`) — **never** primary/green (`#DCFCE7`, `#16A34A`, `border-primary`)
  - [ ] Stretch-only: keep empty-cell styling (muted) + dot; registered + stretch: green cell + category short label + dot
  - [ ] Padding / out-of-window cells: no stretch indicator
  - [ ] Accessible name on the dot (aria-label from copy)
- [ ] Task 5: List UI — “Estiramientos ✓” (AC: 2, 4, 6)
  - [ ] Update `components/history/history-list.tsx` to show stretch copy when `row.hasStretchSession`
  - [ ] Layout must show **both** workout status and stretch when both apply (do not replace category with stretch text)
  - [ ] Recommended structure: left = date; right = stacked column — primary line = category or `noWorkout`; secondary muted line = `stretchCompleted` when `hasStretchSession`
  - [ ] Stretch-only: keep `history.noWorkout` on primary line **and** stretch text on secondary line
  - [ ] Stretch text: muted / secondary (`text-muted-foreground` or `#737373`) — not workout green
- [ ] Task 6: Wire HistoryView if needed (AC: 1–4)
  - [ ] Pass `stretchDates` into `HistoryCalendar` from `useHistory()` (`history-view.tsx`)
  - [ ] Preserve WAI-ARIA tabs/tabpanels from Story 3.2 review patches
- [ ] Task 7: Quality gates (AC: 1–8)
  - [ ] `bun run test`, `bun run lint`, `bun run build` pass
  - [ ] Manual seed (DevTools / temporary call): `exerciseLogRepository.addStretchSession({ date, routineType: "daily", routineId: "seed" })`
  - [ ] Manual: stretch-only → calendar dot + list text, no green; both → both signals; summary unchanged; calendar ↔ list toggle still works

## Dev Notes

### Branch / baseline prerequisite (CRITICAL)

History UI from Stories 3.1–3.2 lives on **`feat/epic-3-history`** at baseline `d9d037ce9391a44d84380aa877ae18bfe3bafaea` and is **not** on `main` yet.

- Implement only against that History codebase (merge Epic 3 into `main` first, **or** stack with explicit user approval per git-branching rules).
- Do **not** reinvent `/history`, calendar, list, or toggle from Epic 2 `main`.
- Suggested branch name after base is correct: `feat/3-3-stretch-session-indicator`.

### Architecture compliance (MUST)

- **AD-1:** Read via `useExerciseLog` / repository only — no direct `localStorage` in components
- **AD-2:** Dates are `YYYY-MM-DD` local; reuse existing window helpers
- **AD-3:** `workoutDays[]` ≠ `stretchSessions[]` — stretch indicator must never imply Workout Day (no green fill for stretch-only)
- **AD-6:** Client components; no Server Actions / API routes for user data
- **AD-9:** `components/history/` → `lib/hooks/use-history.ts` → `lib/domain/history-window.ts` → storage
- **Bun only** for scripts/tests (`bun run test` / `bun test`)

### Product / FR closure

| FR | This story | Later |
| --- | --- | --- |
| **FR-4** | Completes History stretch **visibility** (partial FR-4 with 3.1) | — |
| **FR-15** | Shows completed sessions in History | **4.4** writes session on Player complete |
| **FR-5** | Unchanged — summary counts workouts only | — |

Epic 4 Story 4.4 AC expects: after logging a session, History shows today’s stretch indicator (**this story**). 3.3 is display-only.

### UX / DESIGN (source of truth)

Mockup `history-calendar.html` does **not** yet draw the stretch dot — follow **DESIGN.md** + epics AC, not the incomplete HTML.

| Surface | Spec |
| --- | --- |
| Calendar | Secondary dot under date; `day-cell-stretch.dot` → `#737373` |
| List | “Estiramientos ✓” when applicable |
| Combined day | Both workout green signal and stretch signal visible |
| Don't | Use workout green for stretch; conflate meanings; edit past days |

Tokens: `accent-stretch: #737373`, `accent-stretch-muted: #F5F5F5`. Inline hex OK (same pattern as 3.1/3.2 calendar greens). Do **not** reuse category-chip green styling for stretch.

### Current code state (UPDATE targets — `feat/epic-3-history`)

**`HistoryListRow` today** — no stretch flag:

```ts
export type HistoryListRow = {
  date: string;
  isToday: boolean;
  workoutDay?: WorkoutDay;
};
```

**`useHistory()` today** — indexes only `workoutDays`; exposes `workoutByDate`, `listRows`, `summaryCount` (workout-only). Extend; do not fork.

**`HistoryCalendar` today** — props `{ cells, workoutByDate }`; registered = green + short label; no dot.

**`HistoryList` today** — single right-side span: category **or** `noWorkout`. Must evolve so stretch can appear **alongside** workout status.

**Already available (main / 1.2) — REUSE, do not reinvent:**

| Asset | Path |
| --- | --- |
| `StretchSession` type | `lib/domain/types.ts` |
| Schema + sanitize | `lib/storage/schema.ts` |
| `addStretchSession` (append, AD-3) | `lib/storage/exercise-log-repository.ts` |
| Reactive log | `lib/hooks/use-exercise-log.ts` |

### Scope boundaries — do NOT implement

- Stretch Player, daily stretch card, routines JSON (Epic 4 / 4.1–4.3)
- Persisting sessions from UI / completing routines (Story **4.4** / FR-15 write path)
- Showing `routineType` / `routineId` in History
- Counting stretches in “X de 30”
- Editing/deleting past workouts or sessions from History
- New shadcn Badge component
- Fixing deferred midnight `todayDate` rollover (inherited from 2.1 / 3.2)
- Unifying hardcoded hex into CSS variables (deferred pattern)

### Suggested file structure

```
lib/domain/history-window.ts            # UPDATE — stretch index + list row flag
lib/domain/history-window.test.ts       # UPDATE
lib/hooks/use-history.ts                # UPDATE — expose stretchDates / wire listRows
lib/copy/es.ts                          # UPDATE — stretchCompleted (+ optional aria)
lib/copy/es.test.ts                     # UPDATE
components/history/history-calendar.tsx # UPDATE — neutral dot
components/history/history-list.tsx     # UPDATE — Estiramientos ✓
components/history/history-view.tsx     # UPDATE — pass stretchDates (if needed)
```

**NEW files:** none required (optional tiny presentational helper only if it stays trivial).

**Do not modify** for this story: `exercise-log-repository.ts`, `schema.ts`, `types.ts` (import only), Home mark/unmark, summary math, view toggle prefs.

### Testing approach

- Vitest domain tests in `history-window.test.ts` (primary) — no RTL (consistent with 3.1/3.2)
- Seed sessions with `exerciseLogRepository.addStretchSession(...)` in tests when needed
- Assert presence boolean semantics for multi-session same day
- Guard regression: stretch-only days must not increase `countWorkoutDaysInRange`
- Quality gates: `bun run test`, `bun run lint`, `bun run build`

### Previous story intelligence (3.2)

- Explicitly deferred stretch indicator to **this story** — now implement it
- Preserve ARIA tablist/tabpanel/`aria-controls` wiring patched in 3.2 review
- Keep `setHistoryView` no-op when view unchanged
- List = 30 `windowDates` only (newest first); calendar keeps padding cells
- List uses full category labels; calendar keeps `getCategoryShortLabel`
- Reactive updates already flow through `useExerciseLog` — stretch reads will update automatically when 4.4 writes later

### Git intelligence

- Recent Epic 3 commit (`d9d037c`) added History domain, hook, calendar, list, toggle — **baseline for this story**
- `main` tip still Epic 2 merge — confirm base before branching
- No new dependencies expected

### Project context reference

Follow `docs/project-context.md`: Bun exclusive, Spanish UI via `lib/copy/es.ts`, WorkoutDay ≠ StretchSession, repository-only persistence, Vitest colocated tests.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.3]
- [Source: _bmad-output/planning-artifacts/prds/prd-exercise-app-2026-07-11/prd.md#FR-4]
- [Source: _bmad-output/planning-artifacts/prds/prd-exercise-app-2026-07-11/prd.md#FR-15]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/DESIGN.md#day-cell-stretch]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/EXPERIENCE.md#History-View]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md#AD-3]
- [Source: _bmad-output/implementation-artifacts/3-2-calendar-list-toggle.md]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

## Change Log

- 2026-07-17: Story 3.3 created — ultimate context for Stretch Session indicator in History (ready-for-dev)
