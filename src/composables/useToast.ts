import { reactive } from 'vue'

// Shared (module-level) reactive queue of active toasts - intentionally a
// singleton so any composable/component in the app can push a toast without
// needing to pass state down through props. BaseToast.vue is the only
// component that reads this list to render it; everything else only calls
// `show()`/`dismiss()`.
export type ToastVariant = 'success' | 'error' | 'info' | 'warning'

export interface ToastOptions {
  message: string
  variant?: ToastVariant
  /** Auto-dismiss delay in ms. Ignored when `sticky` is true. Defaults to 4000. */
  duration?: number
  /** Keep the toast visible until the user dismisses it manually. */
  sticky?: boolean
}

export interface ToastEntry extends Required<Omit<ToastOptions, 'duration'>> {
  id: number
  duration: number
}

const toasts = reactive<ToastEntry[]>([])
let nextId = 0
const timers = new Map<number, ReturnType<typeof setTimeout>>()

function dismiss(id: number) {
  const timer = timers.get(id)
  if (timer) {
    clearTimeout(timer)
    timers.delete(id)
  }

  const index = toasts.findIndex((toast) => toast.id === id)
  if (index !== -1) {
    toasts.splice(index, 1)
  }
}

function show(options: ToastOptions): number {
  const id = nextId++
  const entry: ToastEntry = {
    id,
    message: options.message,
    variant: options.variant ?? 'info',
    sticky: options.sticky ?? false,
    duration: options.duration ?? 4000,
  }

  toasts.push(entry)

  if (!entry.sticky) {
    timers.set(
      id,
      setTimeout(() => dismiss(id), entry.duration),
    )
  }

  return id
}

/**
 * App-wide toast/notification queue.
 *
 * Usage - anywhere in the app (store, component, composable):
 *
 *   const { show } = useToast()
 *   show({ message: 'Änderungen gespeichert.', variant: 'success' })
 *
 * `<BaseToast />` (see BaseToast.vue) must be mounted once near the app
 * root (e.g. in App.vue) to actually render the queue - not done yet, see
 * S04-T3.
 */
export function useToast() {
  return { toasts, show, dismiss }
}
