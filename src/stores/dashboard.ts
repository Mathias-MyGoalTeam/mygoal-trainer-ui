import { defineStore } from 'pinia'
import { ref } from 'vue'

import { dataHub, useDataHubQuery } from '@/data-hub'
import type {
  AthleteOverviewEntry,
  DashboardSummary,
  PendingVideoReviewEntry,
  RecentMessageEntry,
  ScheduledActivityEntry,
} from '@/types/dashboard'

// Reference implementation for reading data through the Data-Hub (see
// src/data-hub/ and README.md "Data-Hub" section) - all future
// feature/domain stores should follow this same pattern:
//   - resolve the repository via `dataHub.getRepository(...)`, never import
//     a mock/real repository module directly
//   - wrap individual reads in `dataHub.fetch(cacheKey, loader)` for
//     per-session caching
//   - wrap the whole "load" action in `useDataHubQuery().run(...)` for
//     shared isLoading/error handling instead of hand-rolled try/finally
export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null)
  const athletes = ref<AthleteOverviewEntry[]>([])
  const pendingVideoReviews = ref<PendingVideoReviewEntry[]>([])
  const recentMessages = ref<RecentMessageEntry[]>([])
  const todaysActivities = ref<ScheduledActivityEntry[]>([])

  const { isLoading, error, run } = useDataHubQuery()

  async function loadSummary() {
    await run(async () => {
      const repository = dataHub.getRepository('trainerDashboard')

      const [
        nextSummary,
        nextAthletes,
        nextPendingVideoReviews,
        nextRecentMessages,
        nextTodaysActivities,
      ] = await Promise.all([
        dataHub.fetch('trainerDashboard:summary', () => repository.getDashboardSummary()),
        dataHub.fetch('trainerDashboard:athletes', () =>
          repository.getAssignedAthletesOverview(),
        ),
        dataHub.fetch('trainerDashboard:pendingVideoReviews', () =>
          repository.getPendingVideoReviews(),
        ),
        dataHub.fetch('trainerDashboard:recentMessages', () => repository.getRecentMessages()),
        dataHub.fetch('trainerDashboard:todaysActivities', () =>
          repository.getTodaysActivities(),
        ),
      ])

      summary.value = nextSummary
      athletes.value = nextAthletes
      pendingVideoReviews.value = nextPendingVideoReviews
      recentMessages.value = nextRecentMessages
      todaysActivities.value = nextTodaysActivities
    })
  }

  return {
    summary,
    athletes,
    pendingVideoReviews,
    recentMessages,
    todaysActivities,
    isLoading,
    error,
    loadSummary,
  }
})
