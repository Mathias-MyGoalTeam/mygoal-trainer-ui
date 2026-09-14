<script setup lang="ts">
// Navigation trail for deeper page hierarchies (e.g. Athletes > Lena
// Hoffmann > Trainingsplan). The last item is rendered as plain text
// (current page, not a link); all others are RouterLinks.
//
// Usage:
//   <BaseBreadcrumb
//     :items="[
//       { label: 'Athleten', to: { name: 'athletes' } },
//       { label: 'Lena Hoffmann', to: { name: 'athlete-detail', params: { id: '1' } } },
//       { label: 'Trainingsplan' },
//     ]"
//   />
import type { RouteLocationRaw } from 'vue-router'

import chevronRightIcon from '@/assets/svg/icons/chevron-right.svg?raw'
import BaseIcon from '@/components/BaseIcon.vue'

export interface BreadcrumbItem {
  label: string
  to?: RouteLocationRaw
}

defineProps<{
  items: BreadcrumbItem[]
}>()

defineOptions({ name: 'BaseBreadcrumb' })
</script>

<template>
  <nav class="base-breadcrumb" aria-label="Breadcrumb">
    <ol class="base-breadcrumb__list">
      <li v-for="(item, index) in items" :key="`${item.label}-${index}`" class="base-breadcrumb__item">
        <RouterLink v-if="item.to && index < items.length - 1" :to="item.to" class="base-breadcrumb__link">
          {{ item.label }}
        </RouterLink>
        <span v-else class="base-breadcrumb__current" aria-current="page">{{ item.label }}</span>

        <BaseIcon
          v-if="index < items.length - 1"
          class="base-breadcrumb__separator"
          :svg="chevronRightIcon"
          size="small"
        />
      </li>
    </ol>
  </nav>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-breadcrumb__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.base-breadcrumb__item {
  display: flex;
  align-items: center;
  gap: $space-8;
}

.base-breadcrumb__link {
  @include typo('small', $font-family-base, $font-weight-semibold);
  color: $color-neutral-500;
  text-decoration: none;

  &:hover {
    color: $color-orange-600;
  }
}

.base-breadcrumb__current {
  @include typo('small', $font-family-base, $font-weight-semibold);
  color: $color-neutral-900;
}

.base-breadcrumb__separator {
  color: $color-neutral-300;
}
</style>
