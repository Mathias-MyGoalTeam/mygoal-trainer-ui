// Module augmentation for TanStack Table's `ColumnMeta` (the official
// extension point - see https://tanstack.com/table/v8/docs/api/core/column-def#meta).
// This lets a page's column definitions describe *how* BaseFilterBar should
// render a filter control for a column (label, text vs. enum/select, and -
// for enum columns - the list of options), without BaseFilterBar or
// BaseDataTable ever needing to know about a specific domain field (no
// hardcoded "status"/"trainer_id"/etc. anywhere in the shared components).
// The page/feature that owns the column definitions is the only place that
// fills these in.
import type { RowData } from '@tanstack/vue-table'

declare module '@tanstack/vue-table' {
  interface ColumnMeta<TData extends RowData, TValue> {
    /** Label shown for this column's control in BaseFilterBar. */
    filterLabel?: string
    /** Which filter control BaseFilterBar renders; omit to not show one. */
    filterVariant?: 'text' | 'select'
    /** Options for `filterVariant: 'select'` - value must match the raw cell value used for filtering. */
    filterOptions?: Array<{ value: string; label: string }>
  }
}

// Turns this file into a module (rather than an ambient global script), so
// the `declare module` above augments the real `@tanstack/vue-table`
// package instead of leaking a same-named global augmentation.

