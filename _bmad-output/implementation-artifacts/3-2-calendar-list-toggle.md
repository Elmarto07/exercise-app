---
baseline_commit: NO_VCS
---

# Story 3.2: Toggle calendario / lista

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to switch between calendar and list views,
So that I can scan history the way I prefer (FR-6).

## Acceptance Criteria

1. **Given** History View is open **When** I tap **Lista** segment **Then** I see rows with date + category for each day in the 30-day range
2. **When** I switch back to **Calendario** **Then** the same data appears in grid form (Story 3.1 calendar)
3. **And** my preference persists in `prefs.historyView` across sessions (reload preserves choice)
4. **And** summary "X de 30 días" remains visible in both views (unchanged from 3.1)
5. **And** toggle uses segmented control styling per mockup `history-calendar.html` (UX-DR5 adjacent)
6. **And** list rows show full category label from copy for registered days; unregistered days show date with neutral empty state (no fake category)
7. **And** switching views updates immediately without page reload; data stays in sync with repository (mark/unmark on Home reflected)

## Tasks / Subtasks

- [x] Task 1: Copy and category display helpers (AC: 1, 6)
  - [x] Add `copy.history.viewCalendar`, `copy.history.viewList`, `copy.history.listLabel`, `copy.history.noWorkout` (or equivalent) to `lib/copy/es.ts`
  - [x] Add `getCategoryDisplayLabel(category: WorkoutCategory)` using `copy.home.categories` + `no-especificado` label (e.g. "no especificado") — replace short labels in list; keep `getCategoryShortLabel` for calendar cells
  - [x] Add `formatHistoryListDate(date: string): string` in `lib/domain/dates.ts` or `history-window.ts` — Spanish long date for list rows (e.g. "Sábado, 12 de julio")
  - [x] Extend `lib/copy/es.test.ts` and date/history tests
- [x] Task 2: Domain list rows builder (AC: 1)
  - [x] Add `HistoryListRow` type and `buildHistoryListRows(windowDates, today)` in `lib/domain/history-window.ts`
  - [x] Order: **newest first** (today at top) — reverse chronological within 30-day window
  - [x] One row per window date; attach `workoutDay` when registered
  - [x] Unit tests in `lib/domain/history-window.test.ts`
- [x] Task 3: Hook — historyView from prefs (AC: 2, 3, 7)
  - [x] Extend `useHistory()` to expose `historyView: HistoryView` from `log.prefs.historyView`
  - [x] Add `setHistoryView(view: HistoryView)` calling `exerciseLogRepository.updatePrefs({ historyView: view })`
  - [x] Expose `listRows` from `buildHistoryListRows`
  - [x] Optional thin test: updatePrefs historyView persists (repository already tested in 1.2)
- [x] Task 4: HistoryViewToggle component (AC: 1–3, 5)
  - [x] Create `components/history/history-view-toggle.tsx` (`"use client"`)
  - [x] Segmented control: Calendario | Lista — mockup styles (rounded-xl track `#E5E5E5`, active segment white + shadow)
  - [x] `role="tablist"` or two buttons with `aria-selected` / `aria-pressed`; min tap targets ≥44px
  - [x] On tap → `setHistoryView('calendar' | 'list')`
- [x] Task 5: HistoryList component (AC: 1, 6)
  - [x] Create `components/history/history-list.tsx`
  - [x] Render rows: formatted date + category label (registered) or muted empty state (unregistered)
  - [x] Highlight today row subtly (ring or bold) consistent with calendar today treatment
  - [x] Do NOT add stretch session indicator (Story 3.3)
- [x] Task 6: Wire HistoryView (AC: 1–7)
  - [x] Update `components/history/history-view.tsx` — insert toggle below summary
  - [x] Conditionally render `HistoryCalendar` vs `HistoryList` based on `historyView`
  - [x] Default view from prefs (`calendar` default in schema)
