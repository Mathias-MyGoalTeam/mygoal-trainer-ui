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
  nextSessionDate: string
}

// Small illustrative dataset only, enough rows to exercise sorting,
// filtering, and pagination (BaseDataTable's default page size is 10) -
// not sourced from the Data-Hub/a repository.
const athletes: AthleteRow[] = [
  { id: '1', name: 'Lea Hoffmann', discipline: 'Laufen', status: 'active', nextSessionDate: '2026-09-16' },
  { id: '2', name: 'Jonas Weber', discipline: 'Schwimmen', status: 'paused', nextSessionDate: '2026-09-20' },
  { id: '3', name: 'Mara Schulz', discipline: 'Radfahren', status: 'active', nextSessionDate: '2026-09-15' },
  { id: '4', name: 'Finn Becker', discipline: 'Triathlon', status: 'active', nextSessionDate: '2026-09-18' },
  { id: '5', name: 'Nina Fischer', discipline: 'Laufen', status: 'inactive', nextSessionDate: '2026-10-02' },
  { id: '6', name: 'Paul Krüger', discipline: 'Skilanglauf', status: 'active', nextSessionDate: '2026-09-17' },
  { id: '7', name: 'Emma Wolf', discipline: 'Schwimmen', status: 'paused', nextSessionDate: '2026-09-22' },
  { id: '8', name: 'Ben Richter', discipline: 'Athletik', status: 'active', nextSessionDate: '2026-09-19' },
  { id: '9', name: 'Sophie Klein', discipline: 'Radfahren', status: 'active', nextSessionDate: '2026-09-16' },
  { id: '10', name: 'Luca Schmidt', discipline: 'Triathlon', status: 'inactive', nextSessionDate: '2026-10-05' },
  { id: '11', name: 'Mia Neumann', discipline: 'Laufen', status: 'active', nextSessionDate: '2026-09-21' },
  { id: '12', name: 'Noah Schwarz', discipline: 'Rollski', status: 'paused', nextSessionDate: '2026-09-25' },
  { id: '13', name: 'Ella Zimmermann', discipline: 'Skilanglauf', status: 'active', nextSessionDate: '2026-09-14' },
  { id: '14', name: 'Anton Braun', discipline: 'Athletik', status: 'active', nextSessionDate: '2026-09-23' },
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

const dateFormatter = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })

const columnHelper = createColumnHelper<AthleteRow>()

// Recomputed via `computed` (rather than a plain const) so column
// headers/labels stay correct if the active language changes.
const columns = computed(() => [
  columnHelper.accessor('name', {
    header: $gettext('Name'),
    filterFn: 'includesString',
    meta: {
      filterVariant: 'text',
      filterLabel: $gettext('Name durchsuchen'),
    },
  }),
  columnHelper.accessor('discipline', {
    header: $gettext('Sportart'),
  }),
  columnHelper.accessor('status', {
    header: $gettext('Status'),
    filterFn: 'equalsString',
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
  columnHelper.accessor('nextSessionDate', {
    header: $gettext('Nächste Einheit'),
    cell: (info) => dateFormatter.format(new Date(info.getValue())),
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
