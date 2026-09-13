// Repository interfaces only - stores/components should not import a
// concrete (mock/real) implementation of these directly. Instead, go
// through the Data-Hub (`src/data-hub/`), which is the single place that
// resolves which implementation backs each interface. See
// `src/data-hub/registry.ts` and README.md ("Data-Hub" section).
import type { AssignedUser, TrainerProfile } from '@/types/trainer'
import type {
  AthleteOverviewEntry,
  DashboardSummary,
  PendingVideoReviewEntry,
  RecentMessageEntry,
  ScheduledActivityEntry,
} from '@/types/dashboard'

export interface TrainerRepository {
  getProfile(): Promise<TrainerProfile>
  getAssignedUsers(): Promise<AssignedUser[]>
}

// Resolved through the Data-Hub as `trainerDashboard` - see
// `src/stores/dashboard.ts` for the reference implementation of a
// Data-Hub-backed store.
export interface TrainerDashboardRepository {
  getDashboardSummary(): Promise<DashboardSummary>
  getAssignedAthletesOverview(): Promise<AthleteOverviewEntry[]>
  getPendingVideoReviews(): Promise<PendingVideoReviewEntry[]>
  getRecentMessages(): Promise<RecentMessageEntry[]>
  getTodaysActivities(): Promise<ScheduledActivityEntry[]>
}
