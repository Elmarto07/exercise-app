---
baseline_commit: NO_VCS
---

# Story 2.3: Selector Workout Category

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to optionally tag what I trained,
So that post-workout stretches match my session (FR-14, UX-DR3).

## Acceptance Criteria

1. **Given** I just marked today **When** category chips appear **Then** I see Piernas, Torso, Cardio, Cuerpo completo and Omitir
2. **And** one tap selects and persists category on today's Workout Day
3. **And** Omitir persists `no-especificado` and closes chip block
4. **And** last selected concrete category is stored in `prefs.lastCategory` as suggestion for next session
5. **And** chip tap targets are ≥44px (UX-DR3, UX-DR10)
6. **And** chips are inline below the mark button — not a blocking modal (DESIGN.md § Chips de Workout Category)
7. **And** on cold open with today already registered (category chosen or omitted), chips do NOT reappear

## Tasks / Subtasks

- [x] Task 1: Copy and category domain helpers (AC: 1, 4)
  - [x] Add `copy.home.categoryPrompt`, `copy.home.categories.*`, `copy.home.omitCategory` to `lib/copy/es.ts`
  - [x] Export `WORKOUT_CATEGORY_OPTIONS` (concrete categories in display order) from `lib/domain/categories.ts`
  - [x] Export `getCategoryLabel(category)` using copy map (or labels colocated in categories.ts referencing copy keys)
  - [x] Extend `lib/copy/es.test.ts` for new strings
- [x] Task 2: Hook — selectTodayCategory / omitTodayCategory (AC: 2, 3, 4)
  - [x] Add `selectTodayCategory(category: WorkoutCategory)` in `lib/hooks/use-today.ts` — calls `markWorkoutDay(today, category)` + `updatePrefs({ lastCategory: category })` when category is concrete
  - [x] Add `omitTodayCategory()` — ensures today's entry stays `no-especificado` (idempotent upsert); does NOT overwrite `prefs.lastCategory`
  - [x] Expose both from `useToday()` return
  - [x] Unit tests in `lib/hooks/use-today.test.ts` with localStorage mock
- [x] Task 3: WorkoutCategorySelector component (AC: 1–7)
  - [x] Create `components/home/workout-category-selector.tsx` (`"use client"`)
  - [x] Props: `visible: boolean`, `onDismiss: () => void`, `suggestedCategory` from `log.prefs.lastCategory`
  - [x] Render label + flex-wrap chips per DESIGN.md chip-category tokens (rounded-full, min-h-11, muted green when suggested)
  - [x] Concrete chip tap → `selectTodayCategory(id)` → `onDismiss()`
  - [x] Omitir chip (dashed border, muted) → `omitTodayCategory()` → `onDismiss()`
  - [x] `role="radiogroup"` + `aria-label` on group; each chip `role="radio"` + `aria-checked` when suggested/selected
- [x] Task 4: Wire Home workout section (AC: 1, 3, 7)
  - [x] Create `components/home/home-workout-section.tsx` wrapping mark button + category selector
  - [x] On successful mark (unmarked → marked): set `showCategorySelector=true`
  - [x] Show selector when `isTodayMarked && showCategorySelector && todayWorkoutDay.category === 'no-especificado'`
  - [x] On dismiss (select or omit): set `showCategorySelector=false`
  - [x] Update `app/page.tsx` — replace `<WorkoutMarkButton />` with `<HomeWorkoutSection />`
  - [x] Do NOT wire post-workout card (Story 2.4)
- [x] Task 5: Quality gates (AC: 1–7)
  - [x] `bun test`, `bun run lint`, `bun run build` pass
  - [x] Manual: mark → chips appear → select Piernas → chips close → reload → chips stay hidden, category persisted
  - [x] Manual: mark → Omitir → chips close → reload → no chips, category `no-especificado`
  - [x] Manual: second mark session pre-highlights last concrete category from prefs

### Review Findings

