<script setup lang="ts">
// Second real dashboard widget (S02-T5): shows the pending-video-reviews
// count plus a short mock list of reviews awaiting the trainer's feedback.
// Reads from the shared dashboard store (backed by TrainerDashboardRepository);
// Dashboard.vue triggers the initial load, this widget only renders the
// reactive state.
//
// Everything here is a mocked preview only:
// - `status` is a placeholder label, no real review-workflow logic
// - missing `thumbnailUrl` falls back to a generic placeholder thumbnail -
//   real thumbnails come later from the video-analysis pipeline, not built
//   or generated here
// - the "view all" action below is intentionally non-functional (disabled) -
//   the full review list is a separate, larger feature for a later sprint
import { computed } from 'vue'
import { useGettext } from 'vue3-gettext'

import BaseButton from '@/components/BaseButton.vue'
import BaseCard from '@/components/BaseCard.vue'
import { useDashboardStore } from '@/stores/dashboard'

defineOptions({ name: 'PendingVideoReviewsWidget' })

const { $gettext } = useGettext()
const dashboardStore = useDashboardStore()

const reviewCount = computed(() => dashboardStore.summary?.pendingVideoReviewsCount)
</script>

<template>
  <BaseCard class="pending-reviews">
    <h2 class="pending-reviews__title">{{ $gettext('Offene Videoanalysen') }}</h2>

    <p v-if="reviewCount !== undefined" class="pending-reviews__count">{{ reviewCount }}</p>
    <p
      v-else-if="dashboardStore.isLoading"
      class="pending-reviews__count pending-reviews__count--loading"
    >
      {{ $gettext('Lädt…') }}
    </p>

    <ul v-if="dashboardStore.pendingVideoReviews.length > 0" class="pending-reviews__list">
      <li
        v-for="review in dashboardStore.pendingVideoReviews"
        :key="review.id"
        class="pending-reviews__item"
      >
        <!-- Video thumbnail placeholder: generic play icon (shape adapted
             from mygoal-webapp-ui's src/assets/svg/icons/play.svg) over a
             neutral box, standing in for the real video thumbnail. -->
        <span
          class="pending-reviews__thumbnail"
          role="img"
          :aria-label="$gettext('Video-Vorschau')"
        >
          <svg
            viewBox="0 0 17 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              transform="translate(0.5 0)"
              d="M1 3.09001C1 2.13275 1 1.65412 1.21394 1.39028C1.40032 1.16043 1.68519 1.0182 1.99357 1.00102C2.34755 0.981305 2.77443 1.2468 3.62818 1.77779L14.7383 8.68778C15.4438 9.12653 15.7965 9.34591 15.9194 9.62241C16.0269 9.86416 16.0269 10.1358 15.9194 10.3776C15.7965 10.6541 15.4438 10.8735 14.7383 11.3122L3.62817 18.2222C2.77443 18.7532 2.34755 19.0187 1.99357 18.999C1.68519 18.9818 1.40032 18.8396 1.21394 18.6097C1 18.3459 1 17.8672 1 16.91V3.09001Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span class="pending-reviews__athlete">{{ review.athleteName }}</span>
        <span class="pending-reviews__status">{{ review.status }}</span>
      </li>
    </ul>

    <!-- Non-functional placeholder: the full review list is a separate,
         larger feature for a later sprint - intentionally not built here. -->
    <BaseButton variant="text" size="small" class="pending-reviews__view-all" disabled>
      {{ $gettext('Alle anzeigen') }}
    </BaseButton>
  </BaseCard>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.pending-reviews__title {
  @include typo('h2', $font-family-base, $font-weight-semibold);
  margin: 0;
  color: $color-neutral-900;
}

.pending-reviews__count {
  @include typo('h1', $font-family-base, $font-weight-bold);
  margin: $space-8 0 0;
  color: $color-orange-600;
}

.pending-reviews__count--loading {
  @include typo('body', $font-family-base, $font-weight-regular);
  color: $color-neutral-400;
}

.pending-reviews__list {
  list-style: none;
  margin: $space-16 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: $space-12;
}

.pending-reviews__item {
  display: flex;
  align-items: center;
  gap: $space-12;
}

.pending-reviews__thumbnail {
  width: 48px;
  height: 32px;
  border-radius: $radius-xxs;
  background: $color-neutral-100;
  color: $color-neutral-400;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 12px;
    height: 14px;
  }
}

.pending-reviews__athlete {
  @include typo('body', $font-family-base, $font-weight-semibold);
  color: $color-neutral-900;
  flex: 1;
}

.pending-reviews__status {
  @include typo('small', $font-family-base, $font-weight-regular);
  color: $color-neutral-500;
  background: $color-neutral-50;
  border-radius: $radius-xs;
  padding: $space-4 $space-8;
}

.pending-reviews__view-all {
  margin-top: $space-8;
  padding-left: 0;
}
</style>
