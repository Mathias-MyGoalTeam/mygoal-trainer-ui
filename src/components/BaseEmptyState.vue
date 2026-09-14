<script setup lang="ts">
// "No data yet" placeholder for lists/tables (e.g. an athlete with zero
// pending video reviews, a training-plan table with no plans yet). Purely
// presentational - callers decide the copy and optionally provide a call
// to action via the default slot (e.g. a "create new" button).
//
// Usage:
//   <BaseEmptyState
//     title="Noch keine Trainingspläne"
//     message="Erstelle den ersten Plan für diesen Athleten."
//   >
//     <BaseButton>Neuen Plan erstellen</BaseButton>
//   </BaseEmptyState>
import feedbackIcon from '@/assets/svg/icons/feedback.svg?raw'
import BaseIcon from '@/components/BaseIcon.vue'

withDefaults(
  defineProps<{
    title: string
    message?: string
  }>(),
  {
    message: undefined,
  },
)

defineOptions({ name: 'BaseEmptyState' })
</script>

<template>
  <div class="base-empty-state">
    <BaseIcon class="base-empty-state__icon" :svg="feedbackIcon" size="large" />
    <h3 class="base-empty-state__title">{{ title }}</h3>
    <p v-if="message" class="base-empty-state__message">{{ message }}</p>
    <div v-if="$slots.default" class="base-empty-state__action">
      <slot />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-empty-state {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: $space-40 $space-24;
  color: $color-neutral-500;
}

.base-empty-state__icon {
  color: $color-neutral-300;
  margin-bottom: $space-16;
}

.base-empty-state__title {
  @include typo('title', $font-family-base, $font-weight-semibold);
  margin: 0;
  color: $color-neutral-700;
}

.base-empty-state__message {
  @include typo('body', $font-family-base, $font-weight-regular);
  margin: $space-8 0 0;
  max-width: 400px;
}

.base-empty-state__action {
  margin-top: $space-20;
}
</style>
