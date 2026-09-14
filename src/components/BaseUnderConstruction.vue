<script setup lang="ts">
// Placeholder banner/overlay marking a not-yet-built page, meant to gather
// early feedback from trainers on page structure before the real feature
// is implemented. Two layout variants:
//   - "banner": a slim strip at the top of an otherwise-real page
//   - "overlay": covers the whole content area (for pages that are
//     entirely a stub so far)
//
// Usage:
//   <BaseUnderConstruction message="Diese Seite befindet sich im Aufbau." />
//   <BaseUnderConstruction variant="overlay" title="Trainingspläne">
//     Wir arbeiten an dieser Ansicht - Feedback ist willkommen!
//   </BaseUnderConstruction>
import editIcon from '@/assets/svg/icons/edit.svg?raw'
import BaseIcon from '@/components/BaseIcon.vue'

withDefaults(
  defineProps<{
    variant?: 'banner' | 'overlay'
    title?: string
    message?: string
  }>(),
  {
    variant: 'banner',
    title: undefined,
    message: undefined,
  },
)

defineOptions({ name: 'BaseUnderConstruction' })
</script>

<template>
  <div class="base-under-construction" :class="`base-under-construction--${variant}`">
    <BaseIcon
      class="base-under-construction__icon"
      :svg="editIcon"
      :size="variant === 'overlay' ? 'large' : 'medium'"
    />
    <div class="base-under-construction__text">
      <h3 v-if="title" class="base-under-construction__title">{{ title }}</h3>
      <p v-if="message" class="base-under-construction__message">{{ message }}</p>
      <p v-if="$slots.default" class="base-under-construction__message">
        <slot />
      </p>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-under-construction {
  display: flex;
  align-items: center;
  gap: $space-16;
  border-radius: $radius-sm;
  background: $color-orange-50;
  color: $color-orange-900;
}

.base-under-construction--banner {
  @include padding($space-12 $space-20);
}

.base-under-construction--overlay {
  flex-direction: column;
  text-align: center;
  justify-content: center;
  padding: $space-48 $space-24;
  min-height: 240px;
}

.base-under-construction__icon {
  flex-shrink: 0;
}

.base-under-construction__text {
  min-width: 0;
}

.base-under-construction__title {
  @include typo('h2', $font-family-base, $font-weight-semibold);
  margin: 0 0 $space-4;
}

.base-under-construction__message {
  @include typo('small', $font-family-base, $font-weight-regular);
  margin: 0;
}
</style>
