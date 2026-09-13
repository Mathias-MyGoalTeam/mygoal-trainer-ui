import { ref } from 'vue'

/**
 * Consistent loading/error state wrapper for Data-Hub-backed reads.
 *
 * Intended to be used ONCE per Pinia store (wrapping that store's "load"
 * action), not once per widget/component - so every feature reports
 * loading/error state the same way instead of each widget or store
 * re-implementing its own try/catch/finally around an `isLoading` ref.
 *
 * Usage (inside a store's setup function):
 *
 *   const { isLoading, error, run } = useDataHubQuery()
 *
 *   async function loadSomething() {
 *     await run(async () => {
 *       const repo = dataHub.getRepository('someDomain')
 *       something.value = await dataHub.fetch('someDomain:something', () =>
 *         repo.getSomething(),
 *       )
 *     })
 *   }
 *
 * See `src/stores/dashboard.ts` for the reference implementation.
 */
export function useDataHubQuery() {
  const isLoading = ref(false)
  const error = ref<unknown>(null)

  async function run(task: () => Promise<void>): Promise<void> {
    isLoading.value = true
    error.value = null

    try {
      await task()
    } catch (caughtError) {
      error.value = caughtError
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, error, run }
}
