// Data-Hub repository registry - the single place in the app that decides
// which concrete repository implementation (mock or real) backs each
// domain. Stores/components must always ask for a repository via
// `dataHub.getRepository(key)` (see index.ts); they must never import a
// mock or real repository module directly, so swapping mock -> real later
// is a one-line change here instead of a search-and-replace across the app.
//
// How to onboard a new domain (Athletes, Training Plans, Messaging, ...):
//   1. Define its repository interface in `src/repo/interfaces.ts`.
//   2. Implement a mock in `src/repo/mocks/<domain>Repository.ts`.
//   3. Add the interface to `RepositoryMap` below and register the mock in
//      `mockRepositories`.
//   4. Consume it from a store via `dataHub.getRepository('<domain>')` -
//      see `src/stores/dashboard.ts` for the reference implementation.
//   5. Later, once a real (API/DB-backed) implementation exists, add it to
//      `realRepositories`. No store/component code needs to change.
import { appConfig } from '@/config/env'
import type { TrainerDashboardRepository } from '@/repo/interfaces'
import { mockTrainerDashboardRepository } from '@/repo/mocks/trainerDashboardRepository'

interface RepositoryMap {
  trainerDashboard: TrainerDashboardRepository
}

export type RepositoryKey = keyof RepositoryMap

const mockRepositories: RepositoryMap = {
  trainerDashboard: mockTrainerDashboardRepository,
}

// Real (API/DB-backed) implementations land here once they exist. Left
// empty for now - this sprint only introduces the Data-Hub itself and
// keeps every domain on mock data (see README.md "Data-Hub" section).
// `Partial<RepositoryMap>` lets domains migrate to real data one at a time.
const realRepositories: Partial<RepositoryMap> = {}

/**
 * Resolves the concrete repository implementation for a domain, choosing
 * mock vs. real based on `appConfig.mockedMode` (env-based switch, see
 * `src/config/env.ts`). Falls back to the mock with a console warning if
 * mocked mode is turned off before a real implementation is registered, so
 * partially-migrated domains keep working while real backends are rolled
 * out one at a time instead of crashing the app.
 */
export function resolveRepository<K extends RepositoryKey>(key: K): RepositoryMap[K] {
  if (!appConfig.mockedMode) {
    const real = realRepositories[key]
    if (real) {
      return real
    }

    console.warn(`[data-hub] No real repository registered for "${key}" yet - using mock data.`)
  }

  return mockRepositories[key]
}
