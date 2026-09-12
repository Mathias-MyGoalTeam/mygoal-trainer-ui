<script setup lang="ts">
// Structure-only dashboard skeleton (S02-T2). Widgets are static placeholder
// cards - no data-fetching or repository wiring here. Real widget content
// will be layered in on top of this grid in a later task (S02-T3).
import { computed } from 'vue'
import { useGettext } from 'vue3-gettext'

import BaseCard from '@/components/BaseCard.vue'

// Explicit multi-word name so the file can stay `Dashboard.vue` while
// satisfying the vue/multi-word-component-names lint rule.
defineOptions({ name: 'DashboardPage' })

interface WidgetPlaceholder {
  id: string
  title: string
}

const { $gettext } = useGettext()

const widgetPlaceholders = computed<WidgetPlaceholder[]>(() => [
  { id: 'assigned-athletes', title: $gettext('Zugewiesene Athleten') },
  { id: 'upcoming-sessions', title: $gettext('Anstehende Einheiten') },
  { id: 'training-plans', title: $gettext('Trainingspläne') },
  { id: 'messages', title: $gettext('Nachrichten') },
])
</script>

<template>
  <div class="dashboard">
    <header class="dashboard__header">
      <h1 class="dashboard__title">{{ $gettext('Dashboard') }}</h1>
    </header>

    <section class="dashboard__grid" :aria-label="$gettext('Dashboard-Widgets')">
      <BaseCard v-for="widget in widgetPlaceholders" :key="widget.id" class="dashboard__widget">
        <h2 class="dashboard__widget-title">{{ widget.title }}</h2>
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
.dashboard__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: $space-24;
}

.dashboard__widget-title {
  @include typo('h2', $font-family-base, $font-weight-semibold);
  margin: 0;
  color: $color-neutral-900;
}
</style>
