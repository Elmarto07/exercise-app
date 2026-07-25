---
stepsCompleted:
  - step-01-validate-prerequisites
  - step-02-design-epics
  - step-03-create-stories
  - step-04-final-validation
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-exercise-app-2026-07-11/prd.md
  - _bmad-output/planning-artifacts/prds/prd-exercise-app-2026-07-11/addendum.md
  - _bmad-output/planning-artifacts/architecture/architecture-exercise-app-2026-07-11/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-exercise-app-2026-07-11/EXPERIENCE.md
---

# Marca Fit - Epic Breakdown

## Overview

Descomposición de epics e historias para **Marca Fit**, derivada del PRD (FR-1…FR-15), arquitectura (AD-1…AD-9) y contrato UX (DESIGN.md + EXPERIENCE.md). Proyecto hobby, un usuario (Martin), PWA local-first.

## Requirements Inventory

### Functional Requirements

FR-1: Marcar el día actual como Workout Day con un toque desde Home; persistencia local; sin duplicados por fecha.
FR-2: Desmarcar Workout Day de hoy con diálogo de confirmación.
FR-3: Ver en Home si hoy está registrado sin navegar; fecha local del dispositivo.
FR-4: History View — últimos 30 días con Workout Day, categoría e indicador Stretch Session.
FR-5: Resumen numérico X/30 días (solo Workout Days).
FR-6: Alternar vista calendario/lista en History; preferencia persistida.
FR-7: Rutina diaria de estiramientos accesible desde Home (4–8 ejercicios, 3–7 min).
FR-8: Post-Workout Suggestion solo tras marcar con categoría concreta; oculta si `no-especificado`.
FR-9: Stretch Player — temporizador, auto-avance, pausa, saltar, salir con confirmación.
FR-10: CTA de estiramientos visible en Home cuando hoy no tiene Workout Day.
FR-11: Instalación PWA (manifest, iconos, standalone, guía install).
FR-12: Core offline — marcar/desmarcar, History, rutinas embebidas tras primera carga.
FR-13: Mobile-first 320–428 px; targets ≥44 px; sin scroll horizontal en Home/History.
FR-14: Selector Workout Category (4 opciones + omitir → `no-especificado`); flujo ≤7 s.
FR-15: Registrar Stretch Session al completar rutina; independiente de Workout Day.

### NonFunctional Requirements

NFR-1: Feedback de registro percibido <500 ms (FR-1).
NFR-2: Post-workout visible <1 s tras categoría elegida (FR-8).
NFR-3: Constancia identificable en ≤10 s en History (SM-2).
NFR-4: 100% operaciones FR-1/FR-2/FR-4 offline tras primera carga (SM-5).
NFR-5: WCAG AA aspiracional — contraste, labels, aria-live en timer (UX Accessibility Floor).
NFR-6: UI e instrucciones solo en español informal.
NFR-7: Sin backend, sync ni auth en MVP (AD-6).
NFR-8: Datos en una clave `marcafit:log` vía repository único (AD-1).

### Additional Requirements

- Inicializar Next.js 15 App Router + TypeScript 5 + React 19 + Tailwind 4 + shadcn/ui (Architecture Stack).
- `ExerciseLogRepository` en `lib/storage/` — única vía de mutación (AD-1).
- Schema v1: `workoutDays[]`, `stretchSessions[]`, `prefs` (Architecture).
- Fechas `YYYY-MM-DD` timezone local — `lib/domain/dates.ts` (AD-2).
- Rutinas en `data/stretch-routines.json` — 5 rutinas embebidas (AD-4).
- Serwist `@serwist/turbopack` 9.5.x — SW route, `SerwistProvider`, `~offline` (AD-7).
- Rutas: `/`, `/history`, `/stretch/[routineId]` (Structural Seed).
- Copy centralizado `lib/copy/es.ts`.
- Deploy Vercel Hobby.
- Capas: components → hooks/services → domain/storage (AD-9).

### UX Design Requirements

