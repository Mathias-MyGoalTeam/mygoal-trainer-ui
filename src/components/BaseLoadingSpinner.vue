<script setup lang="ts">
// Consistent loading indicator (rotating ring, pure CSS). Alternative to
// BaseSkeletonLoader when there's no known content shape to mimic yet, or
// for small inline loading states (e.g. inside a button).
//
// Usage:
//   <BaseLoadingSpinner />
//   <BaseLoadingSpinner size="small" label="Lädt Athleten…" />
import { useGettext } from 'vue3-gettext'

withDefaults(
  defineProps<{
    size?: 'small' | 'medium' | 'large'
    label?: string
  }>(),
  {
    size: 'medium',
    label: undefined,
  },
)

defineOptions({ name: 'BaseLoadingSpinner' })

const { $gettext } = useGettext()
</script>

<template>
  <span class="base-loading-spinner" :class="`base-loading-spinner--${size}`" role="status">
    <span class="base-loading-spinner__ring" aria-hidden="true" />
    <span v-if="label" class="base-loading-spinner__label">{{ label }}</span>
    <span v-else class="base-loading-spinner__sr-only">{{ $gettext('Lädt…') }}</span>
  </span>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-loading-spinner {
  display: inline-flex;
  align-items: center;
  gap: $space-12;
  color: $color-orange-500;
}

.base-loading-spinner__ring {
  display: inline-block;
  border-radius: $radius-circled;
  border: 3px solid $color-neutral-100;
  border-top-color: currentColor;
  animation: base-loading-spinner-spin 0.7s linear infinite;
}

.base-loading-spinner--small .base-loading-spinner__ring {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.base-loading-spinner--medium .base-loading-spinner__ring {
  width: 24px;
  height: 24px;
}

.base-loading-spinner--large .base-loading-spinner__ring {
  width: 40px;
  height: 40px;
  border-width: 4px;
}

.base-loading-spinner__label {
  @include typo('small', $font-family-base, $font-weight-regular);
  color: $color-neutral-500;
}

.base-loading-spinner__sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
}

@keyframes base-loading-spinner-spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
