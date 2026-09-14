<script setup lang="ts">
// Pill-shaped status label - more expressive/textual than BaseBadge, for
// domain statuses (athlete status, invoice status, review status, ...).
// Visual only: it takes a `variant` prop for coloring, but has no idea what
// "Aktiv"/"Pausiert"/"Überfällig" etc. mean - callers own the mapping from
// their domain status value to a variant.
//
// Usage:
//   <BaseStatusPill variant="success">Aktiv</BaseStatusPill>
//   <BaseStatusPill variant="warning">Pausiert</BaseStatusPill>
withDefaults(
  defineProps<{
    variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info'
  }>(),
  {
    variant: 'neutral',
  },
)

defineOptions({ name: 'BaseStatusPill' })
</script>

<template>
  <span class="base-status-pill" :class="`base-status-pill--${variant}`">
    <slot />
  </span>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-status-pill {
  @include typo('caption', $font-family-base, $font-weight-semibold);
  @include padding($space-4 $space-12);
  display: inline-flex;
  align-items: center;
  border-radius: $radius-xl;
  white-space: nowrap;
}

.base-status-pill--neutral {
  background-color: $color-neutral-50;
  color: $color-neutral-700;
}

.base-status-pill--success {
  background-color: $color-lime-100;
  color: $color-lime-900;
}

.base-status-pill--warning {
  background-color: $color-orange-100;
  color: $color-orange-900;
}

.base-status-pill--danger {
  background-color: rgba($color-red-500, 0.12);
  color: $color-red-500;
}

.base-status-pill--info {
  background-color: $color-blue-50;
  color: $color-blue-700;
}
</style>