UX-DR1: Tokens DESIGN.md — verde `#22C55E`, fondo `#FAFAFA`, tipografía system stack, radii/spacing.
UX-DR2: CTA primario Home — “Marcar entreno de hoy” / “Ya registrado” estados (DESIGN button-primary).
UX-DR3: Chips categoría — 4 + Omitir; selected muted green (DESIGN chip-category).
UX-DR4: Post-Workout card — oculta si `no-especificado`; CTA secundario “Estirar ahora” + “Ahora no”.
UX-DR5: History — celdas registered/empty/today ring; punto neutro Stretch Session (DESIGN day-cell-*).
UX-DR6: Stretch Player fullscreen — timer monospace 48px, barra progreso segmentada, controles bottom safe-area.
UX-DR7: Diálogos — desmarcar (“¿Quitar el registro de hoy?”) y salir Player (“¿Salir de la rutina?”) siempre.
UX-DR8: Banner PWA install dismissible; no bloquea CTA registro.
UX-DR9: Microcopy español — tabla Voice and Tone EXPERIENCE.md; sin gamificación de rachas.
UX-DR10: Accesibilidad — targets ≥44px, aria-live timer, foco en diálogos, prefers-reduced-motion.

### FR Coverage Map

FR-1: Epic 2 — Story 2.1
FR-2: Epic 2 — Story 2.2
FR-3: Epic 2 — Story 2.1
FR-4: Epic 3 — Stories 3.1, 3.3
FR-5: Epic 3 — Story 3.1
FR-6: Epic 3 — Story 3.2
FR-7: Epic 4 — Stories 4.1, 4.2
FR-8: Epic 2 — Story 2.4
FR-9: Epic 4 — Story 4.3
FR-10: Epic 4 — Story 4.2
FR-11: Epic 1 — Stories 1.3, 1.5
FR-12: Epic 1 — Story 1.3; validado en Epic 2–4
FR-13: Epic 1 — Story 1.4; reforzado en todas las epics UI
FR-14: Epic 2 — Stories 2.3, 2.5
FR-15: Epic 4 — Story 4.4

## Epic List

### Epic 1: Fundación PWA e infraestructura local
Martin puede abrir la app instalable, offline-ready, con persistencia local y shell visual alineado a Marca Fit.
**FRs covered:** FR-11, FR-12 (base), FR-13 (base)
**Architecture:** AD-1, AD-6, AD-7, AD-9

### Epic 2: Registrar entreno de hoy (Home)
Martin marca/desmarca si entrenó hoy, elige categoría opcional y ve sugerencia post-entreno cuando aplica.
**FRs covered:** FR-1, FR-2, FR-3, FR-8, FR-14
**UX:** UX-DR2, UX-DR3, UX-DR4, UX-DR7 (desmarcar)

### Epic 3: Historial de constancia (30 días)
Martin revisa cuántos días entrenó en el último mes y ve estiramientos completados por día.
**FRs covered:** FR-4, FR-5, FR-6
**UX:** UX-DR5, UX-DR9

### Epic 4: Estiramientos guiados (Player)
Martin hace rutinas diarias o post-entreno con temporizador; las sesiones completadas quedan registradas.
**FRs covered:** FR-7, FR-9, FR-10, FR-15
**UX:** UX-DR6, UX-DR7 (salir Player)

---

## Epic 1: Fundación PWA e infraestructura local

Martin puede abrir la app instalable, offline-ready, con persistencia local y shell visual alineado a Marca Fit.

### Story 1.1: Inicializar proyecto Next.js PWA

As a developer,
I want a Next.js 15 App Router project with TypeScript, Tailwind 4 and shadcn/ui,
So that I have a consistent foundation matching the architecture spine.

**Acceptance Criteria:**

**Given** greenfield repo
**When** I run the dev server
**Then** the app loads at `/` with App Router, TypeScript strict, Tailwind and shadcn configured
**And** folder structure matches Architecture Structural Seed (app/, components/, lib/, data/, public/)
**And** `lib/copy/es.ts` exists with placeholder Home strings in Spanish

