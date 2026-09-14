<script setup lang="ts">
// Content-shaped loading placeholder - alternative to BaseLoadingSpinner
// when the eventual content's rough shape is known (a text line, an
// avatar circle, a card block) and showing that shape reduces layout
// shift once real data arrives.
//
// Usage:
//   <BaseSkeletonLoader variant="text" :lines="3" />
//   <BaseSkeletonLoader variant="circle" width="40px" height="40px" />
//   <BaseSkeletonLoader variant="rect" width="100%" height="120px" />
withDefaults(
  defineProps<{
    variant?: 'text' | 'circle' | 'rect'
    lines?: number
    width?: string
    height?: string
  }>(),
  {
    variant: 'text',
    lines: 1,
    width: undefined,
    height: undefined,
  },
)

defineOptions({ name: 'BaseSkeletonLoader' })
</script>

<template>
  <span v-if="variant === 'text'" class="base-skeleton-loader-lines" role="status" aria-label="Lädt…">
    <span
      v-for="line in lines"
      :key="line"
      class="base-skeleton-loader base-skeleton-loader--text"
      :style="{ width, height }"
    />
  </span>
  <span
    v-else
    class="base-skeleton-loader"
    :class="`base-skeleton-loader--${variant}`"
    :style="{ width, height }"
    role="status"
    aria-label="Lädt…"
  />
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;

.base-skeleton-loader-lines {
  display: flex;
  flex-direction: column;
  gap: $space-8;
  width: 100%;
}

.base-skeleton-loader {
  display: block;
  background: linear-gradient(
    90deg,
    $color-neutral-50 25%,
    $color-neutral-100 37%,
    $color-neutral-50 63%
  );
  background-size: 400% 100%;
  animation: base-skeleton-loader-shimmer 1.4s ease infinite;
}

.base-skeleton-loader--text {
  width: 100%;
  height: 14px;
  border-radius: $radius-xxs;
}

.base-skeleton-loader--circle {
  width: 40px;
  height: 40px;
  border-radius: $radius-circled;
}

.base-skeleton-loader--rect {
  width: 100%;
  height: 80px;
  border-radius: $radius-xs;
}

@keyframes base-skeleton-loader-shimmer {
  0% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0 50%;
  }
}
</style>
