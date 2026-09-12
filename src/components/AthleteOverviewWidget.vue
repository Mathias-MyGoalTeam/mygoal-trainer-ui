<script setup lang="ts">
// First real dashboard widget (S02-T4): shows the assigned-athletes count
// plus a preview list of mock athletes, expandable to the full roster.
// Reads from the shared dashboard store (backed by TrainerDashboardRepository);
// Dashboard.vue triggers the initial load, this widget only renders the
// reactive state - it never invents athlete data itself.
//
// Status labels and avatars are placeholders only:
// - `status` has no real business logic yet (see AP-21)
// - missing `avatarUrl` falls back to a generic placeholder image - this is
//   a stand-in until real profile images exist, no upload/handling here.
import { computed, ref } from 'vue'
import { useGettext } from 'vue3-gettext'

import avatarPlaceholder from '@/assets/img/avatar-placeholder.png'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import { DASHBOARD_WIDGET_PREVIEW_LIMIT } from '@/composables/dashboardWidgetPreview'
import { useDashboardStore } from '@/stores/dashboard'

defineOptions({ name: 'AthleteOverviewWidget' })

// How many athletes to show before the card needs expanding - shared with
// the other dashboard widgets so their collapsed list lengths (and thus
// card heights) line up.
const PREVIEW_LIMIT = DASHBOARD_WIDGET_PREVIEW_LIMIT

const { $gettext } = useGettext()
const dashboardStore = useDashboardStore()

const isExpanded = ref(false)

const athleteCount = computed(() => dashboardStore.summary?.assignedAthletesCount)

const visibleAthletes = computed(() =>
  isExpanded.value ? dashboardStore.athletes : dashboardStore.athletes.slice(0, PREVIEW_LIMIT),
)

// Based on the actual roster length from the repository, not the summary
// count - the two are expected to match, but the list itself is the source
// of truth for "how many more can be shown".
const hiddenCount = computed(() => Math.max(dashboardStore.athletes.length - PREVIEW_LIMIT, 0))

// Fills the collapsed preview up to PREVIEW_LIMIT rows with empty
// placeholder slots when fewer athletes are assigned than the limit, so
// the card reaches the same height as its siblings even with a short
// roster. Not used while expanded - the full roster defines its own height.
const placeholderCount = computed(() =>
  isExpanded.value || visibleAthletes.value.length === 0
    ? 0
    : PREVIEW_LIMIT - visibleAthletes.value.length,
)

function expand() {
  isExpanded.value = true
}

function collapse() {
  isExpanded.value = false
}
</script>

<template>
  <BaseCard class="athlete-overview">
    <h2 class="athlete-overview__title">{{ $gettext('Zugewiesene Athleten') }}</h2>

    <p v-if="athleteCount !== undefined" class="athlete-overview__count">{{ athleteCount }}</p>
    <p
      v-else-if="dashboardStore.isLoading"
      class="athlete-overview__count athlete-overview__count--loading"
    >
      {{ $gettext('Lädt…') }}
    </p>

    <ul v-if="visibleAthletes.length > 0" class="athlete-overview__list">
      <li v-for="athlete in visibleAthletes" :key="athlete.id" class="athlete-overview__item">
        <img
          class="athlete-overview__avatar"
          :src="athlete.avatarUrl ?? avatarPlaceholder"
          :alt="$gettext('Profilbild')"
        />
        <span class="athlete-overview__name">{{ athlete.name }}</span>
        <span class="athlete-overview__status">{{ athlete.status }}</span>
      </li>
      <li
        v-for="n in placeholderCount"
        :key="`placeholder-${n}`"
        class="athlete-overview__item athlete-overview__item--placeholder"
        aria-hidden="true"
      />
    </ul>

    <BaseButton
      v-if="!isExpanded && hiddenCount > 0"
      variant="text"
      size="small"
      class="athlete-overview__toggle"
      @click="expand"
    >
      {{ $gettext('und %{count} weitere', { count: hiddenCount }) }}
    </BaseButton>
    <BaseButton
      v-else-if="isExpanded && hiddenCount > 0"
      variant="text"
      size="small"
      class="athlete-overview__toggle"
      @click="collapse"
    >
      {{ $gettext('Weniger anzeigen') }}
    </BaseButton>
  </BaseCard>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.athlete-overview__title {
  @include typo('h2', $font-family-base, $font-weight-semibold);
  margin: 0;
  color: $color-neutral-900;
}

.athlete-overview__count {
  @include typo('h1', $font-family-base, $font-weight-bold);
  margin: $space-8 0 0;
  color: $color-orange-600;
}

.athlete-overview__count--loading {
  @include typo('body', $font-family-base, $font-weight-regular);
  color: $color-neutral-400;
}

.athlete-overview__list {
  list-style: none;
  margin: $space-16 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $space-12;
}

.athlete-overview__item {
  display: flex;
  align-items: center;
  gap: $space-12;
  min-height: $space-48;
}

.athlete-overview__item--placeholder {
  visibility: hidden;
}

.athlete-overview__avatar {
  width: 36px;
  height: 36px;
  border-radius: $radius-circled;
  object-fit: cover;
  flex-shrink: 0;
  background: $color-neutral-50;
}

.athlete-overview__name {
  @include typo('body', $font-family-base, $font-weight-semibold);
  color: $color-neutral-900;
  flex: 1;
}

.athlete-overview__status {
  @include typo('small', $font-family-base, $font-weight-regular);
  color: $color-neutral-500;
  background: $color-neutral-50;
  border-radius: $radius-xs;
  padding: $space-4 $space-8;
}

.athlete-overview__toggle {
  margin-top: $space-8;
  padding-left: 0;
}
</style>
