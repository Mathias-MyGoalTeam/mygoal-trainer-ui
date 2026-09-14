// Lightweight in-memory cache backing `dataHub.fetch(...)`.
//
// Scope is intentionally narrow: a single `Map` living for as long as the
// current browser tab/session is open (reset on full page reload). It is
// NOT persisted to localStorage/sessionStorage and does NOT sync across
// tabs - the goal is only to avoid re-fetching identical data every time a
// store's "load" action re-runs within the same session (e.g. navigating
// away from and back to a route), not to survive reloads.
const cache = new Map<string, unknown>()

export function getCacheEntry<T>(key: string): T | undefined {
  return cache.has(key) ? (cache.get(key) as T) : undefined
}

export function setCacheEntry<T>(key: string, value: T): void {
  cache.set(key, value)
}

/**
 * Clears one cache entry, or the entire cache when no key is given.
 * Not wired to any UI yet - available for tests and for a future explicit
 * "refresh" action.
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}
