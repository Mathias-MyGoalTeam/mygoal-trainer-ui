<script setup lang="ts">
// Dashboard view wired to TrainerDashboardRepository (mock) for widget
// data (S02-T3/T4/T5). "Assigned Athletes" and "Pending Video Reviews" are
// now dedicated widgets; "Messages" remains a title-only placeholder for
// now - no repository field for it yet.
import { computed, onMounted } from 'vue'
import { useGettext } from 'vue3-gettext'

import AthleteOverviewWidget from '@/components/AthleteOverviewWidget.vue'
import BaseCard from '@/components/BaseCard.vue'
import PendingVideoReviewsWidget from '@/components/PendingVideoReviewsWidget.vue'
import { useDashboardStore } from '@/stores/dashboard'

// Explicit multi-word name so the file can stay `Dashboard.vue` while
// satisfying the vue/multi-word-component-names lint rule.
defineOptions({ name: 'DashboardPage' })

interface DashboardWidget {
  id: string
  title: string
  value?: number
}

const { $gettext } = useGettext()
const dashboardStore = useDashboardStore()

const widgets = computed<DashboardWidget[]>(() => [
  {
    id: 'active-training-plans',
    title: $gettext('Aktive Trainingspläne'),
    value: dashboardStore.summary?.activeTrainingPlansCount,
  },
  {
    id: 'messages',
    title: $gettext('Nachrichten'),
  },
])

onMounted(async () => {
  await dashboardStore.loadSummary()
})
</script>

<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <h1 class="dashboard__title">{{ $gettext('Dashboard') }}</h1>
    </header>

    <section class="dashboard__grid" :aria-label="$gettext('Dashboard-Widgets')">
      <AthleteOverviewWidget class="dashboard__widget" />
      <PendingVideoReviewsWidget class="dashboard__widget" />

      <BaseCard v-for="widget in widgets" :key="widget.id" class="dashboard__widget">
        <h2 class="dashboard__widget-title">{{ widget.title }}</h2>
        <p v-if="widget.value !== undefined" class="dashboard__widget-value">{{ widget.value }}</p>
        <p
          v-else-if="dashboardStore.isLoading"
          class="dashboard__widget-value dashboard__widget-value--loading"
        >
          {{ $gettext('Lädt…') }}
        </p>
      </BaseCard>
    </section>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

// Desktop-first layout: designed and verified for >= 1280px viewports.
// No mobile/responsive variant here by design - see docs/design-principles.md.
.dashboard {
  max-width: $container-max-width;
  margin: 0 auto;
  padding: $space-40 $space-24 $space-60;
  display: flex;
  flex-direction: column;
  gap: $space-32;
}

.dashboard__title {
  @include typo('h1', $font-family-base, $font-weight-bold);
  margin: 0;
  color: $color-neutral-900;
}

// Fits 4+ widget cards side by side at desktop widths (~1280px and above).
// align-items: start keeps each card sized to its own content, so expanding
// one widget (e.g. the athlete list) doesn't stretch its siblings taller.
.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: $space-24;
  align-items: start;
}

.dashboard__widget-title {
  @include typo('h2', $font-family-base, $font-weight-semibold);
  margin: 0;
  color: $color-neutral-900;
}

.dashboard__widget-value {
  @include typo('h1', $font-family-base, $font-weight-bold);
  margin: $space-8 0 0;
  color: $color-orange-600;
}

.dashboard__widget-value--loading {
  @include typo('body', $font-family-base, $font-weight-regular);
  color: $color-neutral-400;
}
</style>
