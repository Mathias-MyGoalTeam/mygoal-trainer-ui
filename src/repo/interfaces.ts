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

export interface TrainerDashboardRepository {
  getDashboardSummary(): Promise<DashboardSummary>
  getAssignedAthletesOverview(): Promise<AthleteOverviewEntry[]>
  getPendingVideoReviews(): Promise<PendingVideoReviewEntry[]>
  getRecentMessages(): Promise<RecentMessageEntry[]>
  getTodaysActivities(): Promise<ScheduledActivityEntry[]>
}
