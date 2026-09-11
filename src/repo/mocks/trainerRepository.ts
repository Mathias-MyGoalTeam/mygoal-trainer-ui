import type { TrainerRepository } from '@/repo/interfaces'
import type { AssignedUser, TrainerProfile } from '@/types/trainer'

const profile: TrainerProfile = {
  id: 'trainer-1',
  firstName: 'Mia',
  lastName: 'Schneider',
  sport: 'Fußball',
  locale: 'de',
}

const assignedUsers: AssignedUser[] = [
  {
    id: 'athlete-1',
    displayName: 'Lena Hoffmann',
    trainingFocus: 'Sprintstarts',
    nextSessionDate: '2026-09-14',
  },
  {
    id: 'athlete-2',
    displayName: 'Jonas Weber',
    trainingFocus: 'Core-Stabilität',
    nextSessionDate: '2026-09-15',
  },
]

export const mockTrainerRepository: TrainerRepository = {
  async getProfile() {
    return profile
  },
  async getAssignedUsers() {
    return assignedUsers
  },
}
