import type { TrainerDashboardRepository } from '@/repo/interfaces'
import type {
  AthleteOverviewEntry,
  DashboardSummary,
  PendingVideoReviewEntry,
} from '@/types/dashboard'

// Sample values only - no API/DB calls. Field set is provisional and may
// change once AP-04 finalizes the real database schema.
const dashboardSummary: DashboardSummary = {
  assignedAthletesCount: 8,
  pendingVideoReviewsCount: 3,
  activeTrainingPlansCount: 5,
}

// Full mocked roster for the Athlete Overview widget (S02-T4). Matches
// assignedAthletesCount above 1:1 - the widget itself decides how many of
// these to show by default and expands to the rest on demand, but the data
// behind "all athletes" is real (mocked) data, not fabricated in the UI.
// `status` values are placeholder labels only (no real status logic yet -
// see AP-21); `avatarUrl` is left unset so the widget falls back to a
// generic placeholder avatar.
const athleteOverview: AthleteOverviewEntry[] = [
  { id: 'athlete-1', name: 'Lena Hoffmann', status: 'Aktiv' },
  { id: 'athlete-2', name: 'Jonas Weber', status: 'Aktiv' },
  { id: 'athlete-3', name: 'Sophie Bauer', status: 'Pausiert' },
  { id: 'athlete-4', name: 'Finn Krüger', status: 'Neu' },
  { id: 'athlete-5', name: 'Mara Vogel', status: 'Aktiv' },
  { id: 'athlete-6', name: 'Paul Nguyen', status: 'Pausiert' },
  { id: 'athlete-7', name: 'Emilia Fischer', status: 'Aktiv' },
  { id: 'athlete-8', name: 'Noah Schmidt', status: 'Neu' },
]

// Mocked list for the Pending Video Reviews widget (S02-T5). Matches
// pendingVideoReviewsCount above 1:1. `status` values are placeholder labels
// only - no real review-workflow logic yet; `thumbnailUrl` is left unset so
// the widget falls back to a generic placeholder thumbnail (real thumbnails
// will come later from the video-analysis pipeline, not built here).
const pendingVideoReviews: PendingVideoReviewEntry[] = [
  { id: 'review-1', athleteName: 'Lena Hoffmann', status: 'Ausstehend' },
  { id: 'review-2', athleteName: 'Jonas Weber', status: 'Ausstehend' },
  { id: 'review-3', athleteName: 'Sophie Bauer', status: 'In Prüfung' },
]

export const mockTrainerDashboardRepository: TrainerDashboardRepository = {
  async getDashboardSummary() {
    return dashboardSummary
  },
  async getAssignedAthletesOverview() {
    return athleteOverview
  },
  async getPendingVideoReviews() {
    return pendingVideoReviews
  },
}
