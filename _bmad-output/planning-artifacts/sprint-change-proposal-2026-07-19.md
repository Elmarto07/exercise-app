# Sprint Change Proposal — Multi-select Workout Category chips

**Date:** 2026-07-19  
**Project:** exercise-app (Marca Fit)  
**Trigger:** Product feedback during Story 4.1 content review — `cuerpo-completo` as a single exclusive chip poorly models real sessions where multiple zones were trained.  
**Requested option:** Multi-select chips (option 1), **without breaking** existing logic/code paths.  
**Mode:** Batch  
**Status:** Approved 2026-07-19 (Martin)  
**Scope:** Moderate  
**Handoff:** PO/DEV — Story 2.5 after Epic 4 (4.1→4.4); planning artifact updates with or before 2.5

---

## 1. Issue Summary

### Problem

Today the user must pick **exactly one** Workout Category after marking today:

`piernas | torso | cardio | cuerpo-completo | no-especificado`

`cuerpo-completo` is treated as “one more category” with its own post-workout routine, but real sessions are often **piernas + torso** (etc.). Forcing a single chip either:

- under-describes the session, or  
- forces the vague `cuerpo-completo` bucket even when the user knows the zones.

### Discovery context

- Surfaced while reviewing Epic 4 stretch content consistency (Story 4.1).  
- Not a runtime bug — product/model gap vs how Martin actually trains.  
- Constraint from user: **do not break** existing persistence, History, post-workout gating (AD-5), or resolver mapping.

### Evidence (current system)

| Layer | Behavior |
| --- | --- |
| Schema | `WorkoutDay.category: string` (one value) — `lib/domain/types.ts`, `lib/storage/schema.ts` |
| UI | `role="radiogroup"` single-select — `workout-category-selector.tsx` |
| Post-workout | 1 concrete category → 1 routine — `stretch-resolver.ts` |
| History | One label per day — list/calendar |
| Docs | FR-14, FR-8, AD-5, UX chips all assume one category |

---

## 2. Impact Analysis

### Checklist status (batch)

| Section | Items | Status |
| --- | --- | --- |
| 1. Trigger & context | 1.1–1.3 | [x] Done |
| 2. Epic impact | 2.1–2.5 | [x] Done |
| 3. Artifact conflicts | 3.1–3.4 | [x] Done |
| 4. Path forward | 4.1–4.4 | [x] Done — recommend Direct Adjustment (hybrid timing) |
| 5. Proposal components | 5.1–5.5 | [x] Done (this document) |
| 6. Final review | 6.1–6.2 | [x] Done — 6.3–6.5 await approval |

### Epic impact

| Epic | Impact |
| --- | --- |
| **Epic 1** | None |
| **Epic 2** (done) | Behavioral extension of Stories 2.3 / 2.4 — **no rollback**. Add a **new follow-up story** (proposed **2.5**) rather than reopening done stories as incomplete. |
| **Epic 3** | History list/calendar labels must show multi (FR-4). Small additive change in display helpers. |
| **Epic 4** (in progress) | Stretch **content** (4.1) and Player (4.3–4.4) stay 1 routine per session. Post-workout still resolves to **one** `routineId`. Daily card (4.2) unaffected. Finish 4.1 patches / 4.2 review / 4.3–4.4 **before or in parallel** with planning 2.5 — **implement 2.5 after Player MVP** recommended to avoid mid-Player thrash. |
| **New epic?** | Not required if 2.5 fits under Epic 2 (category UX) or as Epic 4.5 “category multi-select” — prefer **Story 2.5 under Epic 2** for FR-14 ownership. |

### Artifact conflicts

| Artifact | Conflict | Action |
| --- | --- | --- |
| **PRD** | FR-14 “un solo toque”; glossary “una Workout Category”; UJ-1 path | Update FR-14 + glossary: allow 1..N concrete zones; omit still `no-especificado` |
| **Architecture** | AD-5 + schema example single `category` | Extend AD-5 / data conventions: dual-write `category` + optional `categories[]`; keep post-workout **one card** |
| **UX** | EXPERIENCE chips as radiogroup; mockups single selected | Chips → toggle group + commit; `cuerpo-completo` XOR vs zone chips |
| **Epics** | Stories 2.3 / 2.4 AC single-select | Add Story 2.5; amend FR-14 mapping; note 2.3/2.4 as superseded for multi behavior |
| **Addendum** | Category enum single | Document `categories?` + migration note (no forced `v: 2` if dual-write) |
| **CI / deploy** | N/A | [N/A] |

### Technical impact (code) — compatibility-first design

**Chosen storage shape (backward compatible):**

```ts
interface WorkoutDay {
  date: string;
  category: WorkoutCategory;                 // ALWAYS present (legacy primary)
  categories?: ConcreteWorkoutCategory[];    // optional; absent = legacy single
}
```

