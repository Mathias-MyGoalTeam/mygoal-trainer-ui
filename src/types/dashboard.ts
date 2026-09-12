// Provisional dashboard summary shape - field set may change once AP-04
// finalizes the real database schema. Kept separate from the mock data so
// the repository interface can stay stable as fields evolve.
export interface DashboardSummary {
  assignedAthletesCount: number
  pendingVideoReviewsCount: number
  activeTrainingPlansCount: number
}

// Preview entry for the Athlete Overview dashboard widget (S02-T4).
// `status` is a display-only placeholder with no real status logic yet -
// that belongs to AP-21. `avatarUrl` is optional and expected to stay
// undefined in Mocked Mode; the widget falls back to a generic placeholder
// image when it's missing (real profile images come later from user data).
export interface AthleteOverviewEntry {
  id: string
  name: string
  status: string
  avatarUrl?: string
}

// Preview entry for the Pending Video Reviews dashboard widget (S02-T5).
// `status` is a display-only placeholder (e.g. "pending") with no real
// review-workflow logic yet. `thumbnailUrl` is optional and expected to
// stay undefined in Mocked Mode; the widget falls back to a generic
// placeholder thumbnail when it's missing - real thumbnails will come later
// from the video-analysis pipeline, not built here.
export interface PendingVideoReviewEntry {
  id: string
  athleteName: string
  status: string
  thumbnailUrl?: string
}
