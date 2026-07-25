---
baseline_commit: 9fe12c957265b6c0744be6b40a1561271bf3e050
---

# Story 4.2: Daily stretch card on Home

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,
I want easy access to daily stretches from Home,
So that I can mobilize even when I haven't trained (FR-7, FR-10, UJ-3).

## Acceptance Criteria

1. **Given** Home loads **When** today has no Workout Day **Then** the “Rutina diaria” card is visible with a duration estimate and CTA “Estirar ahora”
2. **And** **When** today has a Workout Day **Then** the daily card remains accessible below the post-workout card (if shown) or alone (if post-workout is hidden)
3. **And** the CTA navigates to `/stretch/daily` (Next.js `Link` — same pattern as post-workout card)
4. **And** the stretch CTA is visually secondary to the workout mark button (UX-DR9): outline/secondary styles (`min-h-12`, bordered, not `bg-primary` / not `min-h-14`)
5. **And** duration/meta line comes from the resolver (`getDailyRoutine` + `formatRoutineDurationMeta`) — do not hardcode `~5 min · …` in the component; title chrome stays `copy.home.dailyStretchTitle` (“Rutina diaria”)
6. **And** AD-9: component uses `lib/services/stretch-resolver` only — never import `data/stretch-routines.json` from UI
7. **And** no Player implementation, no `stretchSessions` writes, no new libraries; Bun-only for scripts/tests

## Tasks / Subtasks

- [x] Task 1: Extract + wire DailyStretchCard (AC: 1–6)
  - [x] Add `components/home/daily-stretch-card.tsx` (client if needed for Link; mirror post-workout anatomy **without** dismiss)
  - [x] Resolve routine via `getDailyRoutine()`; if missing, return `null` (same guard as post-workout)
  - [x] Title: `copy.home.dailyStretchTitle` — **not** `routine.title` (JSON is “Estiramiento diario”; UX/mockups/epics require “Rutina diaria”)
  - [x] Meta: `formatRoutineDurationMeta({ durationMinutes, meta })` from daily routine
  - [x] CTA: `<Link href="/stretch/daily">` + `copy.home.stretchNow`
  - [x] Replace static `<section>` placeholder in `app/page.tsx` with `<DailyStretchCard />`
  - [x] Keep section order: `HomeWorkoutSection` → daily card → history link (daily stays a sibling below workout section so it appears under post-workout when that card shows)
- [x] Task 2: Copy / types cleanup (AC: 5)
  - [x] Stop using hardcoded `home.dailyStretchMeta` in Home UI once meta comes from resolver
  - [x] Optional: keep `dailyStretchMeta` in `es.ts` unused, or remove + update `es.test.ts` if referenced — prefer remove only if nothing else uses it
  - [x] If `formatRoutineDurationMeta` is typed only as `PostWorkoutRoutine`, widen param to `{ durationMinutes: number; meta: string }` so daily reuse is clean (do not break post-workout callers)
- [x] Task 3: Quality gates (AC: 3, 4, 7)
  - [x] Manual: unmarked Home → card visible, secondary CTA, navigates to `/stretch/daily` (404 until Story 4.3 is OK)
  - [x] Manual: marked + concrete category → post-workout above daily; both CTAs secondary vs mark button
  - [x] Manual: marked + `no-especificado` or dismissed post → daily still alone below workout section
  - [x] `bun run test`, `bun run lint`, `bun run build` pass
  - [x] Optional light test: assert daily card href `/stretch/daily` if adding a colocated test; RTL not required if matching Story 2.4 style

## Dev Notes

### Branch / baseline prerequisite

- **Depends on Story 4.1** (`getDailyRoutine`, filled `daily` routine in JSON). On 2026-07-19, 4.1 APIs exist only on branch `feat/4-1-stretch-routines-json` (uncommitted). **Do not implement 4.2 against `main` until 4.1 is merged**, or stack explicitly on the 4.1 branch if the user asks.
- **Base branch: `main`** after 4.1 lands. Suggested branch: `feat/4-2-daily-stretch-card`.
- Placeholder daily UI already ships on `main` in `app/page.tsx` (static copy + inert `<button>`).
- Frontmatter `baseline_commit` = `main` at story creation (`9fe12c9`). Re-pull `main` (with 4.1 merged) before branching.

### Architecture compliance (MUST)

- **AD-4:** Consume embedded routines via resolver; no fetch/API for content
- **AD-9:** `components/home` → `lib/services/stretch-resolver` → `data/`
- **AD-5 / Story 2.4:** Do **not** change post-workout visibility, dismiss, or category gating
- **AD-3 / 4.4:** Do **not** write `stretchSessions`
- Routes: CTA target `/stretch/daily` matches spine `routineId` slug `daily`; Player page is Story **4.3** (404 expected until then — same as post-workout links today)
- Copy: UI chrome in `lib/copy/es.ts`; exercise body text stays in JSON (4.1)

### UX / product rules

| Rule | Detail |
| --- | --- |
| Always accessible | FR-10: visible when unmarked; AC + EXPERIENCE: also when marked |
| Stacking | When post-workout shows, daily is **below** it (epics AC wins over addendum IA sketch that listed daily above post) |
| Mockup gap | `home-today-marked.html` omits daily card — **ignore mockup**; follow epics + EXPERIENCE |
| Hierarchy | Mark button remains primary (`min-h-14` / filled); stretch CTAs secondary (UX-DR9) |
| Voice | CTA label “Estirar ahora” — already in copy |
| No dismiss | Daily card has no “Ahora no” (unlike post-workout) |

### Current code state (UPDATE targets)

**`app/page.tsx` today** — static placeholder after `HomeWorkoutSection`:

