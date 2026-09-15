<script setup lang="ts" generic="TData extends RowData">
// Domain-agnostic filter panel for a BaseDataTable. Column definitions opt in
// through ColumnMeta (see src/types/table.ts); this molecule only renders the
// controls and writes values to TanStack Table's columnFilters state.
import { computed, ref } from 'vue'
import { useGettext } from 'vue3-gettext'
import type { RowData, Table } from '@tanstack/vue-table'

import filterIcon from '@/assets/svg/icons/filter.svg?raw'
import xcloseIcon from '@/assets/svg/icons/xclose.svg?raw'
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import BaseInput from '@/components/BaseInput.vue'
import { useColumnWidths } from '@/composables/useColumnWidths'

const props = defineProps<{
  table: Table<TData> | undefined
}>()

defineOptions({ name: 'BaseFilterBar' })

const { $gettext } = useGettext()
const isFilterRowOpen = ref(false)
const openDropdownColumnId = ref<string>()

// All visible leaf columns, in table order - not just the filterable ones -
// so each one can reserve exactly the width its data column has (see
// src/composables/useColumnWidths.ts), keeping filter controls lined up
// with the columns below them. Columns without a filter control still get
// an (empty) slot so later columns don't shift out of alignment.
const { columnWidths } = useColumnWidths(() => props.table)
const columnWidthById = computed(() => new Map(columnWidths.value.map((column) => [column.id, column.size])))
const leafColumns = computed(() => props.table?.getVisibleLeafColumns() ?? [])

const filterableColumns = computed(() => leafColumns.value.filter((column) => column.columnDef.meta?.filterVariant))

const activeFilterCount = computed(() => props.table?.getState().columnFilters.length ?? 0)

function onTextFilterInput(columnId: string, value: string) {
  props.table?.getColumn(columnId)?.setFilterValue(value === '' ? undefined : value)
}

function onMultiSelectChange(columnId: string, value: string, checked: boolean) {
  const column = props.table?.getColumn(columnId)
  if (!column) return

  const currentValues = Array.isArray(column.getFilterValue()) ? (column.getFilterValue() as string[]) : []
  const nextValues = checked ? [...currentValues, value] : currentValues.filter((item) => item !== value)
  column.setFilterValue(nextValues.length > 0 ? nextValues : undefined)
}

function isOptionSelected(columnId: string, value: string) {
  const filterValue = props.table?.getColumn(columnId)?.getFilterValue()
  return Array.isArray(filterValue) && filterValue.includes(value)
}

function resetFilters() {
  props.table?.resetColumnFilters()
}

function toggleDropdown(columnId: string) {
  openDropdownColumnId.value = openDropdownColumnId.value === columnId ? undefined : columnId
}

function selectedOptionLabel(columnId: string) {
  const column = props.table?.getColumn(columnId)
  const selectedValues = column?.getFilterValue()

  if (!Array.isArray(selectedValues) || selectedValues.length === 0) {
    return $gettext('Alle')
  }

  const options = column?.columnDef.meta?.filterOptions ?? []
  return options
    .filter((option) => selectedValues.includes(option.value))
    .map((option) => option.label)
    .join(', ')
}
</script>

<template>
  <div v-if="filterableColumns.length > 0" class="base-filter-bar">
    <div v-if="isFilterRowOpen" class="base-filter-bar__row">
      <div
        v-for="column in leafColumns"
        :key="column.id"
        class="base-filter-bar__column"
        :style="{ width: `${columnWidthById.get(column.id) ?? column.getSize()}px` }"
      >
        <BaseInput
          v-if="column.columnDef.meta?.filterVariant === 'text'"
          :model-value="(column.getFilterValue() as string) ?? ''"
          :label="column.columnDef.meta?.filterLabel"
          :placeholder="column.columnDef.meta?.filterLabel"
          @update:model-value="onTextFilterInput(column.id, $event)"
        />

        <div v-else-if="column.columnDef.meta?.filterVariant === 'select'" class="base-filter-bar__dropdown">
          <label class="base-filter-bar__dropdown-label">{{ column.columnDef.meta?.filterLabel }}</label>
          <button
            type="button"
            class="base-filter-bar__dropdown-trigger"
            :aria-expanded="openDropdownColumnId === column.id"
            @click="toggleDropdown(column.id)"
          >
            <span class="base-filter-bar__dropdown-value">{{ selectedOptionLabel(column.id) }}</span>
            <span aria-hidden="true" class="base-filter-bar__dropdown-chevron">⌄</span>
          </button>
          <div v-if="openDropdownColumnId === column.id" class="base-filter-bar__dropdown-menu">
            <label
              v-for="option in column.columnDef.meta?.filterOptions ?? []"
              :key="option.value"
              class="base-filter-bar__option"
            >
              <input
                type="checkbox"
                :checked="isOptionSelected(column.id, option.value)"
                @change="onMultiSelectChange(column.id, option.value, ($event.target as HTMLInputElement).checked)"
              />
              <span>{{ option.label }}</span>
            </label>
          </div>
        </div>
      </div>
      <div class="base-filter-bar__actions">
        <BaseButton v-if="activeFilterCount > 0" variant="text" size="small" @click="resetFilters">
          {{ $gettext('Filter zurücksetzen') }}
        </BaseButton>
        <button
          type="button"
          class="base-filter-bar__close"
          :aria-label="$gettext('Filterzeile schließen')"
          @click="isFilterRowOpen = false"
        >
          <BaseIcon :svg="xcloseIcon" size="small" />
        </button>
      </div>
    </div>

    <div v-else class="base-filter-bar__collapsed">
      <button
        type="button"
        class="base-filter-bar__trigger"
        :aria-label="$gettext('Filter öffnen')"
        :aria-expanded="isFilterRowOpen"
        @click="isFilterRowOpen = true"
      >
        <BaseIcon :svg="filterIcon" size="small" />
        <span>{{ $gettext('Filter') }}</span>
        <span v-if="activeFilterCount > 0" class="base-filter-bar__count">{{ activeFilterCount }}</span>
      </button>
      <!-- Active filters still apply while the row is collapsed, so resetting
           them must stay reachable without reopening the row first. -->
      <BaseButton v-if="activeFilterCount > 0" variant="text" size="small" @click="resetFilters">
        {{ $gettext('Filter zurücksetzen') }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-filter-bar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: $space-16;
}

