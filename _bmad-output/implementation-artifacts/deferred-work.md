# Deferred Work

Items deferred from code reviews and planning — not blocking current story.

---

## Deferred from: code review of 1-1-initialize-nextjs-pwa (2026-07-11)

- **PWA icon assets missing** — `public/manifest.webmanifest` references `/icons/icon-192.png` and `icon-512.png` not yet in repo. Target: Stories 1.3, 1.5 (FR-11).
- **Home link to `/history` returns 404** — placeholder UI until Story 3.1 creates `app/history/page.tsx`.
- **CTA buttons inert** — intentional scaffold; wired in Epic 2 stories.
- **Safe-area insets for notch devices** — formalize in Story 1.4 (design tokens/layout).
- **Vitest jsdom for component tests** — configure when first `*.test.tsx` is added (Epic 2+).

---

## Deferred from: code review of 1-2-exercise-log-repository (2026-07-11)

- **Cross-tab localStorage sync** — no `window.storage` listener; changes in another tab won't refresh React until reload. Not in Story 1.2 AC; consider for PWA hardening later.

---

## Deferred from: code review of 2-1-today-status-mark (2026-07-12)

- **Midnight rollover stale `todayDate`** — `useToday()` recalculates `todayLocalDate()` only on re-render; tab open past midnight without log mutation may show yesterday's registered state and block marking the new day until reload. Acceptable MVP edge case; consider `visibilitychange` listener or midnight timer in future hardening.

---

## Deferred from: code review of 2-2-unmark-workout (2026-07-12)

- **Midnight rollover affects unmark** — same limitation as Story 2.1; `unmarkToday()` uses stale `todayLocalDate()` if tab crosses midnight without re-render. Inherited defer; harden with visibility listener or midnight timer.

---

## Deferred from: code review of 2-3-category-chips (2026-07-12)

- **Midnight rollover stale `todayDate` affects category selection** — inherited from Story 2.1; category helpers use `todayLocalDate()` only on re-render.
- **Reload between mark and chip tap hides selector** — accepted MVP edge case documented in story Dev Notes; category stays `no-especificado`.
- **Hardcoded hex colors on category chips** — `#DCFCE7` / `#16A34A` inline; defer token extraction until design-token story (1.4).

---

## Deferred from: code review of 2-4-post-workout-card (2026-07-12)

- **`/stretch/[routineId]` 404** — Link wired per AC; Stretch Player page is Story 4.3.
- **Session-only post-workout dismiss** — reload re-shows card; no schema pref added in MVP.
- **Hide card after post-workout stretch completed** — EXPERIENCE cold-open "no se inició" nuance; integrate when Story 4.4 logs stretch sessions from player.

---

## Deferred from: code review of 3-1-history-summary-calendar (2026-07-12)

- **Midnight rollover stale `todayDate` in useHistory** — inherited from Story 2.1.
- **Hardcoded hex on history calendar cells** — defer token extraction until Story 1.4 hardening or design pass.
- **Category short labels in domain** — `getCategoryShortLabel` in domain vs copy; list view now uses `getCategoryDisplayLabel` from copy (3.2); calendar short labels remain in domain.

---

## Deferred from: code review of 3-2-calendar-list-toggle (2026-07-12)

- **Hardcoded hex `#E5E5E5` on toggle track** — same pattern as history calendar cells; defer token extraction until design-token hardening pass.
- **Midnight rollover stale `todayDate` in useHistory** — inherited from Story 2.1; list/calendar both use `todayLocalDate()` only on re-render.
