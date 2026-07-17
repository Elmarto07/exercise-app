---
baseline_commit: NO_VCS
---

# Story 1.1: Inicializar proyecto Next.js PWA

Status: done

## Story

As a developer,
I want a Next.js 15 App Router project with TypeScript, Tailwind 4 and shadcn/ui,
So that I have a consistent foundation matching the architecture spine.

## Acceptance Criteria

1. **Given** greenfield repo **When** I run the dev server **Then** the app loads at `/` with App Router, TypeScript strict, Tailwind and shadcn configured
2. **And** folder structure matches Architecture Structural Seed (`app/`, `components/`, `lib/`, `data/`, `public/`)
3. **And** `lib/copy/es.ts` exists with placeholder Home strings in Spanish

## Tasks / Subtasks

- [x] Task 1: Scaffold Next.js 15 + TypeScript + Tailwind (AC: 1)
  - [x] Run create-next-app with App Router, ESLint, `@/*` alias
  - [x] Verify `bun run dev` serves `/`
- [x] Task 2: Folder structure + Spanish copy module (AC: 2, 3)
  - [x] Create `components/`, `data/`, `lib/copy/es.ts`, placeholder dirs per architecture
  - [x] Wire Home page to use copy strings
- [x] Task 3: shadcn/ui init (AC: 1)
  - [x] Init shadcn with New York style, CSS variables aligned to Marca Fit green
- [x] Task 4: Tests and quality gates (AC: 1–3)
  - [x] Add vitest; test `lib/copy/es.ts` exports required keys
  - [x] `bun run build` and `bun run lint` pass

## Dev Notes

- **Architecture:** [ARCHITECTURE-SPINE.md] — Next.js 15, React 19, TS 5, Tailwind 4, shadcn, AD-9 layer folders
- **UX tokens:** accent `#22C55E`, background `#FAFAFA` — apply in globals.css / shadcn theme
- **Routes later:** `/`, `/history`, `/stretch/[routineId]` — only `/` in this story
- **Do NOT** implement repository, Serwist, or workout logic (Stories 1.2+)

### Project Structure Notes

```
app/layout.tsx, app/page.tsx
components/ui/button.tsx (shadcn)
lib/copy/es.ts
data/.gitkeep
public/manifest.webmanifest
```

### References

- [Source: _bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md#Structural-Seed]
- [Source: _bmad-output/planning-artifacts/epics.md#Story-1.1]
- [Source: _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/DESIGN.md]

## Dev Agent Record

### Agent Model Used

Composer

### Debug Log References

- create-next-app rejected non-empty repo; manual scaffold used
- ESLint flat config fixed (removed invalid `eslint/config` type import)

### Completion Notes List

- Next.js 15.5 + React 19 + TypeScript strict + Tailwind 4 via `@tailwindcss/postcss`
- Home placeholder at `/` using `lib/copy/es.ts` (Spanish strings)
- shadcn/ui configured (`components.json`, `components/ui/button.tsx`, theme tokens)
- Vitest test for copy module; build + lint pass

### File List

- package.json
- tsconfig.json
- next.config.ts
- postcss.config.mjs
- eslint.config.mjs
- vitest.config.ts
- components.json
- .gitignore
- app/layout.tsx
- app/page.tsx
- app/globals.css
- lib/copy/es.ts
- lib/copy/es.test.ts
- lib/utils.ts
- components/ui/button.tsx
- components/home/today-date.tsx
- data/.gitkeep
- public/manifest.webmanifest

### Review Findings

- [x] [Review][Patch] Fecha SSR en Server Component — movida a `components/home/today-date.tsx` (cliente)
- [x] [Review][Patch] Tokens shadcn incompletos — `app/globals.css` ampliado con tokens ring/destructive/accent/secondary
- [x] [Review][Defer] Iconos PWA faltantes en `public/icons/` — Stories 1.3/1.5
- [x] [Review][Defer] Enlace `/history` 404 — Story 3.1
- [x] [Review][Defer] Botones CTA sin handler — Epic 2 (placeholder intencional)
- [x] [Review][Defer] Safe-area insets — Story 1.4

## Change Log

- 2026-07-11: Story 1.1 implemented — Next.js PWA scaffold, copy module, shadcn init, tests
- 2026-07-11: Code review approved — SSR date fix, shadcn tokens completed; deferred items logged
