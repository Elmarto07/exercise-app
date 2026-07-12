# Story 3.1: History View — resumen y calendario 30 días

Status: done

## Summary

New `/history` page with 30-day workout summary and calendar grid. Reactive via `useExerciseLog`.

## Acceptance Criteria

1. **Given** I navigate to `/history` from Home link **When** the page loads **Then** summary "X de 30 días" and calendar grid visible
2. **And** registered days green with category label; empty neutral; today ring
3. **And** summary updates on return from Home after mark/unmark (useSyncExternalStore)

## Tasks / Subtasks

- [x] Route `/history` + HistoryView components
- [x] Domain: history-window (30-day range, count, calendar grid)
- [x] Hook: useHistory reactive to repository
- [x] Copy + tests + quality gates

### Review Findings

- [x] [Review][Defer] Midnight rollover stale `todayDate` in useHistory [`lib/hooks/use-history.ts:14`] — deferred, inherited from Story 2.1
- [x] [Review][Defer] Hardcoded hex colors on calendar cells [`components/history/history-calendar.tsx:42`] — deferred, same pattern as Home/Epic 2
- [x] [Review][Defer] Category short labels in domain layer not copy module [`lib/domain/history-window.ts:105`] — deferred, acceptable for 8px cell labels; unify in 3.2 if list view shares labels

## Senior Developer Review (AI)

**Review outcome:** Approve  
**Review date:** 2026-07-12  
**Layers:** Blind Hunter, Edge Case Hunter, Acceptance Auditor

### Summary

All 6 acceptance criteria satisfied. Ventana 30 días inclusive correcta; conteo filtrado por rango; grid alineado a lunes con celdas outside atenuadas; categorías incluyendo `no esp.` en celdas registradas; `aria-live` en resumen para actualizaciones reactivas. AD-1/AD-2/AD-9 compliance verified.

### Action Items

- [x] [Defer] Midnight rollover — inherited
- [x] [Defer] Hardcoded colors — consistent with project
- [x] [Defer] Short labels in domain — minor; revisit in 3.2

## File List

- app/history/page.tsx
- components/history/history-view.tsx
- components/history/history-summary.tsx
- components/history/history-calendar.tsx
- lib/domain/history-window.ts
- lib/domain/history-window.test.ts
- lib/hooks/use-history.ts
- lib/copy/es.ts
- lib/copy/es.test.ts

## Change Log

- 2026-07-12: Story 3.1 implemented
- 2026-07-12: Code review approved — story marked done
