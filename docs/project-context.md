---
project_name: exercise-app
user_name: Martin
date: 2026-07-11
sections_completed:
  - technology_stack
  - language_rules
  - framework_rules
  - testing_rules
  - quality_rules
  - workflow_rules
  - anti_patterns
status: complete
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

| Layer | Choice |
| --- | --- |
| Runtime / PM | **Bun** (exclusive — no npm, no pnpm, no yarn) |
| Framework | Next.js 15 App Router |
| UI | React 19, TypeScript 5 strict |
| Styling | Tailwind CSS 4, shadcn/ui (New York) |
| Tests | Vitest |
| PWA (later stories) | @serwist/turbopack 9.5.x |
| Deploy | Vercel Hobby |
| Persistence | localStorage via `ExerciseLogRepository` (AD-1) |
| Product | Marca Fit — PWA hobby, Spanish UI only |

**Architecture spine:** `_bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md`

---

## Critical Implementation Rules

### Package Manager (Bun) — MANDATORY

- **Use Bun only** for installs, scripts, and CLI tools.
- **Do:** `bun install` · `bun add <pkg>` · `bun remove <pkg>` · `bun run <script>` · `bun test` · `bunx <tool>`
- **Never:** `npm`, `npx`, `pnpm`, `pnpm dlx`, `yarn`, `yarn dlx`
- Lockfile: **`bun.lock`** (commit it). Do not create or commit `package-lock.json` or `pnpm-lock.yaml`.
- Config: root **`bunfig.toml`** enforces `minimumReleaseAge = 86400` (24h, seconds) — agents must not disable or lower this threshold. Use seconds, not duration strings (Vercel Bun compatibility).
- When adding dependencies, prefer exact or caret ranges on **versions already older than 1 day**; Bun filters fresh publishes automatically.
- Do not add packages to `minimumReleaseAgeExcludes` without explicit user approval.
- If a required version is blocked by age gate, report to user — do not bypass with npm.

### Language-Specific Rules

- TypeScript **strict** — no `any` unless justified in Dev Notes.
- Path alias `@/*` maps to repo root.
- Dates for domain logic: `YYYY-MM-DD` in **local timezone** (`lib/domain/dates.ts`).
- UI copy: Spanish only — centralize in `lib/copy/es.ts`; no hardcoded English strings in components.

### Framework-Specific Rules (Next.js / React)

- App Router; interactive features = `"use client"`.
- **No** Server Actions or API routes for user data in MVP (AD-6).
- Data mutations only through `ExerciseLogRepository` — never `localStorage` in components.
- Layer direction: `components/` → `lib/hooks|services` → `lib/domain|storage` (AD-9).
- Routes: `/`, `/history`, `/stretch/[routineId]`.
- Design tokens: `#22C55E` accent, `#FAFAFA` background (DESIGN.md).

### Testing Rules

- Run tests with **`bun test`** (Vitest).
- Unit tests colocated as `*.test.ts` near source (e.g. `lib/copy/es.test.ts`).
- Red-green-refactor for dev-story workflow; tests must pass before marking tasks complete.

### Code Quality & Style Rules

- ESLint: `next/core-web-vitals` + TypeScript.
- File naming: **kebab-case** for modules (`exercise-log-repository.ts`).
- Types/entities: **PascalCase** (`WorkoutDay`, `StretchSession`).
- shadcn components live in `components/ui/`; use `cn()` from `lib/utils.ts`.

### Development Workflow Rules

- **Git base branch: `main` — MANDATORY.** All feature, fix, and chore branches must be created from an up-to-date `main` (`git checkout main && git pull && git checkout -b <tipo>/<nombre>`). Do not branch from other feature branches unless the user explicitly requests a stacked branch.
- Prefer short-lived branches named `feat/…`, `fix/…`, or `chore/…`; open PRs against `main`.
- BMad artifacts live under `_bmad-output/` — do not mix planning docs into `app/`.
- Story implementation follows `_bmad-output/implementation-artifacts/*.md` acceptance criteria.
- Only commit when user explicitly asks.

### Critical Don't-Miss Rules

- **WorkoutDay ≠ StretchSession** — separate arrays in `marcafit:log` (AD-3).
- **Post-workout UI** only when category is concrete; hide if `no-especificado` (AD-5).
- **Stretch Player exit** always confirms; abandon without completing does not log session.
- No edit of past Workout Days; no gamified streak UI.
- No backend, auth, or sync in MVP.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing any code.
- Follow ALL rules exactly; when in doubt, prefer the more restrictive option.
- Use Bun commands in terminal steps, story docs, and README examples.

**For Humans:**

- Update when stack or tooling changes.
- To change minimum release age, edit `bunfig.toml` and this file together.

Last Updated: 2026-07-17