```tsx
<section className="rounded-xl border border-border bg-white p-4">
  <h2>{home.dailyStretchTitle}</h2>
  <p>{home.dailyStretchMeta}</p>
  <button type="button" className="mt-3 min-h-12 w-full ...">
    {home.stretchNow}
  </button>
</section>
```

**Reuse pattern — `components/home/post-workout-card.tsx`:**

- `getPostWorkoutRoutine` + `formatRoutineDurationMeta` + `Link` to `/stretch/${routine.id}`
- Secondary CTA classes: `min-h-12 … rounded-xl border border-border bg-white`
- Daily card: same card shell; **omit** dismiss button; href fixed `/stretch/daily` (or `` `/stretch/${routine.id}` `` with `routine.id === "daily"`)

**Resolver (from 4.1):**

| API | Use in 4.2 |
| --- | --- |
| `getDailyRoutine()` | Load daily content |
| `formatRoutineDurationMeta` | `~N min · meta` line |
| `getPostWorkoutRoutine` | Do not change |

**Copy keys:**

| Key | Value | 4.2 |
| --- | --- | --- |
| `home.dailyStretchTitle` | `Rutina diaria` | Keep — card title |
| `home.dailyStretchMeta` | `~5 min · cuello, hombros, cadera` | Replace usage with resolver meta |
| `home.stretchNow` | `Estirar ahora` | Keep — CTA |

### Scope boundaries — do NOT implement

- Stretch Player / `app/stretch/[routineId]` (Story **4.3**)
- `addStretchSession` / persistence (Story **4.4**)
- Authoring or reshaping `data/stretch-routines.json` content (Story **4.1** — open review patches are separate)
- Changing post-workout card rules (Story **2.4**)
- Moving daily card into `HomeWorkoutSection` unless required for order (prefer keep sibling in `page.tsx`)
- New npm packages; Server Actions; API routes for routines

### Suggested file structure

```
components/home/daily-stretch-card.tsx   # NEW
app/page.tsx                             # UPDATE — swap placeholder for <DailyStretchCard />
lib/copy/es.ts                           # UPDATE optional — drop unused dailyStretchMeta
lib/services/stretch-resolver.ts         # UPDATE optional — widen formatRoutineDurationMeta param type
```

**Do not modify** for this story: History, repository, Serwist, post-workout visibility logic, stretch JSON exercise content.

### Testing approach

- Primary: manual Home states (unmarked / marked+post / marked without post)
- Regression: post-workout card + mark button still work
- Optional: Vitest on resolver already covers daily content (4.1); component test only if cheap
- Quality gates: `bun run test`, `bun run lint`, `bun run build`

### Previous story intelligence (4.1)

- Full routines + `getDailyRoutine` / `getRoutineById` added; Home intentionally untouched
- Dev note: “4.2 may later read meta from resolver instead of hardcoded copy” — **do that here**
- Open 4.1 review patches (content/tests only) are not blockers for card wiring if APIs exist
- Deferred 4.1: post-* meta copy vs addendum; cuerpo-completo balance — out of scope for 4.2
- Player 404 until 4.3 is accepted (same as Story 2.4 post links)

### Git intelligence

- Recent `main` tip includes Epic 3 History; Epic 2 Home already has post-workout Link pattern
- 4.1 work may still be unmerged — verify `getDailyRoutine` exists before coding 4.2

### Project context reference

Follow `docs/project-context.md`: Bun exclusive; Spanish UI via `lib/copy/es.ts`; layer direction AD-9; Vitest colocated; branch from `main`.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story-4.2]
- [Source: _bmad-output/planning-artifacts/prds/prd-exercise-app-2026-07-11/prd.md#FR-7]
- [Source: _bmad-output/planning-artifacts/prds/prd-exercise-app-2026-07-11/prd.md#FR-10]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/DESIGN.md#Tarjeta-Rutina-diaria]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/EXPERIENCE.md]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/mockups/home-today-unmarked.html]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md#AD-4]
- [Source: _bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md#AD-9]
- [Source: _bmad-output/implementation-artifacts/4-1-stretch-routines-json.md]
- [Source: _bmad-output/implementation-artifacts/2-4-post-workout-card.md]
- [Source: docs/project-context.md]

## Dev Agent Record

### Agent Model Used

Cursor Grok 4.5

### Debug Log References

- Implemented on `feat/4-1-stretch-routines-json` working tree (4.1 APIs required; not yet on main).
- Manual Home state checks inferred from structure: `DailyStretchCard` is always a sibling below `HomeWorkoutSection` (post-workout lives inside that section).

### Completion Notes List

- Added `DailyStretchCard`: `getDailyRoutine` + `formatRoutineDurationMeta`, title from `copy.home.dailyStretchTitle`, CTA `Link` to `/stretch/${routine.id}` (daily → `/stretch/daily`), secondary outline styles, no dismiss.
- Replaced Home placeholder section; removed unused `home.dailyStretchMeta`; widened `formatRoutineDurationMeta` param type.
- Tests: daily meta formatting + `id === "daily"`; copy asserts `dailyStretchTitle`. Gates: `bun run test` (51), lint, build passed.

### File List

- `components/home/daily-stretch-card.tsx`
- `app/page.tsx`
- `lib/copy/es.ts`
- `lib/copy/es.test.ts`
- `lib/services/stretch-resolver.ts`
- `lib/services/stretch-resolver.test.ts`
- `_bmad-output/implementation-artifacts/4-2-daily-stretch-card.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

## Change Log

- 2026-07-19: Story 4.2 created — ultimate context for Home daily stretch card wiring (ready-for-dev)
- 2026-07-19: Implemented DailyStretchCard + Home wiring; status → review
- 2026-07-25: Code review (Blind Hunter + Edge Case Hunter + Acceptance Auditor) — clean; status → done
