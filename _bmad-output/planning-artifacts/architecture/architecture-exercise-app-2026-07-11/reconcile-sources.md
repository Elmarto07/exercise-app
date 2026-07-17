# Reconcile: PRD + UX → Architecture Spine

## Landed

- Next.js PWA + localStorage (addendum) → AD-1, AD-6, Stack, Structural Seed
- Stretch Session ≠ Workout Day (UX RD-1) → AD-3, schema `stretchSessions[]`
- Post-workout hidden when `no-especificado` (UX RD-2) → AD-5
- Salir Player always confirms (UX RD-3) → component behavior in Capability map (Player route)
- 5 rutinas embebidas JSON (addendum) → AD-4, `data/stretch-routines.json`
- Serwist for offline (verified 9.5.x + Turbopack) → AD-7
- 30-day history, no past edit, Spanish UI → AD-2, AD-8, conventions

## Gaps surfaced (not in PRD — architecture added)

- Schema v1 extended with `stretchSessions[]` and `v` version field
- `no-especificado` as explicit category enum value (UX uses hyphen in prose; spine uses kebab-case JSON)
- Centralized copy in `lib/copy/es.ts`

## Upstream drift to watch

- PRD FR-8 still implies post-workout always after mark; UX/spine restrict to concrete category — **UX wins**
- Addendum localStorage example lacks `stretchSessions` — update addendum optional in `bmad-prd update`
