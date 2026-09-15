import { computed } from 'vue'
import type { RowData, Table } from '@tanstack/vue-table'

export interface ColumnWidth {
  id: string
  size: number
}

/**
 * Reads TanStack Table's per-column pixel sizing (ColumnDef `size` -
 * https://tanstack.com/table/v8/docs/api/core/column-def#size, default 150)
 * so that any component sitting alongside a BaseDataTable can render its own
 * per-column cells at the *exact* same widths instead of guessing them
 * independently (e.g. BaseFilterBar's per-column filter controls). This is
 * the general, reusable alignment pattern: any future sibling of the table
 * (a footer/summary row, sticky totals, ...) should also source its widths
 * from here rather than hardcoding its own.
 *
 * `getTable` is a getter (not a plain `Table`) so callers can pass a prop
 * access (e.g. `() => props.table`) and stay reactive to both the table
 * instance changing and its internal column-sizing state changing.
 */
export function useColumnWidths<TData extends RowData>(getTable: () => Table<TData> | undefined) {
  const columnWidths = computed<ColumnWidth[]>(
    () => getTable()?.getVisibleLeafColumns().map((column) => ({ id: column.id, size: column.getSize() })) ?? [],
  )

  const totalWidth = computed(() => columnWidths.value.reduce((sum, column) => sum + column.size, 0))

  return { columnWidths, totalWidth }
}
