# Sprint S03 De-Briefing — Completing the Dashboard Widget Set

## Sprint Goal

Finish out the trainer dashboard's first row of widgets — replacing the
remaining generic placeholder cards with real, repository-backed widgets —
and bring the whole set to a consistent, polished baseline before moving on
to new areas.

---

## What shipped

**S03-T1 — Today's Activities widget (AP-20)**

- Third real widget, replacing the former "Active Training Plans"
  placeholder: headline count + mocked list of today's scheduled
  activities, one row per activity (an athlete can have more than one on
  the same day).
- Each row shows an activity-kind icon (`activityIcons` composable) and
  athlete name; icon/kind vocabulary matches `mygoal-webapp-ui`'s
  `ActivityKind` values 1:1 so a later real API can reuse it unchanged.

**Messages widget — completing the last placeholder card**

- Fourth and final real widget: headline count + mocked recent-message
  previews (athlete name, message preview, timestamp), each with an avatar
  placeholder consistent with the Athlete Overview widget's fallback image.
- Same non-functional "Alle anzeigen" stub pattern as Pending Video
  Reviews/Today's Activities — a placeholder for a future full inbox view,
  intentionally not built this sprint.
- `TrainerDashboardRepository` gained `getRecentMessages()`, and
  `DashboardSummary` gained `recentMessagesCount`, following the same
  interface → mock → store → widget wiring as the other three widgets.

**Widget consistency pass**

- Extracted a shared `DASHBOARD_WIDGET_PREVIEW_LIMIT` composable constant
  (`dashboardWidgetPreview.ts`) so all four widgets (Athlete Overview,
  Pending Video Reviews, Today's Activities, Messages) cap their collapsed
  list to the same number of rows, instead of each hardcoding its own
  limit.
- Added hidden placeholder rows to pad short lists up to that shared limit,
  so a widget with e.g. only 1 pending review still renders at the same
  card height as its neighbors — the dashboard grid no longer has
  visibly uneven card heights when list lengths differ.
- `Dashboard.vue` simplified: dropped the last bit of inline
  `DashboardWidget`/`BaseCard` placeholder scaffolding now that every card
  is a dedicated widget component.

---

## What's demoable right now

Opening the app lands on `/dashboard` showing all four widgets fully
wired to mocked data: Athlete Overview (expand/collapse), Pending Video
Reviews, Today's Activities, and Messages — all at consistent card
heights regardless of how many rows each list happens to have. Still all
in German by default, switching to English per browser locale.

## Explicitly out of scope / deferred (by design)

- **Real data** — everything is still mocked; `DashboardSummary` fields
  remain provisional pending **AP-04** (final DB schema).
- **Athlete status logic** — still placeholder labels only (**AP-21**).
- **Activity completion/feedback workflow** — Today's Activities is
  read-only; that workflow is separate (**AP-20** follow-up).
- **Full messages/inbox view, conversation, and sending** — Messages
  widget is preview-only; the "Alle anzeigen" button is a non-functional
  stub, same as the other widgets' list-expansion placeholders.
- **Video thumbnails / playback / analysis pipeline** — not touched.
- **Authentication/login** — still no auth flow; `/` redirect to
  `/dashboard` remains a temporary stand-in.

## Suggested next-sprint candidates

1. Scope the full "Alle anzeigen" destinations (pending reviews list,
   activities list, messages/inbox) as their own views now that all four
   dashboard cards exist.
2. Start scoping the mobile communication-focused view as its own
   initiative (still deferred from S02).
3. Decide on the real backend contract for `DashboardSummary` once AP-04
   lands, and swap the mock repository for all four widgets at once.