.base-filter-bar__row {
  display: flex;
  align-items: flex-end;
  width: 100%;
  padding: $space-16 0;
  border: 1px solid $color-neutral-100;
  border-radius: $radius-sm;
  background: $color-neutral-0;
  // Columns are fixed-width (matching BaseDataTable's colgroup, see
  // src/composables/useColumnWidths.ts) and contiguous - no flex `gap` -
  // so a control's box lines up exactly with its data column below.
  // Intentionally not a horizontal scroll container: `overflow-x` here
  // would force `overflow-y` to clip too (per the CSS overflow spec, a
  // scrolling axis can't coexist with a visible one), cutting off the
  // dropdown menus below. Column widths currently fit comfortably within
  // the page's max container width; if a future table needs to scroll,
  // that has to be solved together with BaseDataTable, not per-component.
  flex-wrap: nowrap;
}

.base-filter-bar__actions {
  display: flex;
  align-items: center;
  gap: $space-16;
  flex: 0 0 auto;
  margin: 0 $space-16;
}

.base-filter-bar__collapsed {
  display: flex;
  align-items: center;
  gap: $space-16;
}

.base-filter-bar__trigger {
  @include typo('body', $font-family-base, $font-weight-semibold);
  display: inline-flex;
  align-items: center;
  gap: $space-8;
  min-height: 44px;
  padding: $space-8 $space-12;
  border: 1px solid $color-neutral-100;
  border-radius: $radius-sm;
  color: $color-neutral-700;
  background: $color-neutral-0;
  cursor: pointer;

  &:hover {
    background: $color-neutral-50;
    color: $color-neutral-900;
  }

  &:focus-visible {
    outline: 3px solid $color-blue-300;
    outline-offset: 2px;
  }
}

.base-filter-bar__count {
  min-width: 20px;
  height: 20px;
  padding: 0 $space-4;
  border-radius: $radius-rounded;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: $color-orange-500;
  color: $color-neutral-0;
  @include typo('caption', $font-family-base, $font-weight-bold);
}

.base-filter-bar__column {
  // Fixed width (set inline from column.getSize(), see the template above)
  // so the control lines up with its data column below; padding mirrors
  // BaseDataTable's cell padding ($space-16 horizontal) so a control's
  // *content* also lines up, not just the outer box.
  flex: 0 0 auto;
  box-sizing: border-box;
  padding: 0 $space-16;

  // Labels never wrap, regardless of how narrow a column is - otherwise a
  // column with a long label would grow taller than its neighbors and
  // throw off the row's flex-end alignment, misaligning the input/dropdown
  // boxes themselves. This keeps every column's label at exactly one line,
  // so all controls end up at the same height without measuring anything.
  :deep(.base-input__label) {
    display: block;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.base-filter-bar__dropdown {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-8;
  width: 100%;
  position: relative;
}

.base-filter-bar__dropdown-trigger {
  // Same box model as BaseInput's field (padding/border/radius/typography)
  // so a select column's control is exactly as tall as a text column's -
  // no separate height value to keep in sync.
  @include typo('body', $font-family-base, $font-weight-regular);
  display: flex;
  align-items: center;
  gap: $space-8;
  width: 100%;
  @include padding($space-12 $space-16);
  border: 1px solid $color-neutral-100;
  border-radius: $radius-sm;
  color: $color-neutral-900;
  background: $color-neutral-0;
  box-sizing: border-box;
  cursor: pointer;
  text-align: left;

  &:hover,
  &:focus-visible {
    border-color: $color-blue-500;
  }

  &:focus-visible {
    outline: 3px solid $color-blue-300;
    outline-offset: 2px;
  }
}

.base-filter-bar__dropdown-label {
  // Matches .base-input__label exactly (see BaseInput.vue) so a select
  // column's label sits at the same height/style as a text column's.
  @include typo('label', $font-family-base, $font-weight-light);
  display: block;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: inherit;
}

.base-filter-bar__dropdown-value {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.base-filter-bar__dropdown-chevron {
  margin-left: auto;
  color: $color-neutral-500;
}

.base-filter-bar__dropdown-menu {
  position: absolute;
  top: calc(100% + #{$space-4});
  left: 0;
  z-index: $z-modal;
  min-width: max-content;
  max-width: min(360px, 80vw);
  padding: $space-8;
  border: 1px solid $color-neutral-100;
  border-radius: $radius-xs;
  background: $color-neutral-0;
  box-shadow: $shadow-elevated;
}

.base-filter-bar__option {
  @include typo('body', $font-family-base, $font-weight-regular);
  display: flex;
  align-items: center;
  gap: $space-8;
  padding: $space-8;
  color: $color-neutral-900;
  cursor: pointer;

  &:hover {
    background: $color-neutral-50;
  }
}

.base-filter-bar__close {
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  border: 1px solid $color-neutral-100;
  border-radius: $radius-sm;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: $color-neutral-500;
  background: $color-neutral-0;
  cursor: pointer;

  &:hover {
    background: $color-neutral-50;
    color: $color-neutral-900;
  }

  &:focus-visible {
    outline: 3px solid $color-blue-300;
    outline-offset: 2px;
  }
}
</style>
