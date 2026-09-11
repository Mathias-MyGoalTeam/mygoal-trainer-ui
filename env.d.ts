/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME?: string
  readonly VITE_DEFAULT_LOCALE?: 'de' | 'en'
  readonly VITE_MOCKED_MODE?: 'true' | 'false'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
