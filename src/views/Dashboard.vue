<script setup lang="ts">
// Dashboard view wired to TrainerDashboardRepository (mock) for widget
// data (S02-T3/T4/T5, S03-T1). Each dashboard card is a dedicated widget.
import { onMounted } from 'vue'
import { useGettext } from 'vue3-gettext'

import AthleteOverviewWidget from '@/components/AthleteOverviewWidget.vue'
import MessagesWidget from '@/components/MessagesWidget.vue'
import PendingVideoReviewsWidget from '@/components/PendingVideoReviewsWidget.vue'
import TodaysActivitiesWidget from '@/components/TodaysActivitiesWidget.vue'
import { useDashboardStore } from '@/stores/dashboard'

// Explicit multi-word name so the file can stay `Dashboard.vue` while
// satisfying the vue/multi-word-component-names lint rule.
defineOptions({ name: 'DashboardPage' })

const { $gettext } = useGettext()
const dashboardStore = useDashboardStore()

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
      <TodaysActivitiesWidget class="dashboard__widget" />
      <MessagesWidget class="dashboard__widget" />
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

</style>