**Rules that preserve current logic:**

1. **Read path:**  
   `effectiveCategories = day.categories?.length  
     ? day.categories  
     : (isConcreteCategory(day.category) ? [day.category] : [])`  
   Legacy days without `categories` behave **exactly as today**.

2. **Write path (dual-write):**  
   - Omit → `category: "no-especificado"`, omit or `[]` `categories`.  
   - One zone → `category` = that zone, `categories: [zone]`.  
   - Multi zones → `categories: [...]` sorted stable, `category = categories[0]` (primary for any code still reading only `category`).  
   - `cuerpo-completo` alone → `category` + `categories: ["cuerpo-completo"]`.

3. **XOR for `cuerpo-completo`:** selecting it clears piernas/torso/cardio; selecting any zone clears `cuerpo-completo`. Prevents nonsensical stacks.

4. **Post-workout stays one card (no N cards, no merge engine in MVP):**  
   New helper `getPostWorkoutRoutineForCategories(cats)`:
   - `[]` → no card (AD-5 preserved)  
   - length 1 → existing map (unchanged)  
   - includes `cuerpo-completo` **or** ≥2 of {piernas, torso, cardio} → `post-cuerpo-completo`  
   Keep `getPostWorkoutRoutineId(single)` as thin wrapper → **Story 2.4 / resolver callers don’t break**.

5. **Schema version:** Prefer stay on `v: 1` if parse continues to require `category` and **ignores unknown keys** (current behavior). Validate `categories` when present; invalid array → fall back to `category` only. Avoid full log reset.

6. **UI:** Change selector from `radiogroup` to checkbox-style toggles + **“Listo”** (or equivalent) so multi can be confirmed without closing on first tap. Omit unchanged.

7. **History:** Labels join with ` · ` (e.g. `Piernas · Torso`); calendar short e.g. `P+T` / keep `c. compl.` for single cuerpo-completo.

8. **Prefs:** Keep `lastCategory` as last primary; optional later `lastCategories[]` — not required for v1 of this change.

**Files expected to change (implementation story):**

- `lib/domain/types.ts`, `categories.ts`, `history-window.ts`
- `lib/storage/schema.ts`, `exercise-log-repository.ts`
- `lib/hooks/use-today.ts`
- `lib/services/stretch-resolver.ts`
- `components/home/workout-category-selector.tsx`, `home-workout-section.tsx`
- `components/history/history-list.tsx`, `history-calendar.tsx` (via helpers)
- Tests colocated for the above  
- **Do not** change Player, stretch JSON content model, or daily card for this proposal

---

## 3. Recommended Approach

### Options evaluated

| Option | Verdict |
| --- | --- |
| **1. Direct Adjustment** — new Story 2.5 + doc updates; dual-write schema | **Viable** — Medium effort, Low–Medium risk |
| **2. Rollback** Epic 2 category work | **Not viable** — destroys working Home; unjustified |
| **3. MVP cut** — defer multi-select to post-MVP | Viable alternative if timeline pressure |

### Selected: **Option 1 — Direct Adjustment** (Hybrid timing)

- **What:** Additive story + planning artifact updates; compatibility layer so single-category code paths keep working.  
- **When:** **Finish Epic 4 Player path (4.1→4.4)** first; then implement Story **2.5** (or schedule 2.5 immediately after 4.1 content patches if you prefer category UX before Player — default recommendation is **after 4.4**).  
- **Why:** Meets product need; avoids rollback; does not invalidate stretch content work; keeps one post-workout CTA and offline routines.  
- **Effort:** Medium (schema + chips UX + resolver rule + history labels + tests).  
- **Risk:** Low–Medium (dismiss key, History density, SM-1 ≤7s with “Listo”).  
- **MVP:** Still achievable; multi-select is an **MVP enhancement** if you accept one extra story after Epic 4, or **post-MVP** if you want zero scope growth now.

---

## 4. Detailed Change Proposals

### 4.1 PRD

**Section:** Glossary — Workout Category / Workout Day  

**OLD:** One optional category per Workout Day.  

**NEW:** Workout Day may have zero (`no-especificado`) or **one or more** concrete zone categories. Persistence keeps a legacy primary `category` plus optional `categories[]`.  

**Section:** FR-14  

**OLD:** Single-tap selects one category.  

**NEW:** User may toggle one or more of {piernas, torso, cardio} **or** choose cuerpo-completo (exclusive). Confirm with explicit control (“Listo”). Omit → `no-especificado`. Flow target remains ≤7s mediana where possible.  

**Section:** FR-8  

**OLD:** Suggestion for the single concrete category.  

**NEW:** Suggestion resolved from the selected set to **exactly one** embedded post routine (single → map; multi or cuerpo-completo → `post-cuerpo-completo`). Still hidden if omitted.  

