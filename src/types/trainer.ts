export interface TrainerProfile {
  id: string
  firstName: string
  lastName: string
  sport: string
  locale: 'de' | 'en'
}

export interface AssignedUser {
  id: string
  displayName: string
  trainingFocus: string
  nextSessionDate: string
}
