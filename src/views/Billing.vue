<script setup lang="ts">
// Billing/invoices list page (S04, Architecture Foundation - TanStack
// Table integration): wires the same shared BaseDataTable + BaseFilterBar
// + BasePagination pattern used in src/views/Athletes.vue against a second,
// differently-shaped mock dataset (invoices instead of athletes) to prove
// the table components are truly domain-agnostic/reusable. All invoice
// knowledge (field names, status enum, currency formatting) lives here,
// not in the shared table components. Still not wired to the Data-Hub -
// real invoice data is a dedicated feature task.
import { computed, h, shallowRef } from 'vue'
import { useGettext } from 'vue3-gettext'
import { createColumnHelper } from '@tanstack/vue-table'
import type { Table } from '@tanstack/vue-table'

import BaseDataTable from '@/components/BaseDataTable.vue'
import BaseFilterBar from '@/components/BaseFilterBar.vue'
import BasePageHeader from '@/components/BasePageHeader.vue'
import BasePagination from '@/components/BasePagination.vue'
import BaseStatusPill from '@/components/BaseStatusPill.vue'

// Explicit multi-word name so the file can stay `Billing.vue` while
// satisfying the vue/multi-word-component-names lint rule.
defineOptions({ name: 'BillingPage' })

const { $gettext } = useGettext()

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue'

interface InvoiceRow {
  id: string
  invoiceNumber: string
  athleteName: string
  amount: number
  status: InvoiceStatus
  dueDate: string
}

// Small illustrative dataset only, enough rows to exercise sorting,
// filtering, and pagination (BaseDataTable's default page size is 10) -
// not sourced from the Data-Hub/a repository.
const invoices: InvoiceRow[] = [
  { id: '1', invoiceNumber: 'R-2026-0091', athleteName: 'Lea Hoffmann', amount: 89.0, status: 'paid', dueDate: '2026-08-15' },
  { id: '2', invoiceNumber: 'R-2026-0092', athleteName: 'Jonas Weber', amount: 129.5, status: 'sent', dueDate: '2026-09-20' },
  { id: '3', invoiceNumber: 'R-2026-0093', athleteName: 'Mara Schulz', amount: 59.0, status: 'draft', dueDate: '2026-09-28' },
  { id: '4', invoiceNumber: 'R-2026-0094', athleteName: 'Finn Becker', amount: 199.0, status: 'overdue', dueDate: '2026-08-30' },
  { id: '5', invoiceNumber: 'R-2026-0095', athleteName: 'Nina Fischer', amount: 89.0, status: 'paid', dueDate: '2026-08-10' },
  { id: '6', invoiceNumber: 'R-2026-0096', athleteName: 'Paul Krüger', amount: 149.0, status: 'sent', dueDate: '2026-09-22' },
  { id: '7', invoiceNumber: 'R-2026-0097', athleteName: 'Emma Wolf', amount: 59.0, status: 'overdue', dueDate: '2026-09-01' },
  { id: '8', invoiceNumber: 'R-2026-0098', athleteName: 'Ben Richter', amount: 219.0, status: 'paid', dueDate: '2026-08-05' },
  { id: '9', invoiceNumber: 'R-2026-0099', athleteName: 'Sophie Klein', amount: 89.0, status: 'draft', dueDate: '2026-10-01' },
  { id: '10', invoiceNumber: 'R-2026-0100', athleteName: 'Luca Schmidt', amount: 129.5, status: 'sent', dueDate: '2026-09-25' },
  { id: '11', invoiceNumber: 'R-2026-0101', athleteName: 'Mia Neumann', amount: 59.0, status: 'paid', dueDate: '2026-07-28' },
  { id: '12', invoiceNumber: 'R-2026-0102', athleteName: 'Noah Schwarz', amount: 199.0, status: 'overdue', dueDate: '2026-08-20' },
  { id: '13', invoiceNumber: 'R-2026-0103', athleteName: 'Ella Zimmermann', amount: 89.0, status: 'sent', dueDate: '2026-09-30' },
  { id: '14', invoiceNumber: 'R-2026-0104', athleteName: 'Anton Braun', amount: 149.0, status: 'draft', dueDate: '2026-10-04' },
]

const statusLabels = computed<Record<InvoiceStatus, string>>(() => ({
  draft: $gettext('Entwurf'),
  sent: $gettext('Versendet'),
  paid: $gettext('Bezahlt'),
  overdue: $gettext('Überfällig'),
}))

const statusPillVariant: Record<InvoiceStatus, 'neutral' | 'info' | 'success' | 'danger'> = {
  draft: 'neutral',
  sent: 'info',
  paid: 'success',
  overdue: 'danger',
}

const dateFormatter = new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
const currencyFormatter = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' })

const columnHelper = createColumnHelper<InvoiceRow>()

// Recomputed via `computed` (rather than a plain const) so column
// headers/labels stay correct if the active language changes.
const columns = computed(() => [
  columnHelper.accessor('invoiceNumber', {
    header: $gettext('Rechnungsnr.'),
    filterFn: 'includesString',
    meta: {
      filterVariant: 'text',
      filterLabel: $gettext('Rechnungsnr. durchsuchen'),
    },
  }),
  columnHelper.accessor('athleteName', {
    header: $gettext('Athlet'),
  }),
  columnHelper.accessor('amount', {
    header: $gettext('Betrag'),
    cell: (info) => currencyFormatter.format(info.getValue()),
  }),
  columnHelper.accessor('status', {
    header: $gettext('Status'),
    filterFn: 'equalsString',
    cell: (info) =>
      h(BaseStatusPill, { variant: statusPillVariant[info.getValue()] }, () => statusLabels.value[info.getValue()]),
    meta: {
      filterVariant: 'select',
      filterLabel: $gettext('Status'),
      filterOptions: (Object.keys(statusLabels.value) as InvoiceStatus[]).map((status) => ({
        value: status,
        label: statusLabels.value[status],
      })),
    },
  }),
  columnHelper.accessor('dueDate', {
    header: $gettext('Fällig am'),
    cell: (info) => dateFormatter.format(new Date(info.getValue())),
  }),
])

const table = shallowRef<Table<InvoiceRow>>()
</script>

<template>
  <div class="page">
    <BasePageHeader :title="$gettext('Abrechnung')" />

    <BaseFilterBar :table="table" />

    <BaseDataTable
      :columns="columns"
      :data="invoices"
      :empty-title="$gettext('Keine Rechnungen gefunden')"
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
