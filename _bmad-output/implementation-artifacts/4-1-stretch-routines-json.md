---
baseline_commit: c8550139a74607206e1ee478a1fd45fdd27ddb1c
---

# Story 4.1: Stretch routines JSON content

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a developer,
I want five embedded stretch routines in Spanish,
So that all player flows work offline (AD-4, FR-7, FR-8).

## Acceptance Criteria

1. **Given** `data/stretch-routines.json` **When** loaded by the stretch-resolver service **Then** it contains exactly these five routines by `id`: `daily`, `post-piernas`, `post-torso`, `post-cardio`, `post-cuerpo-completo`
2. **And** each routine has `type` (`daily` | `post-workout`), `title`, `durationMinutes`, `meta`, and non-empty `exercises[]`
3. **And** each exercise has `id`, `name`, `durationSeconds`, `instruction` (1–2 Spanish sentences, original wording — not copied from copyrighted sources)
4. **And** the `daily` routine has **4–8** exercises and total duration **3–7 minutes** (`sum(durationSeconds)` in `[180, 420]`)
5. **And** each post-workout routine has total duration **≤ 5 minutes** (`sum(durationSeconds) ≤ 300`) and is a cooldown distinct from daily (different exercise set / focus — not a clone of daily)
6. **And** post-workout focus matches addendum/epics: piernas → isquios/cuádriceps/glúteos(+gemelos); torso → pecho/hombros/dorsales/brazos; cardio → cadera/pantorrillas/respiración/espalda baja; cuerpo-completo → balanced full-body cooldown
7. **And** `durationMinutes` on each routine is a display estimate consistent with exercise totals (round minutes; card metadata must not contradict the real sum)
8. **And** category→routineId mapping remains in `lib/services/stretch-resolver.ts` for concrete categories (`piernas` → `post-piernas`, etc.) — existing Story 2.4 card must keep working
9. **And** resolver exposes lookup by `routineId` (and daily helper) so Stories 4.2–4.3 can load full routines including `exercises` without reading JSON in components
10. **And** no new libraries; no API/fetch for routines; Bun-only scripts/tests; Spanish exercise copy lives in the JSON (not `lib/copy/es.ts`)

## Tasks / Subtasks

- [x] Task 1: Expand `data/stretch-routines.json` (AC: 1–7)
  - [x] Add routine `id: "daily"`, `type: "daily"`, title/meta aligned with Home placeholder focus (cuello, hombros, cadera — movilidad general)
  - [x] Fill `exercises[]` for all five routines with real Spanish content (never leave empty arrays)
  - [x] Keep existing post-* ids/titles stable if possible so Story 2.4 tests/links stay valid (`post-piernas`, `post-torso`, `post-cardio`, `post-cuerpo-completo`)
  - [x] Ensure duration constraints: daily 3–7 min; each post ≤5 min; `durationMinutes` coherent with sums
  - [x] Exercise `id` slugs unique **within** a routine (e.g. `neck-side-bend`); `name` short Spanish label; `instruction` 1–2 sentences
- [x] Task 2: Types + resolver API for full routines (AC: 8–9)
  - [x] Add `StretchExercise` / `StretchRoutine` types (preferred: `lib/domain/types.ts` or colocated in resolver — follow AD-9; domain must not import React)
  - [x] Extend `RoutineRecord` / map to include `exercises`
  - [x] Add `getRoutineById(routineId: string): StretchRoutine | undefined`
  - [x] Add `getDailyRoutine(): StretchRoutine | undefined` (or equivalent thin wrapper)
  - [x] Keep `getPostWorkoutRoutine` / `getPostWorkoutRoutineId` / `formatRoutineDurationMeta` working for Home post-workout card (regression)
  - [x] Optional: `getRoutineTotalSeconds(routine)` helper if it clarifies duration assertions in tests
- [x] Task 3: Unit tests (AC: 1–9)
  - [x] Extend `lib/services/stretch-resolver.test.ts`:
    - five routine ids present via resolver
    - daily exercise count ∈ [4, 8] and total seconds ∈ [180, 420]
    - each post-* total seconds ≤ 300
    - every exercise has required fields; instructions non-empty Spanish strings
    - category→id mapping unchanged
    - `getPostWorkoutRoutine("piernas")` still returns card metadata
    - `getRoutineById("daily")` returns exercises
  - [x] Do **not** require RTL; Vitest colocated tests only
- [x] Task 4: Quality gates (AC: 10)
  - [x] `bun run test`, `bun run lint`, `bun run build` pass
  - [x] Manual spot-check: import resolves; post-workout card on Home still shows title/meta after mark+category
  - [x] Confirm no `fetch`/API route added for routines

