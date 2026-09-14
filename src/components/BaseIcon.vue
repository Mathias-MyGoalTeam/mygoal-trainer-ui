<script setup lang="ts">
// Renders an inline SVG icon (imported with the `?raw` Vite suffix, e.g.
// `import closeIcon from '@/assets/svg/icons/xclose.svg?raw'`) so its
// `stroke="currentColor"`/`fill="currentColor"` paths pick up the
// surrounding element's CSS `color`. A plain `<img :src="...">` cannot do
// this - external SVG documents don't inherit page CSS. Mirrors the role of
// mygoal-webapp-ui's `src/components/atoms/Icon.vue`.
//
// Usage:
//   import closeIcon from '@/assets/svg/icons/xclose.svg?raw'
//   <BaseIcon :svg="closeIcon" size="small" />
withDefaults(
  defineProps<{
    svg: string
    size?: 'xsmall' | 'small' | 'medium' | 'large'
  }>(),
  {
    size: 'medium',
  },
)

defineOptions({ name: 'BaseIcon' })
</script>

<template>
  <span class="base-icon" :class="`base-icon--${size}`" aria-hidden="true" v-html="svg" />
</template>

<style scoped lang="scss">
.base-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;

  :deep(svg) {
    width: 100%;
    height: 100%;
    display: block;
  }
}

.base-icon--xsmall {
  width: 12px;
  height: 12px;
}

.base-icon--small {
  width: 16px;
  height: 16px;
}

.base-icon--medium {
  width: 20px;
  height: 20px;
}

.base-icon--large {
  width: 28px;
  height: 28px;
}
</style>