### Story 1.2: ExerciseLogRepository y schema v1

As a user,
I want my workout and stretch data stored reliably in one place,
So that the app remembers my activity across sessions.

**Acceptance Criteria:**

**Given** empty localStorage
**When** the repository initializes
**Then** it reads/writes key `marcafit:log` with schema v1 (`workoutDays`, `stretchSessions`, `prefs`)
**And** only `ExerciseLogRepository` touches localStorage (no direct access from components)
**And** `markWorkoutDay`, `unmarkWorkoutDay`, `addStretchSession`, `getLog`, `updatePrefs` exist with typed domain models
**And** dates use `YYYY-MM-DD` from local timezone util (AD-2)
**And** `useExerciseLog` hook notifies React on changes (useSyncExternalStore or equivalent)

### Story 1.3: Serwist PWA offline shell

As a user,
I want the app to work offline after the first visit,
So that I can log workouts without network (FR-12, FR-11).

**Acceptance Criteria:**

**Given** first successful online load
**When** I enable airplane mode and reload
**Then** the app shell loads from service worker cache
**And** `@serwist/turbopack` serves SW at `/serwist/sw.js` with `SerwistProvider` in root layout
**And** `app/~offline/page.tsx` exists as navigation fallback
**And** `manifest.webmanifest` (or `manifest.ts`) has `display: standalone`, theme `#22C55E`, icons 192/512
**And** static assets and `/` are precached

### Story 1.4: Design tokens y layout mobile-first

As a user,
I want a calm, readable mobile interface,
So that the app feels like Marca Fit from the first screen (FR-13, UX-DR1).

**Acceptance Criteria:**

**Given** DESIGN.md tokens
**When** I view any page on 390px viewport
**Then** background is `#FAFAFA`, accent success `#22C55E`, typography system stack
**And** root layout centers content max-width ~428px on wider screens
**And** safe-area padding applied for iOS PWA (`viewport-fit=cover`)
**And** no horizontal scroll on placeholder Home shell

### Story 1.5: Banner instalación PWA

As a user,
I want guidance to add the app to my home screen,
So that I can open it like a native app (FR-11, UX-DR8).

**Acceptance Criteria:**

**Given** first visit in supported browser and app not installed
**When** Home loads
**Then** a dismissible banner shows “Añadir a inicio” (or equivalent from copy module)
**And** dismissing sets `prefs.pwaInstallDismissed` via repository
**And** banner does not reappear after dismiss or when running standalone
**And** banner does not cover or disable the primary CTA area

---

## Epic 2: Registrar entreno de hoy (Home)

Martin marca/desmarca si entrenó hoy, elige categoría opcional y ve sugerencia post-entreno cuando aplica.

### Story 2.1: Estado de hoy y marcar Workout Day

As a user (Martin),
I want to mark today as a workout day with one tap,
So that I record my habit in seconds (FR-1, FR-3, UJ-1).

**Acceptance Criteria:**

**Given** Home loads and today has no Workout Day
**When** I tap “Marcar entreno de hoy”
**Then** UI shows “Registrado” with check within 500ms perceived (NFR-1)
**And** repository persists one Workout Day for today's local date
**And** reload preserves the registered state
**And** duplicate entries for same date are impossible (AD-8)
**And** headline shows “¿Entrenaste hoy?” with today's date in Spanish (UX-DR9)

### Story 2.2: Desmarcar Workout Day con confirmación

As a user,
I want to undo today's workout mark with confirmation,
So that I don't accidentally lose or remove a record (FR-2, UX-DR7).

**Acceptance Criteria:**

**Given** today is registered
**When** I tap “Ya registrado — toca para desmarcar”
**Then** a dialog asks “¿Quitar el registro de hoy?” with Cancelar / Quitar
**And** Cancelar closes dialog without change
**And** Quitar removes today's Workout Day from repository and Home shows unregistered state
**And** Stretch Sessions for today are unaffected

