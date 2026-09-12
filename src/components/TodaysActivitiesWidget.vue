<script setup lang="ts">
// Third real dashboard widget (S03-T1, replacing the former "Active
// Training Plans" widget): trainer's quick overview of what each athlete
// has scheduled today. Reads from the shared dashboard store (backed by
// TrainerDashboardRepository); Dashboard.vue triggers the initial load,
// this widget only renders the reactive state.
//
// Everything here is a mocked preview only:
// - `activityKind` picks an icon (see @/composables/activityIcons.ts),
//   `title` and `done` are placeholder data - no real training-plan model
//   or completion/feedback workflow yet (that belongs to AP-20)
// - the "view all" action below is intentionally non-functional (disabled) -
//   FYI for later: this is meant to eventually jump to the actual planning
//   page, the same way the Athlete Overview widget will one day jump to an
//   athlete's profile and Pending Video Reviews to the latest video
//   results - none of that navigation is built yet
import { computed } from 'vue'
import { useGettext } from 'vue3-gettext'

import { activityIcons } from '@/composables/activityIcons'
import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useDashboardStore } from '@/stores/dashboard'

defineOptions({ name: 'TodaysActivitiesWidget' })

const { $gettext } = useGettext()
const dashboardStore = useDashboardStore()

const activityCount = computed(() => dashboardStore.summary?.todaysActivitiesCount)
</script>

<template>
  <BaseCard class="todays-activities">
    <h2 class="todays-activities__title">{{ $gettext('Heutige Aktivitäten') }}</h2>

    <p v-if="activityCount !== undefined" class="todays-activities__count">{{ activityCount }}</p>
    <p
      v-else-if="dashboardStore.isLoading"
      class="todays-activities__count todays-activities__count--loading"
    >
      {{ $gettext('Lädt…') }}
    </p>

    <ul v-if="dashboardStore.todaysActivities.length > 0" class="todays-activities__list">
      <li
        v-for="activity in dashboardStore.todaysActivities"
        :key="activity.id"
        class="todays-activities__item"
      >
        <img
          class="todays-activities__icon"
          :src="activityIcons[activity.activityKind]"
          :alt="activity.activityKind"
        />

        <div class="todays-activities__info">
          <span class="todays-activities__athlete">{{ activity.athleteName }}</span>
          <span class="todays-activities__activity-title">{{ activity.title }}</span>
        </div>

        <span
          v-if="activity.done"
          class="todays-activities__done"
          role="img"
          :aria-label="$gettext('Erledigt')"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M20 6L9 17L4 12"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </li>
    </ul>

    <!-- Non-functional placeholder: this will eventually link to the real
         planning page (AP-20) - intentionally not built here. -->
    <BaseButton variant="text" size="small" class="todays-activities__view-all" disabled>
      {{ $gettext('Alle anzeigen') }}
    </BaseButton>
  </BaseCard>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.todays-activities__title {
  @include typo('h2', $font-family-base, $font-weight-semibold);
  margin: 0;
  color: $color-neutral-900;
}

.todays-activities__count {
  @include typo('h1', $font-family-base, $font-weight-bold);
  margin: $space-8 0 0;
  color: $color-orange-600;
}

.todays-activities__count--loading {
  @include typo('body', $font-family-base, $font-weight-regular);
  color: $color-neutral-400;
}

.todays-activities__list {
  list-style: none;
  margin: $space-16 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $space-12;
}

.todays-activities__item {
  display: flex;
  align-items: center;
  gap: $space-12;
}

.todays-activities__icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
}

.todays-activities__info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.todays-activities__athlete {
  @include typo('body', $font-family-base, $font-weight-semibold);
  color: $color-neutral-900;
}

.todays-activities__activity-title {
  @include typo('small', $font-family-base, $font-weight-regular);
  color: $color-neutral-500;
}

.todays-activities__done {
  width: 20px;
  height: 20px;
  border-radius: $radius-circled;
  background: $color-lime-600;
  color: $color-neutral-0;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 12px;
    height: 12px;
  }
}

.todays-activities__view-all {
  margin-top: $space-8;
  padding-left: 0;
}
</style>
