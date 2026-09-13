import { getCacheEntry, setCacheEntry } from './cache'
import { resolveRepository } from './registry'

// Data-Hub: the single point through which the app talks to data.
//
// It sits above the domain repositories (e.g. `TrainerDashboardRepository`)
// and does NOT replace the repository pattern - it centralizes how
// repositories are selected, wired, and consumed:
//
//   - `getRepository(key)` resolves mock vs. real implementations in one
//     place (see registry.ts) instead of every store/component deciding
//     individually.
//   - `fetch(cacheKey, loader)` runs a repository call through a
//     lightweight in-memory, per-session cache (see cache.ts), so repeated
//     reads within the same session don't re-fetch identical data.
//
// Consistent loading/error state per feature is provided separately by the
// `useDataHubQuery` composable (see useDataHubQuery.ts), meant to wrap a
// store's "load" action.
//
// See README.md ("Data-Hub" section) for the full usage pattern that new
// features/domains (Athletes, Training Plans, Messaging, ...) should
// follow, and `src/stores/dashboard.ts` for the reference implementation.
export const dataHub = {
  getRepository: resolveRepository,

  async fetch<T>(cacheKey: string, loader: () => Promise<T>): Promise<T> {
    const cached = getCacheEntry<T>(cacheKey)
    if (cached !== undefined) {
      return cached
    }

    const value = await loader()
    setCacheEntry(cacheKey, value)
    return value
  },
}

export { clearCache } from './cache'
export type { RepositoryKey } from './registry'
export { useDataHubQuery } from './useDataHubQuery'
