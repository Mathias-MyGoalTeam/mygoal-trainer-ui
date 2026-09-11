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
