import type { SupportedLocale } from '@/language'

interface AppConfig {
  appName: string
  mockedMode: boolean
  defaultLocale?: SupportedLocale
}

export const appConfig: AppConfig = {
  appName: import.meta.env.VITE_APP_NAME?.trim() || 'MyGoal Trainer UI',
  mockedMode: import.meta.env.VITE_MOCKED_MODE !== 'false',
  defaultLocale: import.meta.env.VITE_DEFAULT_LOCALE,
}
