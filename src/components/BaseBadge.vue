<script setup lang="ts">
// Small circular status indicator - formalizes the ad hoc "done" checkmark
// that used to be hand-styled inline in TodaysActivitiesWidget.vue into a
// reusable atom. Purely presentational: the variant only picks a color,
// callers decide what it means (done, new, alert, ...).
//
// Usage:
//   <BaseBadge variant="success" aria-label="Erledigt">
//     <BaseIcon :svg="checkIcon" size="small" />
//   </BaseBadge>
withDefaults(
  defineProps<{
    variant?: 'success' | 'neutral' | 'warning' | 'danger' | 'info'
    size?: 'small' | 'medium'
    ariaLabel?: string
  }>(),
  {
    variant: 'neutral',
    size: 'medium',
    ariaLabel: undefined,
  },
)

defineOptions({ name: 'BaseBadge' })
</script>

<template>
  <span
    class="base-badge"
    :class="[`base-badge--${variant}`, `base-badge--${size}`]"
    role="img"
    :aria-label="ariaLabel"
  >
    <slot />
  </span>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;

.base-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-circled;
  flex-shrink: 0;
  color: $color-neutral-0;
}

.base-badge--small {
  width: 16px;
  height: 16px;
}

.base-badge--medium {
  width: 20px;
  height: 20px;
}

.base-badge--success {
  background-color: $color-lime-600;
}

.base-badge--neutral {
  background-color: $color-neutral-300;
}

.base-badge--warning {
  background-color: $color-orange-600;
}

.base-badge--danger {
  background-color: $color-red-500;
}

.base-badge--info {
  background-color: $color-blue-500;
}
</style>
