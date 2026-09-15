<script setup lang="ts" generic="TData extends RowData">
// Generic DataTable organism built on TanStack Table v8 (headless -
// @tanstack/vue-table only supplies state/logic, all markup below is our
// own atoms/design tokens). It knows nothing about any domain: `columns`
// and `data` are supplied entirely by the caller, including which columns
// sort/filter and how a cell/header renders (e.g. a status column choosing
// to render `BaseStatusPill` happens in the caller's column `cell`, not
// here). Sorting, per-column filtering, and pagination are handled by
// TanStack Table's built-in row models - this component just renders
// whatever `table.getRowModel()` currently produces.
//
// BaseFilterBar/BasePagination are separate molecules that drive the same
// underlying `table` instance. It's handed to them via the `tableReady`
// event (rather than a template ref) so their `Table<TData>` prop stays
// correctly typed for whatever row type the caller instantiates this
// generic component with - see src/views/Athletes.vue for a full example.
//
// Usage:
//   const columns: ColumnDef<Row>[] = [...]
//   const table = shallowRef<Table<Row>>()
//   <BaseFilterBar :table="table" />
//   <BaseDataTable :columns="columns" :data="rows" @table-ready="table = $event" />
//   <BasePagination :table="table" />
import type { ColumnDef, RowData, Table } from '@tanstack/vue-table'
import { FlexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useVueTable } from '@tanstack/vue-table'

import chevronRightIcon from '@/assets/svg/icons/chevron-right.svg?raw'
import BaseEmptyState from '@/components/BaseEmptyState.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import { useColumnWidths } from '@/composables/useColumnWidths'

const props = withDefaults(
  defineProps<{
    // `any` here (matching TanStack's own ColumnDef<TData, any>[] convention
    // for a heterogeneous columns array) is required, not just stylistic:
    // TValue also appears in contravariant positions (e.g. `accessorFn`'s
    // parameter), so `unknown` fails to type-check for an array mixing
    // columns of different value types (string, number, an enum, ...).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    columns: ColumnDef<TData, any>[]
    data: TData[]
    /** Stable row identity for TanStack Table; defaults to row index. */
    getRowId?: (row: TData) => string
    pageSize?: number
    /** Passed straight to BaseEmptyState when `data`/filters produce zero rows - caller supplies the (translated) copy, same as BaseEmptyState itself. */
    emptyTitle: string
    emptyMessage?: string
  }>(),
  {
    getRowId: undefined,
    pageSize: 10,
    emptyMessage: undefined,
  },
)

const emit = defineEmits<{
  /** Fired once, synchronously, with the TanStack Table instance so sibling BaseFilterBar/BasePagination molecules can drive it. */
  tableReady: [table: Table<TData>]
}>()

defineOptions({ name: 'BaseDataTable' })

// Table state (sorting/column filters/pagination) is left "uncontrolled" -
// @tanstack/vue-table already manages it reactively internally, and
// BaseFilterBar/BasePagination mutate it via the `table` instance's own
// methods (`column.setFilterValue`, `table.setPageIndex`, ...), so there is
// no need to duplicate that state into local refs here.
const table = useVueTable({
  get data() {
    return props.data
  },
  get columns() {
    return props.columns
  },
  getRowId: props.getRowId,
  initialState: {
    pagination: { pageIndex: 0, pageSize: props.pageSize },
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
})

emit('tableReady', table)

// Column widths come from each column's `size` (ColumnDef.size, see
// src/views/Athletes.vue/Billing.vue) via the shared useColumnWidths
// composable, so BaseFilterBar can render its per-column controls at these
// same pixel widths - see src/components/BaseFilterBar.vue.
const { columnWidths } = useColumnWidths(() => table)
</script>

<template>
  <table class="base-data-table">
    <colgroup>
      <col v-for="column in columnWidths" :key="column.id" :style="{ width: `${column.size}px` }" />
    </colgroup>
    <thead>
      <tr v-for="headerGroup in table.getHeaderGroups()" :key="headerGroup.id">
        <th
          v-for="header in headerGroup.headers"
          :key="header.id"
          class="base-data-table__head-cell"
          :class="{ 'base-data-table__head-cell--sortable': header.column.getCanSort() }"
          @click="header.column.getToggleSortingHandler()?.($event)"
        >
          <div v-if="!header.isPlaceholder" class="base-data-table__head-content">
            <FlexRender :render="header.column.columnDef.header" :props="header.getContext()" />
            <BaseIcon
              v-if="header.column.getCanSort()"
              class="base-data-table__sort-icon"
              :class="`base-data-table__sort-icon--${header.column.getIsSorted() || 'none'}`"
              :svg="chevronRightIcon"
              size="small"
            />
          </div>
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-if="table.getRowModel().rows.length === 0">
        <td class="base-data-table__empty-cell" :colspan="table.getAllLeafColumns().length">
          <BaseEmptyState :title="emptyTitle" :message="emptyMessage" />
        </td>
      </tr>
      <tr v-for="row in table.getRowModel().rows" :key="row.id" class="base-data-table__row">
        <td v-for="cell in row.getVisibleCells()" :key="cell.id" class="base-data-table__cell">
          <FlexRender :render="cell.column.columnDef.cell" :props="cell.getContext()" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-data-table {
  width: 100%;
  border-collapse: collapse;
  // Fixed layout makes the <colgroup> widths (driven by column.getSize())
  // authoritative, instead of the browser deriving widths from cell
  // content - required so BaseFilterBar can align to the same widths.
  table-layout: fixed;
}

.base-data-table__head-cell {
  @include typo('label', $font-family-base, $font-weight-semibold);
  @include padding($space-12 $space-16);
  text-align: left;
  color: $color-neutral-500;
  border-bottom: 1px solid $color-neutral-100;
  white-space: nowrap;
}

.base-data-table__head-cell--sortable {
  cursor: pointer;
  user-select: none;

  &:hover {
    color: $color-neutral-900;
  }
}

.base-data-table__head-content {
  display: flex;
  align-items: center;
  gap: $space-4;
}

.base-data-table__sort-icon {
  color: $color-neutral-300;
  transition: transform 0.15s ease, color 0.15s ease;
  transform: rotate(90deg);
}

.base-data-table__sort-icon--asc {
  color: $color-orange-600;
  transform: rotate(-90deg);
}

.base-data-table__sort-icon--desc {
  color: $color-orange-600;
  transform: rotate(90deg);
}

.base-data-table__sort-icon--none {
  opacity: 0.5;
  transform: rotate(90deg);
}

.base-data-table__row {
  border-bottom: 1px solid $color-neutral-50;

  &:hover {
    background-color: $color-neutral-50;
  }
}

.base-data-table__cell {
  @include typo('body', $font-family-base, $font-weight-regular);
  @include padding($space-12 $space-16);
  color: $color-neutral-900;
  // table-layout: fixed no longer lets content grow the column, so clip
  // overflow instead of letting it break the fixed width.
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-data-table__empty-cell {
  padding: 0;
}
</style>
