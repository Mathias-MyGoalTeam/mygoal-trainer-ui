import { defineStore } from 'pinia'

import { appConfig } from '@/config/env'

export const useSessionStore = defineStore('session', () => {
  const mode = appConfig.mockedMode ? 'mocked' : 'live'

  return {
    appName: appConfig.appName,
    mode,
  }
})
