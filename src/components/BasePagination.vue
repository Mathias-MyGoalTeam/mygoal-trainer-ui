<script setup lang="ts" generic="TData extends RowData">
// Pagination controls molecule - a thin wrapper around a BaseDataTable's
// TanStack Table pagination state/actions (`getState().pagination`,
// `previousPage`/`nextPage`/`setPageIndex`/`setPageSize`). No table/row
// logic lives here; it only reflects and drives that state.
//
// Usage: pass the same `table` instance rendered by BaseDataTable, e.g.
//   <BasePagination :table="dataTableRef?.table" />
import { computed } from 'vue'
import { useGettext } from 'vue3-gettext'
import type { RowData, Table } from '@tanstack/vue-table'

import chevronRightIcon from '@/assets/svg/icons/chevron-right.svg?raw'
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    table: Table<TData> | undefined
    pageSizeOptions?: number[]
  }>(),
  {
    pageSizeOptions: () => [10, 25, 50],
  },
)

defineOptions({ name: 'BasePagination' })

const { $gettext } = useGettext()

const pageIndex = computed(() => props.table?.getState().pagination.pageIndex ?? 0)
const pageCount = computed(() => props.table?.getPageCount() ?? 0)
const rowCount = computed(() => props.table?.getPrePaginationRowModel().rows.length ?? 0)
const pageSize = computed(() => props.table?.getState().pagination.pageSize ?? 0)

function onPageSizeChange(event: Event) {
  const value = Number((event.target as HTMLSelectElement).value)
  props.table?.setPageSize(value)
}
</script>

<template>
  <div v-if="rowCount > 0" class="base-pagination">
    <span class="base-pagination__summary">
      {{
        $gettext('Seite %{page} von %{count}', { page: pageIndex + 1, count: Math.max(pageCount, 1) })
      }}
      ·
      {{ $gettext('%{count} Einträge', { count: rowCount }) }}
    </span>

    <div class="base-pagination__controls">
      <label class="base-pagination__page-size">
        {{ $gettext('Zeilen pro Seite') }}
        <select
          class="base-pagination__page-size-select"
          :value="pageSize"
          @change="onPageSizeChange"
        >
          <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
        </select>
      </label>

      <BaseButton
        variant="secondary"
        size="small"
        :disabled="!table?.getCanPreviousPage()"
        :aria-label="$gettext('Vorherige Seite')"
        @click="table?.previousPage()"
      >
        <BaseIcon class="base-pagination__icon base-pagination__icon--prev" :svg="chevronRightIcon" size="small" />
      </BaseButton>
      <BaseButton
        variant="secondary"
        size="small"
        :disabled="!table?.getCanNextPage()"
        :aria-label="$gettext('Nächste Seite')"
        @click="table?.nextPage()"
      >
        <BaseIcon class="base-pagination__icon" :svg="chevronRightIcon" size="small" />
      </BaseButton>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: $space-16;
}

.base-pagination__summary {
  @include typo('small', $font-family-base, $font-weight-regular);
  color: $color-neutral-500;
}

.base-pagination__controls {
  display: flex;
  align-items: center;
  gap: $space-12;
}

.base-pagination__page-size {
  @include typo('small', $font-family-base, $font-weight-regular);
  display: flex;
  align-items: center;
  gap: $space-8;
  color: $color-neutral-500;
}

.base-pagination__page-size-select {
  @include padding($space-4 $space-8);
  @include typo('small', $font-family-base, $font-weight-regular);
  border-radius: $radius-xxs;
  border: 1px solid $color-neutral-100;
  color: $color-neutral-900;
  background-color: $color-neutral-0;

  &:focus {
    outline: none;
    border-color: $color-blue-500;
  }
}

.base-pagination__icon {
  transform: rotate(0deg);
}

.base-pagination__icon--prev {
  transform: rotate(180deg);
}
</style>
