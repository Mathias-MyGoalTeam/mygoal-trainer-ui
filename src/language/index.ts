// Localization setup using vue3-gettext, matching the pattern used across
// MyGoal UIs (see mygoal-webapp-ui's src/language/index.ts).
//
// Our main/source language is German: UI strings are written in German
// directly in templates via $gettext('...'), and translations for other
// languages are extracted into .po files and compiled into translations.json.
//
//   npm run gettext:extract   - scan source files, update messages.pot/*.po
//   npm run gettext:compile   - compile *.po files into translations.json
import type { App } from 'vue'
import { createGettext } from 'vue3-gettext'

import { appConfig } from '@/config/env'

import translations from './translations.json'

export const supportedLanguages = {
  de: 'Deutsch',
  en: 'English',
} as const

export type SupportedLocale = keyof typeof supportedLanguages

const fallbackLanguage: SupportedLocale = 'de'

function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale in supportedLanguages
}

function getDefaultLanguage(): SupportedLocale {
  try {
    // Retrieve the browser/OS language and fall back to German if it isn't
    // one of our supported languages.
    const lang = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0] ?? fallbackLanguage

    return isSupportedLocale(lang) ? lang : fallbackLanguage
  } catch {
    return fallbackLanguage
  }
}

export const gettextConfig = createGettext({
  defaultLanguage: appConfig.defaultLocale ?? getDefaultLanguage(),
  sourceCodeLanguage: 'de',
  availableLanguages: supportedLanguages,
  silent: true,
  translations,
})

export function setupLocalization(app: App) {
  app.use(gettextConfig)
}

/** For use in scripts/stores outside components, where useGettext() isn't available. */
export function $gettext(msgid: string) {
  return gettextConfig.$gettext(msgid)
}
