import type { Locale } from '@/language'

interface AppConfig {
  appName: string
  mockedMode: boolean
  defaultLocale: Locale
}

const defaultLocale = import.meta.env.VITE_DEFAULT_LOCALE === 'de' ? 'de' : 'en'

export const appConfig: AppConfig = {
  appName: import.meta.env.VITE_APP_NAME?.trim() || 'MyGoal Trainer UI',
  mockedMode: import.meta.env.VITE_MOCKED_MODE !== 'false',
  defaultLocale,
}
