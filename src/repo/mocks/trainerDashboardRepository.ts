import type { TrainerDashboardRepository } from '@/repo/interfaces'
import type {
  AthleteOverviewEntry,
  DashboardSummary,
  PendingVideoReviewEntry,
  RecentMessageEntry,
  ScheduledActivityEntry,
} from '@/types/dashboard'

// Sample values only - no API/DB calls. Field set is provisional and may
// change once AP-04 finalizes the real database schema.
const dashboardSummary: DashboardSummary = {
  assignedAthletesCount: 8,
  pendingVideoReviewsCount: 3,
  todaysActivitiesCount: 5,
  recentMessagesCount: 4,
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

// Mocked list for the Messages widget. Conversation state and sending
// messages are intentionally out of scope; these entries only provide the
// dashboard preview until a real messaging model is introduced. `avatarUrl`
// is left unset so the widget falls back to a generic placeholder avatar.
const recentMessages: RecentMessageEntry[] = [
  {
    id: 'message-1',
    athleteName: 'Lena Hoffmann',
    preview: 'Das Training heute lief richtig gut!',
    timestamp: '2h ago',
  },
  {
    id: 'message-2',
    athleteName: 'Jonas Weber',
    preview: 'Kannst du bitte den Plan für nächste Woche prüfen?',
    timestamp: '4h ago',
  },
  {
    id: 'message-3',
    athleteName: 'Sophie Bauer',
    preview: 'Ich fühle mich wieder fit für das nächste Training.',
    timestamp: 'Gestern',
  },
  {
    id: 'message-4',
    athleteName: 'Mara Vogel',
    preview: 'Danke für dein Feedback zum letzten Lauf!',
    timestamp: 'Gestern',
  },
]

// Mocked list for the Today's Activities widget (S03-T1, AP-20). Matches
// todaysActivitiesCount above 1:1. Sorted/grouped by athlete - an athlete
// can have more than one activity scheduled the same day (see Lena
// Hoffmann below). `done` is a placeholder flag only - no real
// completion/feedback workflow yet.
const todaysActivities: ScheduledActivityEntry[] = [
  {
    id: 'activity-1',
    athleteName: 'Lena Hoffmann',
    activityKind: 'laufen',
    title: '5 km lockerer Dauerlauf',
    done: true,
  },
  {
    id: 'activity-2',
    athleteName: 'Lena Hoffmann',
    activityKind: 'athletik',
    title: 'Rumpfstabilität',
    done: false,
  },
  {
    id: 'activity-3',
    athleteName: 'Jonas Weber',
    activityKind: 'schwimmen',
    title: 'Techniktraining Kraul',
    done: false,
  },
  {
    id: 'activity-4',
    athleteName: 'Sophie Bauer',
    activityKind: 'regeneration',
    title: 'Aktive Regeneration',
    done: true,
  },
  {
    id: 'activity-5',
    athleteName: 'Mara Vogel',
    activityKind: 'radfahren',
    title: 'Grundlagenausdauer',
    done: false,
  },
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
  async getRecentMessages() {
    return recentMessages
  },
  async getTodaysActivities() {
    return todaysActivities
  },
}
