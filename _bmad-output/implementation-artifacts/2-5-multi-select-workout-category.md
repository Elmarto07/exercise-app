---
baseline_commit: 9fe12c957265b6c0744be6b40a1561271bf3e050
---

# Story 2.5: Multi-select Workout Category

Status: review

## Story

As a user,
I want to select one or more training zones after marking today,
So that post-workout stretches match a mixed session (FR-14, FR-8, AD-5).

## Acceptance Criteria

(From approved sprint-change-proposal-2026-07-19)

1. Multi toggle + Listo persists `categories[]` + legacy `category`
2. cuerpo-completo XOR vs zones
3. Omitir → no-especificado, no post card
4. Legacy days still work
5. One post card via `getPostWorkoutRoutineForCategories`
6. History shows multi labels
7. Single-category APIs keep working
8. No v1 log wipe

## Tasks / Subtasks

- [x] Domain helpers + dual-write schema/repository
- [x] Selector multi + Listo; home/post-workout wiring
- [x] Resolver multi → one routine
- [x] History labels
- [x] Tests + quality gates

## Dev Agent Record

### Completion Notes List

- Dual-write `category` + optional `categories[]`; XOR helpers; multi selector with Listo; multi → `post-cuerpo-completo`.

### File List

- `lib/domain/types.ts`
- `lib/domain/categories.ts`
- `lib/domain/categories.test.ts`
- `lib/domain/history-window.ts`
- `lib/storage/schema.ts`
- `lib/storage/exercise-log-repository.ts`
- `lib/hooks/use-today.ts`
- `lib/services/stretch-resolver.ts`
- `components/home/workout-category-selector.tsx`
- `components/home/home-workout-section.tsx`
- `components/home/post-workout-card.tsx`
- `components/history/history-list.tsx`
- `components/history/history-calendar.tsx`

## Change Log

- 2026-07-19: Implemented multi-select; status → review
