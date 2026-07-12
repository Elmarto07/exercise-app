---
baseline_commit: NO_VCS
---

# Story 2.2: Desmarcar Workout Day con confirmación

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want to undo today's workout mark with confirmation,
So that I don't accidentally lose or remove a record (FR-2, UX-DR7).

## Acceptance Criteria

1. **Given** today is registered **When** I tap "Ya registrado — toca para desmarcar" **Then** a dialog asks "¿Quitar el registro de hoy?" with Cancelar / Quitar
2. **And** Cancelar closes dialog without change (workout day remains, UI stays registered)
3. **And** Quitar removes today's Workout Day from repository and Home shows unregistered state ("Marcar entreno de hoy")
4. **And** Stretch Sessions for today are unaffected (AD-3 — repository already isolates arrays)
5. **And** dialog follows UX-DR7: scrim overlay, focus trap, Esc = Cancelar (via Radix AlertDialog)
6. **And** Quitar button uses destructive outline style (`state-danger` #EF4444 outline, no aggressive red fill per DESIGN.md)

## Tasks / Subtasks

- [x] Task 1: Copy and unmarkToday hook (AC: 1, 3, 4)
  - [x] Add `unmarkConfirmTitle`, `cancel`, `confirmUnmark` to `lib/copy/es.ts` under `home` (or `dialogs.unmarkWorkout` namespace)
  - [x] Export `unmarkToday()` in `lib/hooks/use-today.ts` calling `exerciseLogRepository.unmarkWorkoutDay(todayLocalDate())`
  - [x] Expose `unmarkToday` from `useToday()` return object
  - [x] Unit test: `unmarkToday()` removes today's entry but preserves stretch sessions (reuse localStorage mock pattern from repository tests)
  - [x] Extend `lib/copy/es.test.ts` for new strings
- [x] Task 2: AlertDialog primitive (AC: 1, 5, 6)
  - [x] Add shadcn AlertDialog via `bunx shadcn@latest add alert-dialog` → `components/ui/alert-dialog.tsx`
  - [x] Verify Radix focus trap + Esc dismiss; do NOT build custom modal
- [x] Task 3: Unmark confirmation dialog component (AC: 1–6)
  - [x] Create `components/home/unmark-workout-dialog.tsx` (`"use client"`)
  - [x] Props: `open`, `onOpenChange`, `onConfirm` (calls `unmarkToday` then closes)
  - [x] Title: copy unmark confirm question; Cancelar = AlertDialogCancel (secondary); Quitar = AlertDialogAction with `variant="outline"` + destructive border/text classes per DESIGN
  - [x] Min tap targets ≥44px on action buttons
- [x] Task 4: Wire WorkoutMarkButton (AC: 1–3)
  - [x] When `isTodayMarked`, `onClick` opens dialog (`setOpen(true)`) — do NOT call unmark directly
  - [x] Render `<UnmarkWorkoutDialog open={...} onOpenChange={...} onConfirm={unmarkToday} />`
  - [x] After confirm, `useSyncExternalStore` re-render shows unmarked CTA automatically
  - [x] Do NOT wire category chips, post-workout card (Stories 2.3–2.4)
- [x] Task 5: Quality gates (AC: 1–6)
  - [x] `bun test`, `bun run lint`, `bun run build` pass
  - [x] Manual: mark → tap registered → Cancelar → still registered; Quitar → unregistered; reload confirms; stretch session same day survives unmark

### Review Findings

- [x] [Review][Patch] Cancelar should use secondary variant per DESIGN [`components/home/unmark-workout-dialog.tsx:34`] — fixed during review
- [x] [Review][Defer] Midnight rollover stale `todayDate` affects unmark [`lib/hooks/use-today.ts:24-39`] — deferred, inherited from Story 2.1; tab open past midnight may desync mark/unmark until reload

## Senior Developer Review (AI)

**Review outcome:** Approve  
**Review date:** 2026-07-12  
**Layers:** Blind Hunter, Edge Case Hunter, Acceptance Auditor

### Summary

Implementation satisfies all 6 acceptance criteria. Architecture compliance verified (AD-1, AD-2, AD-3, AD-6, AD-9). Unmark flows through repository only; stretch sessions isolated. AlertDialog provides focus trap and Esc-to-cancel per UX-DR7. One low UX patch applied (Cancelar → secondary variant).

### Action Items

- [x] [Patch] AlertDialogCancel variant secondary — applied in review
- [x] [Defer] Midnight rollover — inherited from 2.1; defer to future hardening

## Dev Notes

### Architecture compliance (MUST)

- **AD-1:** Unmark only via `exerciseLogRepository.unmarkWorkoutDay()` — never localStorage in components
- **AD-2:** Use `todayLocalDate()` for the date passed to unmark
- **AD-3:** `unmarkWorkoutDay` already preserves `stretchSessions` — do NOT touch stretch logic in UI
- **AD-6:** Dialog + button = client components; no Server Actions
- **AD-9:** `components/home/` → `lib/hooks/use-today.ts` → `lib/storage/exercise-log-repository.ts`

### UX / DESIGN (UX-DR7)

From DESIGN.md § Diálogo de confirmación — desmarcar:

| Element | Spec |
| --- | --- |
| Scrim | `#00000080` (overlay-scrim) — AlertDialog default |
| Title/copy | "¿Quitar el registro de hoy?" |
| Cancelar | Secondary button |
| Quitar | Destructive outline `#EF4444`, **not** filled red |
| Esc | Cancel (Radix AlertDialogCancel behavior) |
| Focus | Trapped in dialog while open |

Trigger: tap on registered CTA (`copy.home.alreadyMarked` text already on button from 2.1).

### Existing code to REUSE (do NOT reinvent)

| Asset | Path | Use |
| --- | --- | --- |
| Repository | `lib/storage/exercise-log-repository.ts` | `unmarkWorkoutDay(date)` — ready, tested |
| Hook | `lib/hooks/use-today.ts` | extend with `unmarkToday` |
| Button | `components/home/workout-mark-button.tsx` | UPDATE — replace marked no-op with dialog open |
| Copy | `lib/copy/es.ts` | `alreadyMarked` exists; add dialog strings |
| Button primitive | `components/ui/button.tsx` | AlertDialog actions |
| Destructive token | `app/globals.css` | `--destructive: #ef4444` |

### Scope boundaries — do NOT implement

- Category chips after mark (Story 2.3)
- Post-workout suggestion card (Story 2.4)
- Player exit dialog (Story 4.3) — reuse AlertDialog pattern later, not now
- History page updates (Story 3.1)
- Edit past workout days

### Suggested file structure

```
lib/copy/es.ts                          # UPDATE — dialog copy
lib/copy/es.test.ts                     # UPDATE
lib/hooks/use-today.ts                  # UPDATE — unmarkToday + hook export
lib/hooks/use-today.test.ts             # UPDATE — unmarkToday integration test
components/ui/alert-dialog.tsx          # NEW — shadcn
components/home/unmark-workout-dialog.tsx  # NEW
components/home/workout-mark-button.tsx    # UPDATE — dialog wiring
```

### Testing approach

- Vitest, colocated `*.test.ts`, `environment: "node"`
- Test `unmarkToday()` with localStorage mock (copy setup from `exercise-log-repository.test.ts`)
- Repository unmark + stretch isolation already tested in 1.2 — hook test validates wiring only
- No RTL/component tests required (consistent with 2.1); manual AC verification for dialog UX
- Run `bun run test` (not bare `bun test` if script differs — use package.json script)

### Previous story intelligence (2.1)

- `WorkoutMarkButton` marked click is **intentional no-op** — replace with dialog open
- Registered styling complete — do not change visual states
- `markToday()` pattern: thin wrapper over repository — mirror for `unmarkToday()`
- SSR hydration: server shows unmarked until client loads log (expected)
- Midnight rollover stale date deferred — same limitation applies to unmark

### Git intelligence

- Branch `main` has no commits yet; set `baseline_commit: NO_VCS` or capture via `git rev-parse HEAD` if commits exist

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-2.2]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/DESIGN.md#Diálogo-de-confirmación-—-desmarcar]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/EXPERIENCE.md#Diálogo-desmarcar]
- [Source: docs/project-context.md]
- [Source: _bmad-output/implementation-artifacts/2-1-today-status-mark.md]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

- PowerShell: use `;` not `&&` for chained commands

### Implementation Plan

- Added `copy.dialogs.unmarkWorkout` strings and `unmarkToday()` hook wrapper
- Installed shadcn AlertDialog; built `UnmarkWorkoutDialog` with destructive outline Quitar action
- Wired `WorkoutMarkButton` to open dialog on registered tap; confirm calls repository unmark

### Completion Notes List

- `unmarkToday()` removes today's workout day via repository; stretch sessions preserved (tested)
- Dialog copy matches UX-DR7: "¿Quitar el registro de hoy?" + Cancelar / Quitar
- Quitar uses outline + destructive border/text (not filled red)
- 24 tests pass; lint and build green

### File List

- lib/copy/es.ts
- lib/copy/es.test.ts
- lib/hooks/use-today.ts
- lib/hooks/use-today.test.ts
- components/ui/alert-dialog.tsx
- components/home/unmark-workout-dialog.tsx
- components/home/workout-mark-button.tsx

## Change Log

- 2026-07-12: Story 2.2 created — comprehensive dev context for unmark confirmation
- 2026-07-12: Code review approved — Cancelar secondary variant patched; story marked done