- [x] Task 7: Quality gates (AC: 1–7)
  - [x] `bun run test`, `bun run lint`, `bun run build` pass
  - [x] Manual: Lista → 30 rows, registered show category; Calendario → same data in grid
  - [x] Manual: switch to Lista, reload → still Lista; mark today on Home, return → both views updated

### Review Findings

- [x] [Review][Patch] Incomplete WAI-ARIA tabs pattern — missing `tabpanel`, `aria-controls`, tab `id`s, and `tabIndex` on inactive tabs [`components/history/history-view-toggle.tsx:21`, `components/history/history-view.tsx:39`]
- [x] [Review][Patch] `getCategoryDisplayLabel` tests cover only 2 of 5 categories — story testing approach requires all categories including `cuerpo-completo` [`lib/domain/history-window.test.ts:62`]
- [x] [Review][Patch] `setHistoryView` persists on re-click of already-active tab — unnecessary localStorage write and subscriber notify [`lib/hooks/use-history.ts:15`]
- [x] [Review][Defer] Hardcoded hex `#E5E5E5` on toggle track [`components/history/history-view-toggle.tsx:24`] — deferred, same pattern as calendar (3.1)
- [x] [Review][Defer] Midnight rollover stale `todayDate` in `useHistory` [`lib/hooks/use-history.ts:21`] — deferred, inherited from Story 2.1

## Senior Developer Review (AI)

**Review outcome:** Approve (with minor patch items)  
**Review date:** 2026-07-12  
**Layers:** Blind Hunter, Edge Case Hunter, Acceptance Auditor

### Summary

All 7 acceptance criteria satisfied. Toggle Calendario | Lista with prefs persistence via `updatePrefs`; list view shows 30 reverse-chronological rows with Spanish dates and full category labels; summary remains visible in both views; reactive sync via `useExerciseLog`. AD-1/AD-2/AD-6/AD-9 compliance verified. Three low-severity patch items (a11y tabs pattern, test coverage gap, redundant persist guard). Two inherited defers (hex colors, midnight rollover).

### Action Items

- [x] [Patch] WAI-ARIA tabs — add tabpanel + aria-controls linkage
- [x] [Patch] Extend getCategoryDisplayLabel tests to all categories
- [x] [Patch] Guard setHistoryView when view unchanged
- [x] [Defer] Hardcoded toggle track color — consistent with project
- [x] [Defer] Midnight rollover — inherited

## Dev Notes

### Architecture compliance (MUST)

- **AD-1:** View preference only via `exerciseLogRepository.updatePrefs({ historyView })` — never localStorage in components
- **AD-2:** Reuse `getHistoryWindowDates(todayLocalDate())` — same 30-day window as 3.1
- **AD-6:** Client components; no Server Actions
- **AD-9:** `components/history/` → `lib/hooks/use-history.ts` → `lib/domain/history-window.ts` → repository

### UX / DESIGN

From mockup `history-calendar.html` § toggle:

| Element | Spec |
| --- | --- |
| Track | `#E5E5E5`, rounded-xl, padding 4px |
| Segment | flex 1, padding 10px, 14px font, inactive muted |
| Active | white bg, `#171717` text, subtle shadow |
| Placement | Below summary, above calendar/list content |

List view (EXPERIENCE.md UJ-2): fecha + categoría por fila en rango 30 días. Full category names in list (not 8px abbreviations).

### List row content rules

| Day state | Row shows |
| --- | --- |
| Registered | Spanish formatted date + category label (`Piernas`, `no especificado`, etc.) |
| Unregistered | Spanish formatted date + muted dash or `copy.history.noWorkout` |
| Today | Same data + today highlight |

**Do NOT** show rows for padding days outside 30-day window — only `windowDates` (30 entries), unlike calendar grid padding cells.

### Existing code to REUSE (do NOT reinvent)

