<script setup lang="ts" generic="TData extends RowData">
// Filter controls molecule that drives a BaseDataTable's TanStack Table
// instance via its built-in column-filter state - it is a thin wrapper,
// not a second source of truth. It renders one control per *leaf* column
// that opts in via `columnDef.meta.filterVariant` (see src/types/table.ts):
// a text input for free-text search, or a select for enum-style columns
// (status, category, ...). Which columns are filterable, their labels, and
// (for `select`) the list of enum options are all defined by the caller's
// column definitions - this component only reads that meta, it has no
// domain-specific field names hardcoded in it.
//
// Usage: pass the same `table` instance rendered by BaseDataTable, e.g.
//   <BaseFilterBar :table="dataTableRef?.table" />
import { computed } from 'vue'
import { useGettext } from 'vue3-gettext'
import type { RowData, Table } from '@tanstack/vue-table'

import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'

const props = defineProps<{
  table: Table<TData> | undefined
}>()

defineOptions({ name: 'BaseFilterBar' })

const { $gettext } = useGettext()

const filterableColumns = computed(() =>
  (props.table?.getAllLeafColumns() ?? []).filter((column) => column.columnDef.meta?.filterVariant),
)

const hasActiveFilters = computed(() => (props.table?.getState().columnFilters.length ?? 0) > 0)

function onTextFilterInput(columnId: string, value: string) {
  props.table?.getColumn(columnId)?.setFilterValue(value === '' ? undefined : value)
}

function onSelectFilterChange(columnId: string, event: Event) {
  const value = (event.target as HTMLSelectElement).value
  props.table?.getColumn(columnId)?.setFilterValue(value === '' ? undefined : value)
}

function resetFilters() {
  props.table?.resetColumnFilters()
}
</script>

<template>
  <div v-if="filterableColumns.length > 0" class="base-filter-bar">
    <div v-for="column in filterableColumns" :key="column.id" class="base-filter-bar__control">
      <BaseInput
        v-if="column.columnDef.meta?.filterVariant === 'text'"
        :model-value="(column.getFilterValue() as string) ?? ''"
        :label="column.columnDef.meta?.filterLabel"
        :placeholder="column.columnDef.meta?.filterLabel"
        @update:model-value="onTextFilterInput(column.id, $event)"
      />

      <label v-else-if="column.columnDef.meta?.filterVariant === 'select'" class="base-filter-bar__select-field">
        <span v-if="column.columnDef.meta?.filterLabel" class="base-filter-bar__select-label">
          {{ column.columnDef.meta.filterLabel }}
        </span>
        <select
          class="base-filter-bar__select"
          :value="(column.getFilterValue() as string) ?? ''"
          @change="onSelectFilterChange(column.id, $event)"
        >
          <option value="">{{ $gettext('Alle') }}</option>
          <option
            v-for="option in column.columnDef.meta?.filterOptions ?? []"
            :key="option.value"
            :value="option.value"
          >
            {{ option.label }}
          </option>
        </select>
      </label>
    </div>

    <BaseButton v-if="hasActiveFilters" variant="text" size="small" @click="resetFilters">
      {{ $gettext('Filter zurücksetzen') }}
    </BaseButton>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-filter-bar {
  display: flex;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: $space-16;
}

.base-filter-bar__control {
  min-width: 180px;
}

.base-filter-bar__select-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-8;
}

.base-filter-bar__select-label {
  @include typo('label', $font-family-base, $font-weight-light);
  color: inherit;
}

.base-filter-bar__select {
  width: 100%;
  @include padding($space-12 $space-16);
  @include typo('body', $font-family-base, $font-weight-regular);
  border-radius: $radius-sm;
  border: 1px solid $color-neutral-100;
  color: $color-neutral-900;
  background-color: $color-neutral-0;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: $color-blue-500;
  }
}
</style>
