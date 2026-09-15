<script setup lang="ts">
// Athletes list page (S04, Architecture Foundation - TanStack Table
// integration): wires the shared BaseDataTable + BaseFilterBar +
// BasePagination pattern (see src/components/BaseDataTable.vue) against a
// small in-memory mock dataset, to prove the generic table pattern works
// end-to-end for a real-looking domain shape. All athlete-specific
// knowledge (field names, status enum, column labels) lives here, not in
// the shared table components. Still not wired to the Data-Hub - loading a
// real athlete roster is a dedicated feature task.
import { computed, h, shallowRef } from 'vue'
import { useGettext } from 'vue3-gettext'
import { createColumnHelper } from '@tanstack/vue-table'
import type { Table } from '@tanstack/vue-table'

import BaseDataTable from '@/components/BaseDataTable.vue'
import BaseFilterBar from '@/components/BaseFilterBar.vue'
import BasePageHeader from '@/components/BasePageHeader.vue'
import BasePagination from '@/components/BasePagination.vue'
import BaseStatusPill from '@/components/BaseStatusPill.vue'
import { multiSelectFilter } from '@/types/table'

// Explicit multi-word name so the file can stay `Athletes.vue` while
// satisfying the vue/multi-word-component-names lint rule.
defineOptions({ name: 'AthletesPage' })

const { $gettext } = useGettext()

type AthleteStatus = 'active' | 'paused' | 'inactive'

interface AthleteRow {
  id: string
  name: string
  discipline: string
  status: AthleteStatus
  email: string
}

// Small illustrative dataset only, enough rows to exercise sorting,
// filtering, and pagination (BaseDataTable's default page size is 10) -
// not sourced from the Data-Hub/a repository.
const athletes: AthleteRow[] = [
  { id: '1', name: 'Lea Hoffmann', discipline: 'Laufen', status: 'active', email: 'lea.hoffmann@example.com' },
  { id: '2', name: 'Jonas Weber', discipline: 'Schwimmen', status: 'paused', email: 'jonas.weber@example.com' },
  { id: '3', name: 'Mara Schulz', discipline: 'Radfahren', status: 'active', email: 'mara.schulz@example.com' },
  { id: '4', name: 'Finn Becker', discipline: 'Triathlon', status: 'active', email: 'finn.becker@example.com' },
  { id: '5', name: 'Nina Fischer', discipline: 'Laufen', status: 'inactive', email: 'nina.fischer@example.com' },
  { id: '6', name: 'Paul Krüger', discipline: 'Skilanglauf', status: 'active', email: 'paul.krueger@example.com' },
  { id: '7', name: 'Emma Wolf', discipline: 'Schwimmen', status: 'paused', email: 'emma.wolf@example.com' },
  { id: '8', name: 'Ben Richter', discipline: 'Athletik', status: 'active', email: 'ben.richter@example.com' },
  { id: '9', name: 'Sophie Klein', discipline: 'Radfahren', status: 'active', email: 'sophie.klein@example.com' },
  { id: '10', name: 'Luca Schmidt', discipline: 'Triathlon', status: 'inactive', email: 'luca.schmidt@example.com' },
  { id: '11', name: 'Mia Neumann', discipline: 'Laufen', status: 'active', email: 'mia.neumann@example.com' },
  { id: '12', name: 'Noah Schwarz', discipline: 'Rollski', status: 'paused', email: 'noah.schwarz@example.com' },
  { id: '13', name: 'Ella Zimmermann', discipline: 'Skilanglauf', status: 'active', email: 'ella.zimmermann@example.com' },
  { id: '14', name: 'Anton Braun', discipline: 'Athletik', status: 'active', email: 'anton.braun@example.com' },
]

const statusLabels = computed<Record<AthleteStatus, string>>(() => ({
  active: $gettext('Aktiv'),
  paused: $gettext('Pausiert'),
  inactive: $gettext('Inaktiv'),
}))

const statusPillVariant: Record<AthleteStatus, 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  paused: 'warning',
  inactive: 'neutral',
}

const columnHelper = createColumnHelper<AthleteRow>()

// Recomputed via `computed` (rather than a plain const) so column
// headers/labels stay correct if the active language changes.
const columns = computed(() => [
  columnHelper.accessor('name', {
    header: $gettext('Name'),
    filterFn: 'includesString',
    size: 220,
    meta: {
      filterVariant: 'text',
      filterLabel: $gettext('Name durchsuchen'),
    },
  }),
  columnHelper.accessor('discipline', {
    header: $gettext('Sportart'),
    filterFn: multiSelectFilter,
    size: 160,
    meta: {
      filterVariant: 'select',
      filterLabel: $gettext('Sportart'),
      filterOptions: [...new Set(athletes.map((athlete) => athlete.discipline))]
        .sort()
        .map((discipline) => ({ value: discipline, label: discipline })),
    },
  }),
  columnHelper.accessor('status', {
    header: $gettext('Status'),
    filterFn: multiSelectFilter,
    size: 140,
    cell: (info) =>
      h(BaseStatusPill, { variant: statusPillVariant[info.getValue()] }, () => statusLabels.value[info.getValue()]),
    meta: {
      filterVariant: 'select',
      filterLabel: $gettext('Status'),
      filterOptions: (Object.keys(statusLabels.value) as AthleteStatus[]).map((status) => ({
        value: status,
        label: statusLabels.value[status],
      })),
    },
  }),
  columnHelper.accessor('email', {
    header: $gettext('E-Mail'),
    filterFn: 'includesString',
    size: 220,
    meta: {
      filterVariant: 'text',
      filterLabel: $gettext('E-Mail durchsuchen'),
    },
  }),
])

const table = shallowRef<Table<AthleteRow>>()
</script>

<template>
  <div class="page">
    <BasePageHeader :title="$gettext('Athleten')" />

    <BaseFilterBar :table="table" />

    <BaseDataTable
      :columns="columns"
      :data="athletes"
      :empty-title="$gettext('Keine Athleten gefunden')"
      :empty-message="$gettext('Passe deine Filter an oder setze sie zurück.')"
      @table-ready="table = $event"
    />

    <BasePagination :table="table" />
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;

// Desktop-first layout: designed and verified for >= 1280px viewports.
// No mobile/responsive variant here by design - see docs/design-principles.md.
.page {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: $space-40 $space-24 $space-60;
  display: flex;
  flex-direction: column;
  gap: $space-32;
}
</style>
