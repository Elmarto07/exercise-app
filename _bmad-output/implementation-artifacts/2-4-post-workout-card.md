---
baseline_commit: NO_VCS
---

# Story 2.4: Tarjeta Post-Workout Suggestion condicional

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want a cooldown stretch suggestion after tagging my workout type,
So that I stretch the right muscles post-training (FR-8, AD-5, UX-DR4).

## Acceptance Criteria

1. **Given** today registered with category piernas|torso|cardio|cuerpo-completo **When** category is saved **Then** Post-Workout card appears within 1s without network (NFR-2)
2. **And** card shows routine title, duration estimate, "Estirar ahora" and "Ahora no"
3. **And** "Estirar ahora" navigates to `/stretch/[routineId]` for mapped post-workout routine
4. **Given** category is `no-especificado` **When** Home renders **Then** Post-Workout card is not shown
5. **And** Daily stretch card remains available below (Epic 4 placeholder — keep existing section)
6. **And** "Ahora no" dismisses card for current category/session without blocking Home navigation (UX-DR4)
7. **And** card uses secondary CTA styling for "Estirar ahora" — not primary green fill (UX-DR4)

## Tasks / Subtasks

- [x] Task 1: Stretch resolver + minimal routine data (AC: 2, 3)
  - [x] Create `data/stretch-routines.json` with post-workout routine stubs (id, title, durationMinutes, meta, empty exercises[]) — enough for card + navigation; Story 4.1 expands exercises
  - [x] Create `lib/services/stretch-resolver.ts` with `CATEGORY_TO_POST_ROUTINE_ID` map and `getPostWorkoutRoutine(category: ConcreteWorkoutCategory)`
  - [x] Unit tests in `lib/services/stretch-resolver.test.ts`
- [x] Task 2: Copy strings (AC: 2)
  - [x] Add `copy.home.dismissPostWorkout` ("Ahora no") to `lib/copy/es.ts`; reuse `home.stretchNow`
  - [x] Extend `lib/copy/es.test.ts`
- [x] Task 3: PostWorkoutCard component (AC: 1–3, 6–7)
  - [x] Create `components/home/post-workout-card.tsx` (`"use client"`)
  - [x] Props: `category: ConcreteWorkoutCategory`, `onDismiss: () => void`
  - [x] Render card per DESIGN.md: white/raised, rounded-xl, border, title, meta (~N min · muscles), secondary "Estirar ahora" Link to `/stretch/[routineId]`, ghost "Ahora no"
  - [x] Min tap targets ≥44px on actions
- [x] Task 4: Wire Home visibility (AC: 1, 4, 5, 6)
  - [x] Extend `components/home/home-workout-section.tsx` — show `PostWorkoutCard` when `isTodayMarked && isConcreteCategory(todayWorkoutDay.category) && !dismissed`
  - [x] Session dismiss state: `dismissedCategory` — set on "Ahora no"; reset when category changes or unmark
  - [x] Card appears immediately after chip selection (same render cycle via repository subscribe)
  - [x] Do NOT hide daily stretch card in `app/page.tsx`
- [x] Task 5: Quality gates (AC: 1–7)
  - [x] `bun run test`, `bun run lint`, `bun run build` pass
  - [x] Manual: mark → select Piernas → post-workout card visible with correct title
  - [x] Manual: Omitir → no post-workout card; daily card still visible
  - [x] Manual: "Ahora no" hides card; select different category shows card again

### Review Findings

- [x] [Review][Defer] `/stretch/[routineId]` returns 404 until Story 4.3 [`components/home/post-workout-card.tsx:34`] — deferred, navigation wired per AC; player out of scope
- [x] [Review][Defer] Dismiss state is session-only; reload re-shows card [`components/home/home-workout-section.tsx:14`] — deferred, accepted in story Dev Notes scope
- [x] [Review][Defer] Card not hidden when post-workout stretch session already logged today [`components/home/home-workout-section.tsx:24`] — deferred, EXPERIENCE cold-open nuance; needs Story 4.4 stretch session flow

## Senior Developer Review (AI)

**Review outcome:** Approve  
**Review date:** 2026-07-12  
**Layers:** Blind Hunter, Edge Case Hunter, Acceptance Auditor

### Summary

Implementation satisfies all 7 acceptance criteria. AD-4/AD-5/AD-6/AD-9 verified. Post-workout card gated correctly via `isConcreteCategory`; secondary CTA styling matches UX-DR4 (outline, not green fill). Resolver maps all four categories with tests. No blocking patches.

### Action Items

