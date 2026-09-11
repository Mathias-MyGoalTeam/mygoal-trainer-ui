import { defineStore } from 'pinia'
import { ref } from 'vue'

import type { TrainerRepository } from '@/repo/interfaces'
import { mockTrainerRepository } from '@/repo/mocks/trainerRepository'
import type { AssignedUser, TrainerProfile } from '@/types/trainer'

const trainerRepository: TrainerRepository = mockTrainerRepository

export const useTrainerStore = defineStore('trainer', () => {
  const profile = ref<TrainerProfile | null>(null)
  const assignedUsers = ref<AssignedUser[]>([])
  const isLoading = ref(false)

  async function loadDashboard() {
    isLoading.value = true

    try {
      const [nextProfile, nextAssignedUsers] = await Promise.all([
        trainerRepository.getProfile(),
        trainerRepository.getAssignedUsers(),
      ])

      profile.value = nextProfile
      assignedUsers.value = nextAssignedUsers
    } finally {
      isLoading.value = false
    }
  }

  return {
    profile,
    assignedUsers,
    isLoading,
    loadDashboard,
  }
})