### Story 2.3: Selector Workout Category

As a user,
I want to optionally tag what I trained,
So that post-workout stretches match my session (FR-14, UX-DR3).

**Acceptance Criteria:**

**Given** I just marked today
**When** category chips appear
**Then** I see Piernas, Torso, Cardio, Cuerpo completo and Omitir
**And** one tap selects and persists category on today's Workout Day
**And** Omitir persists `no-especificado` and closes chip block
**And** last selected category is stored in `prefs.lastCategory` as suggestion
**And** chip tap targets are ≥44px

### Story 2.4: Tarjeta Post-Workout Suggestion condicional

As a user,
I want a cooldown stretch suggestion after tagging my workout type,
So that I stretch the right muscles post-training (FR-8, AD-5, UX-DR4).

**Acceptance Criteria:**

**Given** today registered with category piernas|torso|cardio|cuerpo-completo
**When** category is saved
**Then** Post-Workout card appears within 1s without network (NFR-2)
**And** card shows routine title, duration estimate, “Estirar ahora” and “Ahora no”
**And** “Estirar ahora” navigates to `/stretch/[routineId]` for mapped post-workout routine
**Given** category is `no-especificado`
**When** Home renders
**Then** Post-Workout card is not shown
**And** Daily stretch card remains available (Epic 4)

### Story 2.5: Multi-select Workout Category

As a user,
I want to select one or more training zones after marking today,
So that post-workout stretches match a mixed session without forcing a single chip (FR-14, FR-8, AD-5).

**Source:** Approved sprint change proposal 2026-07-19 — dual-write `category` + optional `categories[]`; one post-workout card; `cuerpo-completo` XOR vs zone chips. Implement after Epic 4 (4.1–4.4) unless PO reorders.

**Acceptance Criteria:**

**Given** chips after mark
**When** I toggle piernas and torso and confirm (“Listo”)
**Then** both are persisted in `categories[]` and legacy `category` primary is set
**And** selecting cuerpo-completo clears other zones (and vice versa)
**And** Omitir still persists `no-especificado` with no post-workout card
**And** legacy WorkoutDays with only `category` still load and show post-workout as before
**And** post-workout shows exactly one card (`getPostWorkoutRoutineForCategories`: single → existing map; multi or cuerpo-completo → `post-cuerpo-completo`)
**And** History list/calendar display all selected zones readably
**And** existing single-category APIs keep working; no wipe of valid v1 localStorage logs

---

## Epic 3: Historial de constancia (30 días)

Martin revisa cuántos días entrenó en el último mes y ve estiramientos completados por día.

### Story 3.1: History View — resumen y calendario 30 días

As a user,
I want to see my last 30 days of workouts at a glance,
So that I know my consistency without guilt metrics (FR-4, FR-5, UJ-2, UX-DR5).

**Acceptance Criteria:**

**Given** I navigate to `/history` from Home link “Historial · últimos 30 días”
**When** the page loads
**Then** I see summary “X de 30 días” counting Workout Days in range (today inclusive, 30 days back)
**And** calendar grid shows registered days with green styling, empty days neutral, today with ring
**And** registered days show category label (`no-especificado` when omitted)
**And** I can identify my count within 10 seconds (NFR-3)
**And** summary updates when returning from Home after mark/unmark without manual refresh

### Story 3.2: Toggle calendario / lista

As a user,
I want to switch between calendar and list views,
So that I can scan history the way I prefer (FR-6).

**Acceptance Criteria:**

**Given** History View is open
**When** I tap Lista segment
**Then** I see rows with date + category for each day in the 30-day range
**When** I switch back to Calendario
**Then** the same data appears in grid form
**And** my preference persists in `prefs.historyView` across sessions

### Story 3.3: Indicador Stretch Session en History

As a user,
I want to see which days I completed stretching,
So that stretching progress is separate from workout marks (FR-4, FR-15 visibility, UX-DR5).