| Asset | Path | Use |
| --- | --- | --- |
| Window + count | `lib/domain/history-window.ts` | `getHistoryWindowDates`, `countWorkoutDaysInRange`, `indexWorkoutDaysByDate` |
| Calendar | `components/history/history-calendar.tsx` | keep unchanged; show when `historyView === 'calendar'` |
| Summary | `components/history/history-summary.tsx` | keep above toggle |
| Hook pattern | `lib/hooks/use-history.ts` | extend, don't duplicate window logic |
| Prefs schema | `lib/storage/schema.ts` | `historyView: 'calendar' \| 'list'` already validated |
| Repository | `exercise-log-repository.ts` | `updatePrefs` already merges partial prefs |

### Scope boundaries — do NOT implement

- Stretch session dot / "Estiramientos ✓" (Story 3.3)
- Editing past workout days from list
- shadcn Tabs — use native buttons per mockup (consistent with 2.x chip pattern)

### Suggested file structure

```
lib/copy/es.ts                          # UPDATE — toggle + list labels
lib/copy/es.test.ts                     # UPDATE
lib/domain/dates.ts                     # UPDATE — formatHistoryListDate (optional location)
lib/domain/history-window.ts            # UPDATE — buildHistoryListRows, getCategoryDisplayLabel
lib/domain/history-window.test.ts       # UPDATE
lib/hooks/use-history.ts                # UPDATE — historyView, setHistoryView, listRows
components/history/history-view-toggle.tsx  # NEW
components/history/history-list.tsx         # NEW
components/history/history-view.tsx           # UPDATE — toggle + conditional views
```

### Testing approach

- Vitest unit tests for `buildHistoryListRows` (30 rows, order, workout attachment)
- Test `getCategoryDisplayLabel` maps all categories including `no-especificado`
- Repository `historyView` pref already covered in 1.2 — hook wiring manual AC check
- No RTL component tests (consistent with 3.1)

### Previous story intelligence (3.1)

- `useHistory()` + `useExerciseLog()` gives reactive updates — extend, don't fork
- Review deferred unifying category labels — **implement full labels in list now**
- Calendar keeps `getCategoryShortLabel` for tiny cells
- Midnight rollover stale `todayDate` deferred — same limitation applies

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-3.2]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/mockups/history-calendar.html]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/EXPERIENCE.md#History-View]
- [Source: _bmad-output/implementation-artifacts/3-1-history-summary-calendar.md]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

- Fixed TS build error: narrow `row.workoutDay` before accessing `.category` in `history-list.tsx`

### Completion Notes List

- Toggle segmentado Calendario | Lista con persistencia en `prefs.historyView` vía `updatePrefs`
- Lista: 30 filas ordenadas de más reciente a más antigua con fecha formateada (es-ES) y etiqueta de categoría completa
- Días sin registro muestran `copy.history.noWorkout`; hoy resaltado con ring consistente con calendario
- Resumen "X de 30 días" visible en ambas vistas; cambio de vista reactivo sin recarga
- Tests: `buildHistoryListRows`, `getCategoryDisplayLabel`, `formatHistoryListDate`, copy strings
- Quality gates: 40 tests pass, lint clean, build OK

### File List

- lib/copy/es.ts
- lib/copy/es.test.ts
- lib/domain/dates.ts
- lib/domain/dates.test.ts
- lib/domain/history-window.ts
- lib/domain/history-window.test.ts
- lib/hooks/use-history.ts
- components/history/history-view-toggle.tsx
- components/history/history-list.tsx
- components/history/history-view.tsx
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log

- 2026-07-12: Story 3.2 created — calendar/list toggle dev context
- 2026-07-12: Story 3.2 implemented — toggle, list view, prefs persistence, tests; status → review
- 2026-07-12: Code review — Approve with 3 patch items, 2 defers; 5 findings dismissed as noise/out-of-scope
- 2026-07-12: Code review patches applied — WAI-ARIA tabs, full category tests, setHistoryView guard; status → done
