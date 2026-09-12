# mygoal-trainer-ui

Trainer-facing frontend for the MyGoal sports training platform.

## Mocked Mode

Mocked Mode means the app runs fully standalone for local development. All trainer data is loaded from static mock repositories inside `src/repo/mocks`, so no backend, API client, authentication, or database connection is required.

## Run locally

```bash
npm install
npm run dev
```

The Vite dev server starts the Vue 3 application locally. By default, `VITE_MOCKED_MODE` is treated as enabled unless it is explicitly set to `false`.

## Design system

Design tokens (colors, typography, spacing, radius, shadows) live in
`src/assets/scss/` and are shared/reusable via SCSS `@use`. A small set of
presentation-only base components (`BaseButton`, `BaseInput`, `BaseCard`)
built on those tokens live in `src/components/`. See
[docs/design-principles.md](docs/design-principles.md) for where this design
language comes from and why this app is **desktop-first**, unlike its
mobile-first sibling app.

## Localization

UI text is localized with [`vue3-gettext`](https://github.com/jshmrtn/vue3-gettext),
matching the pattern used across MyGoal UIs. **German is the source language**:
strings are written in German directly in templates and scripts, e.g.

```vue
<script setup lang="ts">
import { useGettext } from 'vue3-gettext'
const { $gettext } = useGettext()
</script>

<template>
  <h1>{{ $gettext('Dashboard') }}</h1>
</template>
```

Translations for other supported languages (currently just English) live in
`src/language/*.po` and are compiled into `src/language/translations.json`,
which is loaded at runtime by `src/language/index.ts`.

After adding or changing `$gettext(...)` calls:

```bash
npm run gettext:extract  # scan source files, update messages.pot and *.po
# fill in/update msgstr entries in src/language/en.po
npm run gettext:compile  # compile *.po files into translations.json
```

`gettext:extract` requires the GNU gettext CLI tools (`msginit`/`msgmerge`) to
be installed locally, e.g. `brew install gettext` on macOS.

## Folder structure

```text
src/
├── assets/         # Images, SVGs, and shared styles
├── components/     # Reusable Vue components
├── composables/    # UI behavior helpers
├── config/         # Typed Vite environment configuration
├── language/       # German/English localization data
├── repo/
│   ├── interfaces.ts
│   └── mocks/      # Mock repositories returning sample data
├── router/         # Route definitions
├── stores/         # Pinia stores for session and trainer state
├── types/          # Shared domain models and types
├── views/          # Routed pages
└── main.ts         # Application entry point
```

## Sprint 1 scope

This setup includes:
- Vue 3 + Vite + TypeScript
- Vue Router
- Pinia
- ESLint + Prettier
- A placeholder dashboard wired end-to-end to a mocked `TrainerRepository`

This repository is intentionally frontend-only in Sprint 1.