**Acceptance Criteria:**

**Given** I completed a Stretch Session on a date without a Workout Day
**When** I view that date in History
**Then** a secondary neutral indicator (dot or “Estiramientos ✓” in list) appears
**And** the indicator does not use workout green fill
**Given** a day has both Workout Day and Stretch Session
**When** displayed
**Then** both indicators are visible without conflating meanings

---

## Epic 4: Estiramientos guiados (Player)

Martin hace rutinas diarias o post-entreno con temporizador; las sesiones completadas quedan registradas.

### Story 4.1: Contenido stretch-routines.json

As a developer,
I want five embedded stretch routines in Spanish,
So that all player flows work offline (AD-4, FR-7, FR-8).

**Acceptance Criteria:**

**Given** `data/stretch-routines.json`
**When** loaded by stretch-resolver service
**Then** it contains: daily + post-piernas + post-torso + post-cardio + post-cuerpo-completo
**And** each exercise has `id`, `name`, `durationSeconds`, `instruction` (1–2 sentences Spanish)
**And** daily routine has 4–8 exercises, 3–7 min total
**And** each post-workout routine is ≤5 min cooldown, distinct from daily
**And** category→routineId mapping lives in `lib/services/stretch-resolver.ts`

### Story 4.2: Tarjeta rutina diaria en Home

As a user,
I want easy access to daily stretches from Home,
So that I can mobilize even when I haven't trained (FR-7, FR-10, UJ-3).

**Acceptance Criteria:**

**Given** Home loads
**When** today has no Workout Day
**Then** “Rutina diaria” card is visible with duration estimate and “Estirar ahora”
**When** today has Workout Day
**Then** daily card remains accessible below post-workout (if shown) or alone
**And** CTA navigates to `/stretch/daily`
**And** stretch CTA is visually secondary to workout mark button (UX-DR9)

### Story 4.3: Stretch Player — temporizador y controles

As a user,
I want a fullscreen guided stretch session with countdown,
So that I follow each exercise without searching videos (FR-9, UX-DR6, UX-DR10).

**Acceptance Criteria:**

**Given** I open `/stretch/[routineId]`
**When** the player loads
**Then** I see exercise name, monospace countdown, instruction text, progress segments, Pausa / Siguiente / Salir
**And** timer counts down per exercise; at 0 auto-advances or shows completion screen
**And** Pausa freezes timer with “Pausado” label
**And** Siguiente skips to next exercise
**When** I tap Salir
**Then** dialog “¿Salir de la rutina?” always appears (UX-DR7)
**And** confirming exit returns to Home without Stretch Session or Workout Day change
**And** timer changes announce via `aria-live="polite"`

### Story 4.4: Registrar Stretch Session al completar

As a user,
I want completed stretch routines recorded separately from workouts,
So that I track mobility work on its own (FR-15, AD-3, UJ-3).

**Acceptance Criteria:**

**Given** I complete the last exercise in a routine
**When** completion screen shows “Listo. Buen trabajo.”
**Then** repository appends `{ date, routineType, routineId }` to `stretchSessions`
**And** no Workout Day is created or modified
**And** returning to History shows stretch indicator for today (Story 3.3)
**And** multiple stretch sessions same day are allowed

---

## Validation Summary (Step 4)

| Check | Status |
| --- | --- |
| All FR-1…FR-15 mapped to stories | ✅ |
| All UX-DR1…UX-DR10 covered | ✅ |
| Architecture AD-1…AD-9 reflected | ✅ |
| Epic independence (Epic N doesn't require N+1) | ✅ |
| Story sequence — no forward dependencies | ✅ |
| Starter/foundation in Epic 1 Story 1.1 | ✅ |
| Schema/repository before Home mutations | ✅ Story 1.2 before Epic 2 |
| User-value epics (not technical layers only) | ✅ |

**Ready for:** `bmad-dev-story` or `bmad-quick-dev` — implement Epic 1 Story 1.1 first.
