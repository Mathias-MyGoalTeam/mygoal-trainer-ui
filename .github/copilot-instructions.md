# Copilot instructions for mygoal-trainer-ui

## Browser and visual-test validation

This is a Vite application. Do not use `npm run dev` as a blocking validation
command for browser, screenshot, or visual tests: the Vite dev server is a
long-lived process and intentionally does not exit.

For browser-based or visual validation, use the production preview flow:

1. Run `CI=true npm run build`.
2. Start `npm run preview:ci` as a background server.
3. Wait for `http://127.0.0.1:4173/` to respond before opening a browser or
   running a visual tool.
4. Stop the preview server after validation.

`preview:ci` binds to `127.0.0.1` with `--strictPort`, so agents and CI jobs
can rely on the app being available at `http://127.0.0.1:4173/`.

Vue DevTools are disabled when `CI=true` to avoid dev-only browser automation
noise during CI and visual-test runs.

## Sprint debrief workflow

Sprint debriefs live in `docs/sprint-reviews/` and follow the existing
`SNN-debrief.md` naming pattern, for example `S02-debrief.md` and
`S03-debrief.md`.

When asked to create or update a sprint debrief:

1. Check the existing debrief files in `docs/sprint-reviews/` first.
2. Match their structure and tone:
   - Sprint Goal
   - What shipped
   - What's demoable right now
   - Explicitly out of scope / deferred
   - Process / housekeeping notes, when relevant
   - Suggested next-sprint candidates
3. Write the debrief in `docs/sprint-reviews/`, not in the README or a new
   documentation location.
4. Keep the debrief factual and tied to changes already present in the repo.
   If details are uncertain, inspect the relevant source files and docs before
   writing.