### Review Findings

- [x] [Review][Patch] Update post-* `meta` to match addendum focus
- [x] [Review][Patch] Rebalance `post-cuerpo-completo` (3 upper + 3 lower)
- [x] [Review][Patch] Rename anglicism `Tríceps overhead` → `Tríceps arriba`
- [x] [Review][Patch] Strengthen “exactly five routines” test + unique ids
- [x] [Review][Patch] Assert each `post-*` has `type === "post-workout"`
- [x] [Review][Patch] Reword chest stretch to wall (no door frame)
- [x] [Review][Patch] Replace cloned `Hombro cruzado` in `post-cuerpo-completo` (identical name+instruction vs daily) and assert name/instruction distinctness in tests [`data/stretch-routines.json`:~179]

## Dev Notes

### Branch / baseline prerequisite

- **Base branch: `main`** (`c855013` at story creation — re-pull before branching).
- Story 2.4 already shipped stubs on `main`: `data/stretch-routines.json` (4 post routines, `exercises: []`) + `lib/services/stretch-resolver.ts`.
- **This story does not need Epic 3 History** — content/service only. Do not stack on `feat/epic-3-*` unless the user explicitly requests it.
- Suggested branch: `feat/4-1-stretch-routines-json`.

### Architecture compliance (MUST)

- **AD-4:** Static embed via `import stretchRoutines from "@/data/stretch-routines.json"` — build-time only; offline-safe (FR-12)
- **AD-6:** No Server Actions / API routes for routine content
- **AD-9:** `components/` → `lib/services/stretch-resolver` → `data/`; never import JSON directly from UI in later stories
- **AD-3:** This story does **not** write `stretchSessions` — persistence remains Story 4.4
- Naming: entities `StretchRoutine`, `StretchExercise`; file kebab-case; `routineId` slugs as listed
- **Bun only** for scripts/tests

### Product / FR closure

| FR | This story | Later |
| --- | --- | --- |
| **FR-7** | Daily routine **content** (4–8 exercises, 3–7 min) | **4.2** Home card wiring; **4.3** player |
| **FR-8** | Post-workout routine **content** (≤5 min, category-specific, ≠ daily) | Card UI already **2.4**; player **4.3** |
| **AD-4** | Five embedded routines complete | — |
| **FR-9 / FR-15** | Out of scope | **4.3** / **4.4** |

### UX / content guidance (source of truth)

| Routine | Focus (addendum) | Notes |
| --- | --- | --- |
| `daily` | Cuello, hombros, cadera — general mobility | Align meta with Home copy spirit (`~5 min · cuello, hombros, cadera`) — 4.2 may later read meta from resolver instead of hardcoded copy |
| `post-piernas` | Isquios, cuádriceps, glúteos, gemelos | Existing stub meta: `isquios, cuádriceps, glúteos` |
| `post-torso` | Pecho, hombros, dorsales, brazos | Existing: `espalda, pecho, hombros` |
| `post-cardio` | Cadera, pantorrillas, respiración, espalda baja | Existing: `piernas, cadera, respiración` |
| `post-cuerpo-completo` | Balanced full-body cooldown | Existing: `tren superior e inferior` |

**Content rules:**

- Original Spanish instructions (ACSM/physio-inspired ideas OK; **no** verbatim copy from copyrighted apps/books)
- Safe static stretches only — no loaded strength moves; instructions should assume no equipment
- Prefer hold-based stretches with clear start position + breathing cue in 1–2 sentences
- Distinctness: daily ≠ any post routine (shared mobility themes OK if exercise ids/names/instructions differ)

Example exercise shape:

```json
{
  "id": "neck-side-bend",
  "name": "Inclinación de cuello",
  "durationSeconds": 30,
  "instruction": "Inclina la oreja hacia el hombro sin encogerlo. Respira despacio y cambia de lado a mitad del tiempo."
}
```

### Current code state (UPDATE targets — `main`)

**`data/stretch-routines.json` today** — 4 post stubs, empty exercises, **no `daily`**:

```json
{
  "id": "post-piernas",
  "type": "post-workout",
  "title": "Estiramiento post-piernas",
  "durationMinutes": 4,
  "meta": "isquios, cuádriceps, glúteos",
  "exercises": []
}
```

**`stretch-resolver.ts` today** — card-only API:

- `getPostWorkoutRoutineId` / `getPostWorkoutRoutine` / `formatRoutineDurationMeta`
- Internal `RoutineRecord` **omits** `exercises`
- **No** `getRoutineById` / `getDailyRoutine`

**Already available — REUSE:**

