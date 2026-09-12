// Shared preview-size constant for the dashboard widget cards
// (AthleteOverviewWidget, PendingVideoReviewsWidget, TodaysActivitiesWidget,
// MessagesWidget). All four widgets share the same card layout (title,
// count, list, "Alle anzeigen" button), so capping every list to the same
// number of rows keeps their initial (collapsed) heights aligned in the
// dashboard grid - independent of how many real items each list happens to
// hold.
export const DASHBOARD_WIDGET_PREVIEW_LIMIT = 4
