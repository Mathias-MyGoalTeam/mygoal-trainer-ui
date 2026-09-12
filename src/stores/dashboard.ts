import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { TrainerDashboardRepository } from '@/repo/interfaces'
import { mockTrainerDashboardRepository } from '@/repo/mocks/trainerDashboardRepository'
import type {
  AthleteOverviewEntry,
  DashboardSummary,
  PendingVideoReviewEntry,
  ScheduledActivityEntry,
} from '@/types/dashboard'

const trainerDashboardRepository: TrainerDashboardRepository = mockTrainerDashboardRepository

export const useDashboardStore = defineStore('dashboard', () => {
  const summary = ref<DashboardSummary | null>(null)
  const athletes = ref<AthleteOverviewEntry[]>([])
  const pendingVideoReviews = ref<PendingVideoReviewEntry[]>([])
  const todaysActivities = ref<ScheduledActivityEntry[]>([])
  const isLoading = ref(false)

  async function loadSummary() {
    isLoading.value = true

    try {
      const [nextSummary, nextAthletes, nextPendingVideoReviews, nextTodaysActivities] =
        await Promise.all([
          trainerDashboardRepository.getDashboardSummary(),
          trainerDashboardRepository.getAssignedAthletesOverview(),
          trainerDashboardRepository.getPendingVideoReviews(),
          trainerDashboardRepository.getTodaysActivities(),
        ])

      summary.value = nextSummary
      athletes.value = nextAthletes
      pendingVideoReviews.value = nextPendingVideoReviews
      todaysActivities.value = nextTodaysActivities
    } finally {
      isLoading.value = false
    }
  }

  return {
    summary,
    athletes,
    pendingVideoReviews,
    todaysActivities,
    isLoading,
    loadSummary,
  }
})