| Asset | Path |
| --- | --- |
| JSON import + map-by-id pattern | `lib/services/stretch-resolver.ts` |
| Category map | `ConcreteWorkoutCategory` via `lib/domain/categories.ts` |
| `StretchRoutineType` / `StretchSession` | `lib/domain/types.ts` (persistence — do not conflate with content types) |
| Post-workout card consumer | `components/home/post-workout-card.tsx` |

### Scope boundaries — do NOT implement

- Home daily card Link to `/stretch/daily` (Story **4.2**)
- Stretch Player UI / route `app/stretch/[routineId]` (Story **4.3**)
- `addStretchSession` on completion (Story **4.4**)
- Changing post-workout card visibility rules (Story **2.4** / AD-5)
- AI / API stretch suggestion (addendum v1.1 — out of MVP)
- Zod/AJV schema package for JSON (optional light runtime asserts in tests only — no new deps)
- Editing `lib/copy/es.ts` daily placeholder strings unless required for test alignment (prefer 4.2)
- History / Epic 3 changes

### Suggested file structure

```
data/stretch-routines.json              # UPDATE — add daily + fill exercises
lib/services/stretch-resolver.ts        # UPDATE — types, getRoutineById, getDailyRoutine
lib/services/stretch-resolver.test.ts   # UPDATE — content + API coverage
lib/domain/types.ts                     # UPDATE optional — StretchExercise / StretchRoutine content types
```

**NEW files:** none required.

**Do not modify** for this story: Home page wiring, player components, repository, history, Serwist config (JSON already bundled via static import).

### Testing approach

- Primary: Vitest on resolver + JSON invariants (counts, duration sums, required fields, mapping regression)
- Guard: `getPostWorkoutRoutine` return shape for at least one category stays card-compatible
- Guard: build still typechecks with `resolveJsonModule`
- Quality gates: `bun run test`, `bun run lint`, `bun run build`

### Previous story intelligence (2.4)

- Explicitly deferred full exercise content to **this story** — stubs were “enough for card + navigation”
- Category→routine ids are already correct — **preserve** them
- Post-workout card links to `/stretch/${routine.id}` (404 until 4.3) — do not break Link targets by renaming ids
- Session-only dismiss and player 404 remain deferred (not this story)

### Git intelligence

- Recent tip includes Epic 3 finish WIP on other branches; **4.1 should start from `main`**
- `main` already contains `data/stretch-routines.json` + resolver from Epic 2
- No new dependencies expected

### Project context reference

Follow `docs/project-context.md`: Bun exclusive, Spanish UI via copy module for **UI chrome**; routine exercise text lives in JSON; repository-only persistence for user data; Vitest colocated tests; branch from `main`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.1]
- [Source: _bmad-output/planning-artifacts/prds/prd-exercise-app-2026-07-11/prd.md#FR-7]
- [Source: _bmad-output/planning-artifacts/prds/prd-exercise-app-2026-07-11/prd.md#FR-8]
- [Source: _bmad-output/planning-artifacts/prds/prd-exercise-app-2026-07-11/addendum.md#Estiramientos-adaptados-al-entreno]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md#AD-4]
- [Source: _bmad-output/implementation-artifacts/2-4-post-workout-card.md]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

Cursor Grok 4.5

### Debug Log References

- PowerShell: chained git/commands with `;` (not `&&`).
- `resolve_customization.py` unavailable (Python < 3.11); used customize.toml fallback.

### Completion Notes List

- Added `daily` routine (6 exercises, 300s / 5 min) plus full Spanish exercise content for all four post-* routines; post ids/titles/meta preserved for Story 2.4 card.
- Domain types `StretchExercise` / `StretchRoutine` in `lib/domain/types.ts`; resolver now maps `exercises` and exposes `getRoutineById`, `getDailyRoutine`, `getRoutineTotalSeconds`.
- Extended Vitest coverage for five ids, duration bounds, Spanish field completeness, durationMinutes coherence, and daily≠post exercise-id distinctness.
- Quality gates: `bun run test` (50), `bun run lint`, `bun run build` passed; no new deps; no fetch/API for routines.

### File List

- `data/stretch-routines.json`
- `lib/domain/types.ts`
- `lib/services/stretch-resolver.ts`
- `lib/services/stretch-resolver.test.ts`
- `_bmad-output/implementation-artifacts/4-1-stretch-routines-json.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-07-19: Story 4.1 created — ultimate context for stretch-routines.json content + resolver API (ready-for-dev)
- 2026-07-19: Implemented five embedded routines + resolver full-routine API; status → review
- 2026-07-25: Code review — replaced cloned `Hombro cruzado` in `post-cuerpo-completo` with `Alcance lateral`; distinctness test covers name+instruction; status → done
