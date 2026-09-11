import { defineStore } from 'pinia'

import { appConfig } from '@/config/env'
import type { Locale } from '@/language'

export const useSessionStore = defineStore('session', () => {
  const locale: Locale = appConfig.defaultLocale
  const mode = appConfig.mockedMode ? 'mocked' : 'live'

  return {
    appName: appConfig.appName,
    locale,
    mode,
  }
})
