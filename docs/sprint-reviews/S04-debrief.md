# Sprint S04 De-Briefing — Architecture Foundation & App Scaffolding

## Sprint Goal

Move the trainer app beyond the dashboard-only foundation by establishing
the reusable architecture, route structure, component library, and data
access patterns needed for upcoming feature work — still in Mocked Mode,
but prepared for real API/server integration later.

---

## What shipped

**S04-T1 — Component library expansion**

- Expanded the shared `Base*` component set beyond the original atoms from
  S02.
- Added reusable UI building blocks for common future workflows: status
  pills, badges, icons, loading and skeleton states, empty states, form
  fields, date/time inputs, modals, confirmation dialogs, toast messages,
  breadcrumbs, page headers, tables, filters, and pagination.
- Kept these components presentation-focused and feature-agnostic, so later
  pages can compose them without embedding business logic in generic UI
  primitives.
- Documented the informal atom/molecule/organism grouping in the README so
  future contributors and agents can find the right component instead of
  creating duplicates.

**S04-T2 — Data-Hub architecture**

- Introduced `src/data-hub/` as the single frontend access layer for data.
- Stores now resolve repositories through `dataHub.getRepository(key)`
  instead of importing mock implementations directly.
- Added lightweight per-session caching via `dataHub.fetch(cacheKey,
  loader)`, so repeated reads in the same browser session do not
  automatically re-fetch identical data.
- Added `useDataHubQuery()` for consistent loading/error handling around
  store-level load actions.
- Migrated the dashboard store as the first reference implementation:

  ```text
  Vue component
    -> Pinia store
      -> Data-Hub
        -> Mock or real repository
  ```

- Kept `VITE_MOCKED_MODE` as the switch for mock-vs-real repository
  resolution. Mocked Mode remains the default unless explicitly disabled.

**S04-T3 — Route and page scaffolding**

- Added the broader trainer app route structure beyond `/dashboard`.
- Scaffolded trainer product areas for:
  - Athletes
  - Athlete profile
  - Training plans
  - Video review
  - Messages
  - Appointments
  - Billing
  - Settings
- Added structural placeholder pages where full feature work is still
  pending, so navigation and information architecture can be validated
  before each feature is built out.
- Added a route-level permission metadata pattern and `PermissionGuard`
  wrapper. Permissions currently always allow access in Mocked Mode, but
  the structure is now ready for a future real auth/permission system.

**Athletes and Billing table foundations**

- Added early table-based list views for Athletes and Billing using the
  shared table/pagination/filter building blocks.
- Introduced TanStack Table as the intended table foundation for richer
  list views.
- Kept the current data mocked/static where the corresponding real domain
  repositories do not exist yet.

**Visual/browser validation workflow**

- Added a CI-safe preview command:

  ```bash
  npm run preview:ci
  ```

- `preview:ci` runs Vite preview on `127.0.0.1` with a strict port, giving
  browser and visual tools a predictable URL:

  ```text
  http://127.0.0.1:4173/
  ```

- Disabled Vue DevTools when `CI=true` to reduce browser-automation noise.
- Added `.github/copilot-instructions.md` so future agents do not run
  `npm run dev` as a blocking visual-test command. `npm run dev` is a
  long-lived Vite server and intentionally does not exit.

---

## What's demoable right now

Opening the app still lands on `/dashboard`, with the completed mocked
dashboard widget set from S03. The navigation now exposes the wider trainer
app structure, including Athletes, Training Plans, Video Review, Messages,
Appointments, Billing, and Settings.

Several of those pages are structural placeholders, but they are reachable
routes with consistent page framing. Athletes and Billing also demonstrate
the emerging table/list foundation.

The app continues to run fully standalone in Mocked Mode.

## Explicitly out of scope / deferred (by design)

- **Real API/server data** — the Data-Hub is ready for real repositories,
  but real API-backed implementations are not connected yet.
- **Authentication/login** — no real auth flow exists yet; permission checks
  are structural only and always allow in Mocked Mode.
- **Server-side authorization** — must be implemented by the backend later;
  frontend route guards are only UX hints, not a security boundary.
- **Full feature workflows** — scaffolded pages like Training Plans,
  Video Review, Messages, Appointments, and Settings are not complete
  product workflows yet.
- **Production mock restrictions** — fallback-to-mock is useful during the
  migration phase, but production should eventually fail loudly if
  `VITE_MOCKED_MODE=false` and a real repository is missing.
- **Full visual regression suite** — the safer preview-server pattern is in
  place, but Playwright/visual testing itself is not yet fully configured.
- **Mobile experience** — still deferred as its own future communication-
  focused experience, not a responsive shrink of the desktop trainer app.

## Process / housekeeping note

We identified a recurring trap for browser/visual validation: running
`npm run dev` as if it were a finite test command. Because it starts a
long-lived Vite dev server, jobs or agents waiting for it to exit will look
stuck.

The documented validation pattern for agents and CI is now:

1. Run `CI=true npm run build`.
2. Start `npm run preview:ci` in the background.
3. Wait for `http://127.0.0.1:4173/` to respond.
4. Run the browser/visual validation.
5. Stop the preview server afterwards.

## Suggested next-sprint candidates

1. Implement the first real API-backed repository, preferably starting with
   `TrainerDashboardRepository` because the dashboard already follows the
   Data-Hub reference pattern.
2. Agree the backend API contract for dashboard and list data: endpoint
   URLs, response shapes, auth mechanism, error format, status/enum values,
   and date/time format.
3. Tighten production behavior so missing real repositories do not silently
   fall back to mock data when `VITE_MOCKED_MODE=false`.
4. Build out one scaffolded route into a real workflow, using the new
   component library and Data-Hub pattern.
5. Add a real browser/visual test setup that uses the new `preview:ci`
   lifecycle instead of `npm run dev`.
