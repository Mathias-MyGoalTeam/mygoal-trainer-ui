# Sprint S02 De-Briefing — Trainer Dashboard & Design System Foundations

## Sprint Goal

Establish the visual design system, landing page, and first real dashboard
widgets for the trainer app, in Mocked Mode (no backend), with a deliberate
desktop-first approach that diverges from the mobile-first customer-facing
app.

---

## What shipped

**S02-T1 — Design system basics**

- Extracted design tokens (colors, typography, spacing, radius, shadows)
  from `mygoal-webapp-ui` into reusable SCSS variables — no more one-off
  hardcoded values.
- Adapted 3 base atoms as a starting point: `BaseButton`, `BaseInput`,
  `BaseCard`.
- Documented in [docs/design-principles.md](../design-principles.md): where
  the design language comes from, and — critically — **why this app is
  desktop-first** while the sibling webapp is mobile-first (different use
  case: planning/review work at a desk vs. quick mobile communication).

**S02-T2 — Dashboard route & page skeleton**

- `/dashboard` is now the app's default landing route (temporary, until a
  real login flow exists).
- Built a desktop-first widget grid (verified at ≥1280px) holding 4+ card
  slots.

**Navigation (added mid-sprint on request)**

- App-wide hamburger menu: persistent header + slide-in drawer, with
  backdrop click, Escape key, and auto-close on navigation. Wired once in
  `App.vue`, so it's live on every future route automatically.

**Localization (added mid-sprint on request)**

- Adopted `vue3-gettext`, matching the pattern already used in
  `mygoal-webapp-ui`.
- **German is the source language** for all UI strings; English
  translations are maintained in `.po` files and compiled to
  `translations.json`. All dashboard/nav copy translated.

**S02-T3 — TrainerDashboardRepository (mock)**

- Typed repository interface + mock implementation for dashboard summary
  data (assigned athletes, pending video reviews, active training plans
  counts).
- Dashboard reads all counts through a Pinia store backed by this
  repository — nothing hardcoded, and structured to be swapped for a real
  API later with no component changes.

**S02-T4 — Athlete Overview widget**

- First "real" widget: headline count + preview list of mocked athletes
  (name, placeholder status, avatar).
- Avatar placeholder reused from `mygoal-webapp-ui`'s existing generic
  silhouette asset rather than inventing a new one.
- Full 8-athlete mocked roster; the card expands in place to show everyone
  and collapses back — without affecting the height of neighboring cards.

**S02-T5 — Pending Video Reviews widget**

- Second real widget: headline count + mocked review list, each with a
  video-thumbnail placeholder (icon shape reused from `mygoal-webapp-ui`),
  athlete name, and status.
- Includes a visibly disabled "View all" button as a placeholder for the
  future full review-list feature — intentionally non-functional this
  sprint.

---

## Process / housekeeping note

Mid-sprint we caught that work had been committed directly to `main`, when
the team's actual integration branch is `develop`. No work was lost (it had
already been merged into `develop` via PR), but we corrected course: created
`S02-Design-Base` off `develop` and moved all subsequent S02 work there.

**Action item:** confirm branching convention (feature branches off
`develop`, PRs back into `develop`) is written down somewhere the whole team
can reference.

---

## What's demoable right now

Opening the app lands on `/dashboard` showing 4 widgets: Athlete Overview
(with working expand/collapse), Pending Video Reviews, and two simpler
count-only cards (Active Training Plans, Messages). Hamburger menu is
functional (currently just links to Dashboard). All in German by default,
switches to English automatically if the browser locale is English.

## Explicitly out of scope / deferred (by design)

- **Mobile view** — not built at all this sprint; it's a deliberately
  separate future experience, not a responsive shrink of desktop (per
  design-principles.md).
- **Real data** — everything is mocked; `DashboardSummary` fields are
  provisional pending **AP-04** (final DB schema).
- **Athlete status logic** — placeholder labels only; real logic is
  **AP-21**.
- **Video thumbnails / playback / analysis pipeline** — not touched.
- **Full pending-reviews list view** — the "View all" button is a
  non-functional stub only.
- **"Active Training Plans" and "Messages" widgets** — still generic
  count/title cards, not yet built out like the Athlete/Video-Review
  widgets.
- **Authentication/login** — still no auth flow; `/` redirect to
  `/dashboard` is a temporary stand-in.

## Suggested next-sprint candidates

1. Build out "Active Training Plans" and "Messages" as real widgets (same
   pattern as T4/T5).
2. Start scoping the mobile communication-focused view as its own
   initiative.
3. Decide on the real backend contract for `DashboardSummary` once AP-04
   lands, and swap the mock repository.