- [x] [Review][Patch] Suggested chip uses `aria-checked={true}` before user selects [`components/home/workout-category-selector.tsx:63`] — fixed: all chips use `aria-checked={false}` until tap; suggestion is visual-only
- [x] [Review][Defer] Midnight rollover stale `todayDate` affects category selection [`lib/hooks/use-today.ts:44`] — deferred, inherited from Story 2.1
- [x] [Review][Defer] Reload between mark and chip tap hides selector with `no-especificado` [`components/home/home-workout-section.tsx:16`] — deferred, accepted in story Dev Notes edge case
- [x] [Review][Defer] Hardcoded hex colors on chips instead of CSS tokens [`components/home/workout-category-selector.tsx:68`] — deferred, same pattern as Stories 2.1/2.2

## Senior Developer Review (AI)

**Review outcome:** Approve  
**Review date:** 2026-07-12  
**Layers:** Blind Hunter, Edge Case Hunter, Acceptance Auditor

### Summary

Implementation satisfies all 7 acceptance criteria. Architecture compliance verified (AD-1, AD-2, AD-6, AD-8, AD-9). Category flow correctly orchestrated via `HomeWorkoutSection` session flag; repository mutations isolated. Accessibility patch applied: suggestion styling is visual-only; chips report `aria-checked={false}` until user selects.

### Action Items

- [x] [Patch] Remove `aria-checked={true}` on suggested-only chips — applied in review
- [x] [Defer] Midnight rollover — inherited from 2.1
- [x] [Defer] Reload mid-selection — accepted edge case per Dev Notes
- [x] [Defer] Hardcoded chip colors — consistent with existing Home components

## Dev Notes

### Architecture compliance (MUST)

- **AD-1:** Category mutations only via `exerciseLogRepository.markWorkoutDay()` + `updatePrefs()` — never localStorage in components
- **AD-2:** Use `todayLocalDate()` for all today mutations
- **AD-5:** Do NOT render Post-Workout card in this story — `isConcreteCategory()` exists for Story 2.4
- **AD-6:** Selector = client component; no Server Actions
- **AD-8:** Repository upsert on same date — selecting category updates existing today's entry, does not duplicate
- **AD-9:** `components/home/` → `lib/hooks/use-today.ts` → `lib/storage/exercise-log-repository.ts`

### UX / DESIGN (UX-DR3)

From DESIGN.md § Chips de Workout Category + mockup `home-today-marked.html`:

| Element | Spec |
| --- | --- |
| Layout | Inline below mark CTA; flex-wrap gap-2; NOT modal |
| Label | Meta text ~13px muted — "¿Qué entrenaste?" |
| Chip default | white/`surface-raised`, hairline border, rounded-full, min-h 44px, px-4 |
| Chip suggested | `accent-success-muted` bg + green border (lastCategory pre-highlight) |
| Chip selected tap | Same muted green — persists and closes block |
| Omitir | dashed border, muted text, same min height |
| Behavior | Radio — one tap selects; Omitir closes without concrete category |

Flow timing: full mark → category flow ≤7s median (FR-14) — keep UI immediate, no network.

### Chip visibility state machine

```
Cold open, unmarked → no chips
Tap mark → registered + showCategorySelector=true → chips visible (category=no-especificado)
Tap concrete chip → persist category + lastCategory + showCategorySelector=false
Tap Omitir → persist no-especificado + showCategorySelector=false (lastCategory unchanged)
Cold open, marked with category≠no-especificado → no chips
Cold open, marked with no-especificado (prior omit) → no chips (showCategorySelector=false on mount)
Unmark → clears today entry → showCategorySelector=false
```

**Edge case (accepted):** reload between mark and chip selection hides chips with category still `no-especificado` — same as omit-on-cold-open; user can still use app; Story 2.4 post-workout won't show until concrete category (deferred).

### Existing code to REUSE (do NOT reinvent)

| Asset | Path | Use |
| --- | --- | --- |
| Repository | `lib/storage/exercise-log-repository.ts` | `markWorkoutDay(date, category)`, `updatePrefs({ lastCategory })` |
| Category guard | `lib/domain/categories.ts` | `isConcreteCategory()` — reuse set for WORKOUT_CATEGORY_OPTIONS |
| Types | `lib/domain/types.ts` | `WorkoutCategory` enum values |
| Hook | `lib/hooks/use-today.ts` | extend with category selection helpers |
| Button | `components/home/workout-mark-button.tsx` | keep as-is; lift orchestration to HomeWorkoutSection |
| Copy pattern | `lib/copy/es.ts` | Spanish labels centralized |

