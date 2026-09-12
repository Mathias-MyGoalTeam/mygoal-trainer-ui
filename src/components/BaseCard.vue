<script setup lang="ts">
// Presentation-only base atom adapted from mygoal-webapp-ui's
// AchievementCardWrapper.vue atom. Purely a styled container - no
// business logic, no data fetching.
withDefaults(
  defineProps<{
    padded?: boolean
    elevated?: boolean
  }>(),
  {
    padded: true,
    elevated: true,
  },
)
</script>

<template>
  <section class="base-card" :class="{ 'base-card--padded': padded, 'base-card--elevated': elevated }">
    <header v-if="$slots.header" class="base-card__header">
      <slot name="header" />
    </header>
    <div class="base-card__body">
      <slot />
    </div>
    <footer v-if="$slots.footer" class="base-card__footer">
      <slot name="footer" />
    </footer>
  </section>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;

.base-card {
  width: 100%;
  box-sizing: border-box;
  background: $color-neutral-0;
  border-radius: $radius-md;
  display: flex;
  flex-direction: column;
}

.base-card--padded {
  padding: $space-24;
}

.base-card--elevated {
  box-shadow: $shadow-card;
}

.base-card__header {
  margin-bottom: $space-16;
}

.base-card__footer {
  margin-top: $space-16;
}
</style>
