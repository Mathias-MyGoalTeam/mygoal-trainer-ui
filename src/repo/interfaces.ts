import type { AssignedUser, TrainerProfile } from '@/types/trainer'

export interface TrainerRepository {
  getProfile(): Promise<TrainerProfile>
  getAssignedUsers(): Promise<AssignedUser[]>
}