### Scope boundaries — do NOT implement

- Post-workout suggestion card (Story 2.4)
- History category display (Story 3.1)
- Schema v1 changes (no new WorkoutDay fields)
- shadcn ToggleGroup — use native buttons styled per DESIGN (consistent with 2.1/2.2)

### Suggested file structure

```
lib/copy/es.ts                              # UPDATE — category labels + prompt
lib/copy/es.test.ts                         # UPDATE
lib/domain/categories.ts                    # UPDATE — WORKOUT_CATEGORY_OPTIONS export
lib/hooks/use-today.ts                      # UPDATE — selectTodayCategory, omitTodayCategory
lib/hooks/use-today.test.ts                 # UPDATE — category selection tests
components/home/workout-category-selector.tsx  # NEW
components/home/home-workout-section.tsx       # NEW — orchestrates mark + chips
components/home/workout-mark-button.tsx        # UPDATE — optional onMarked callback prop
app/page.tsx                                   # UPDATE — HomeWorkoutSection
```

### Testing approach

- Vitest, colocated `*.test.ts`, `environment: "node"`
- Test `selectTodayCategory('piernas')` persists workout day + `prefs.lastCategory`
- Test `omitTodayCategory()` keeps `no-especificado` and preserves prior `lastCategory`
- Repository upsert already tested in 1.2 — hook tests validate wiring
- No RTL/component tests required (consistent with 2.1/2.2)
- Run `bun run test` per package.json script

### Previous story intelligence (2.2)

- `WorkoutMarkButton` handles mark/unmark dialog — extend with optional `onMarked?: () => void` callback fired after markToday (not on unmark)
- Registered styling complete — do not change CTA visual states
- Thin hook wrappers over repository — mirror pattern from `markToday`/`unmarkToday`
- Midnight rollover stale date deferred — same limitation applies

### Git intelligence

- No git commits yet; preserve `baseline_commit: NO_VCS` or capture via `git rev-parse HEAD` if commits exist

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.3]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/DESIGN.md#Chips-de-Workout-Category]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/EXPERIENCE.md#Category-chips]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/mockups/home-today-marked.html]
- [Source: docs/project-context.md]
- [Source: _bmad-output/implementation-artifacts/2-2-unmark-workout.md]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

- PowerShell: use `;` not `&&` for chained commands

### Implementation Plan

- Added category copy strings and `WORKOUT_CATEGORY_OPTIONS` domain export
- Implemented `selectTodayCategory` / `omitTodayCategory` hook helpers with repository wiring
- Built `WorkoutCategorySelector` with inline chips per DESIGN.md; orchestrated via `HomeWorkoutSection`
- Extended `WorkoutMarkButton` with `onMarked` / `onUnmarked` callbacks for chip visibility state

### Completion Notes List

- Category chips appear inline after mark when category is still `no-especificado`
- Concrete selection persists workout category + updates `prefs.lastCategory`
- Omitir keeps `no-especificado` without overwriting last suggestion
- Cold open does not show chips (session flag `showCategorySelector` false on mount)
- 28 tests pass; lint and build green

### File List

- lib/copy/es.ts
- lib/copy/es.test.ts
- lib/domain/categories.ts
- lib/domain/categories.test.ts
- lib/hooks/use-today.ts
- lib/hooks/use-today.test.ts
- components/home/workout-category-selector.tsx
- components/home/home-workout-section.tsx
- components/home/workout-mark-button.tsx
- app/page.tsx

## Change Log

- 2026-07-12: Story 2.3 created — comprehensive dev context for Workout Category selector
- 2026-07-12: Story 2.3 implemented — category chips selector wired on Home
- 2026-07-12: Code review approved — aria-checked patch applied; story marked done
- 2026-07-12: Re-run code review — clean; no new findings after patch