**Rationale:** Product accuracy without multiplying Player sessions in MVP.

---

### 4.2 Architecture

**Section:** AD-5 + data conventions  

**OLD:** Post-workout iff `category ∈ concrete` (singular).  

**NEW:** Post-workout iff `effectiveCategories.length ≥ 1`. Resolution via `getPostWorkoutRoutineForCategories`. Schema dual-write documented; `category` never removed.  

**Rationale:** Preserves AD-5 intent (no card when omitted) and AD-4 (static routines).

---

### 4.3 UX (EXPERIENCE / DESIGN)

**OLD:** Category chips as radio group; one tap persists and closes.  

**NEW:**  
- Zone chips = multi toggle.  
- `Cuerpo completo` = exclusive shortcut.  
- Primary action “Listo” commits selection; “Omitir” unchanged.  
- Suggested highlights may use last primary / last set.  
- Post-workout: still **one** card below mark flow.  

**Mockups:** Update unmarked/marked Home notes; marked mockup should show multi-selected chips state if illustrated.

---

### 4.4 Epics / Stories

**Story 2.3 / 2.4:** Leave status `done`; add note “behavior extended by 2.5”.  

**NEW Story 2.5: Multi-select Workout Category** (draft AC)

```
As a user,
I want to select one or more training zones after marking today,
So that post-workout stretches match a mixed session without lying with a single chip.

Acceptance Criteria:
1. Given chips after mark, When I toggle piernas and torso and confirm, Then both are persisted (categories[]) and category primary is set.
2. And selecting cuerpo-completo clears other zones (and vice versa).
3. And Omitir still persists no-especificado with no post-workout card.
4. And legacy WorkoutDays with only category still load and show post-workout as today.
5. And post-workout shows exactly one card resolved per multi-select rules.
6. And History list/calendar display all selected zones readably.
7. And getPostWorkoutRoutine(single) / existing single-category callers keep working.
8. And no schema wipe of existing localStorage for valid v1 logs.
```

**Sprint sequencing (recommended):**

1. Close 4.1 open patches + 4.1/4.2 code reviews as planned.  
2. Implement 4.3 → 4.4.  
3. `create-story` 2.5 → `dev-story` 2.5.  
4. Sync planning artifacts (PRD/UX/Architecture/epics) in the same PR as 2.5 or a preceding chore PR.

**Alternative sequencing:** Implement 2.5 immediately after 4.1 content consistency if multi-select is higher priority than Player — user choice at approval.

---

### 4.5 Story 4.1 content (related, optional coupling)

Multi-select does **not** require changing 4.1 JSON structure.  
Still recommended (separate from this proposal): update post-* `meta` strings for consistency; keep a balanced `post-cuerpo-completo` because it becomes the **multi-zone cooldown** under the resolution rule above.

---

## 5. Implementation Handoff

### Scope classification: **Moderate**

- Needs backlog + story creation + coordinated doc updates.  
- Implementation is localized but crosses Home, storage, History, resolver.

### Handoff

| Role | Responsibility |
| --- | --- |
| **Martin (PO)** | Approve this proposal; choose sequencing (after 4.4 vs after 4.1). |
| **PM / docs** | Apply PRD / epics / UX / architecture edits (or via `create-story` + chore). |
| **Dev agent** | Implement Story 2.5 per dual-write design; tests for legacy + multi; no Player rewrite. |

### Success criteria

- [ ] Legacy single-category days unchanged in behavior  
- [ ] Multi piernas+torso → one post card `post-cuerpo-completo`  
- [ ] Single piernas → still `post-piernas`  
- [ ] Omit → no post card  
- [ ] History readable for multi  
- [ ] `bun test` / lint / build green  
- [ ] Planning artifacts updated to match

### Explicitly out of scope for this change

- Multiple stacked post-workout cards  
- Merging exercise arrays into a new dynamic routine  
- Schema `v: 2` forced migration / wiping logs  
- AI stretch suggestions  
- Changing daily stretch card (4.2)

---

## 6. Checklist completion notes

- **Rollback:** rejected.  
- **MVP:** remains achievable; multi-select is additive story.  
- **sprint-status.yaml:** on approval, add `2-5-multi-select-workout-category: backlog` (and keep epic-2 `done` or set `in-progress` only while 2.5 runs — recommend leave epic-2 done and track 2.5 under epic-2 or a small “Epic 2 follow-ups” note).  

---

## Approval

- **2026-07-19:** Structure accepted (Continue).  
- **2026-07-19:** Explicit approval **yes** (Martin).  
- **Applied:** `sprint-status.yaml` ← `2-5-multi-select-workout-category: backlog`; `epics.md` ← Story 2.5 + FR-14 mapping.  
- **Deferred to Story 2.5 / chore PR:** full PRD, Architecture AD-5, UX EXPERIENCE/DESIGN wording updates.
