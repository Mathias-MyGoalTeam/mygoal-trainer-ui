export const messages = {
  en: {
    dashboardTitle: 'Dashboard',
    dashboardSubtitle: 'Mocked trainer overview for local development.',
    assignedUsers: 'Assigned users',
    nextSession: 'Next session',
    mockedMode: 'Mocked Mode active',
    viewport: 'Viewport',
    trainerLabel: 'Trainer',
    mockedSummary: 'assigned users in mocked mode',
    loading: 'Loading mocked data...',
  },
  de: {
    dashboardTitle: 'Dashboard',
    dashboardSubtitle: 'Mock-Übersicht für die lokale Trainer-Entwicklung.',
    assignedUsers: 'Zugewiesene Nutzer',
    nextSession: 'Nächste Einheit',
    mockedMode: 'Mocked Mode aktiv',
    viewport: 'Ansicht',
    trainerLabel: 'Trainer',
    mockedSummary: 'zugewiesene Nutzer im Mocked Mode',
    loading: 'Mock-Daten werden geladen...',
  },
} as const

export type Locale = keyof typeof messages

export function getDictionary(locale: Locale) {
  return messages[locale]
}