- [x] [Defer] Stretch player route 404 — Story 4.3
- [x] [Defer] Session-only dismiss — accepted MVP scope
- [x] [Defer] Hide after stretch session completed — Story 4.4 integration

## Dev Notes

### Architecture compliance (MUST)

- **AD-4:** Routine metadata from `data/stretch-routines.json` imported at build — no fetch
- **AD-5:** Render `PostWorkoutCard` only when `isConcreteCategory(todayWorkoutDay.category)` — never for `no-especificado`
- **AD-6:** Client component; use `next/link` for navigation (no Server Actions)
- **AD-9:** `components/home/` → `lib/services/stretch-resolver.ts` → `data/stretch-routines.json`

### UX / DESIGN (UX-DR4)

From DESIGN.md § Tarjeta Post-Workout Suggestion + mockup `home-today-marked.html`:

| Element | Spec |
| --- | --- |
| Visibility | Only concrete category on today's Workout Day |
| Layout | Below category chips / mark section; max ~40% viewport |
| Surface | white, rounded-xl (md), hairline border |
| Title | e.g. "Estiramiento post-piernas" |
| Meta | ~4 min · muscle groups (13px muted) |
| Estirar ahora | **Secondary** button (outline/border) — NOT primary green fill |
| Ahora no | Ghost/text button, muted |
| Dismiss | Non-blocking; session dismiss per category |

Routine IDs per architecture: `post-piernas`, `post-torso`, `post-cardio`, `post-cuerpo-completo`.

### Existing code to REUSE

| Asset | Path | Use |
| --- | --- | --- |
| Category guard | `lib/domain/categories.ts` | `isConcreteCategory()` |
| Today hook | `lib/hooks/use-today.ts` | `todayWorkoutDay.category` |
| Home section | `components/home/home-workout-section.tsx` | extend with post-workout card |
| Copy | `lib/copy/es.ts` | `stretchNow`, add `dismissPostWorkout` |
| Daily card | `app/page.tsx` | keep unchanged below workout section |

### Scope boundaries — do NOT implement

- Full exercise content in JSON (Story 4.1)
- Stretch Player page (Story 4.3) — navigation target only; 404 acceptable until 4.3
- Persist dismiss across reloads (no schema change; session dismiss OK)
- Daily stretch card wiring/navigation (Story 4.2)

### Suggested file structure

```
data/stretch-routines.json                 # NEW — post-workout stubs
lib/services/stretch-resolver.ts           # NEW
lib/services/stretch-resolver.test.ts      # NEW
lib/copy/es.ts                             # UPDATE
lib/copy/es.test.ts                        # UPDATE
components/home/post-workout-card.tsx      # NEW
components/home/home-workout-section.tsx   # UPDATE
```

### Testing approach

- Vitest for resolver mapping (all 4 categories → correct routineId/title)
- No component RTL tests (consistent with 2.1–2.3)

### Previous story intelligence (2.3)

- `HomeWorkoutSection` orchestrates mark + category chips — add post-workout below selector
- Card shows after category select in same session; cold open with concrete category also shows
- `isConcreteCategory()` already exists for AD-5 gate

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.4]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/DESIGN.md#Tarjeta-Post-Workout-Suggestion]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md#AD-4, AD-5]
- [Source: _bmad-output/implementation-artifacts/2-3-category-chips.md]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

- PowerShell: use `;` not `&&` for chained commands

### Implementation Plan

- Created post-workout routine stubs in JSON and `stretch-resolver` service with category→routineId mapping
- Built `PostWorkoutCard` with secondary CTA Link and ghost dismiss
- Wired conditional visibility in `HomeWorkoutSection` via `isConcreteCategory` + session dismiss state

### Completion Notes List

- Post-workout card appears when today has concrete category; hidden for `no-especificado`
- "Estirar ahora" links to `/stretch/post-{category}`; player page deferred to Story 4.3
- "Ahora no" dismisses per category in session; resets on unmark
- Daily stretch card unchanged in `app/page.tsx`
- 31 tests pass; lint and build green

### File List

- data/stretch-routines.json
- lib/services/stretch-resolver.ts
- lib/services/stretch-resolver.test.ts
- lib/copy/es.ts
- lib/copy/es.test.ts
- components/home/post-workout-card.tsx
- components/home/home-workout-section.tsx

## Change Log

- 2026-07-12: Story 2.4 created — post-workout suggestion card dev context
- 2026-07-12: Story 2.4 implemented — conditional post-workout card on Home
- 2026-07-12: Code review approved — story marked done; Epic 2 stories complete
