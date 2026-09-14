<script setup lang="ts">
// Consistent page title + action buttons layout (e.g. "New", "Filter"),
// so individual pages don't each build their own header row. Optionally
// hosts a BaseBreadcrumb above the title via the `breadcrumb` slot.
//
// Usage:
//   <BasePageHeader title="Athleten">
//     <template #breadcrumb>
//       <BaseBreadcrumb :items="[{ label: 'Dashboard', to: { name: 'dashboard' } }, { label: 'Athleten' }]" />
//     </template>
//
//     <template #actions>
//       <BaseButton variant="secondary">Filter</BaseButton>
//       <BaseButton>Neuer Athlet</BaseButton>
//     </template>
//   </BasePageHeader>
withDefaults(
  defineProps<{
    title: string
    subtitle?: string
  }>(),
  {
    subtitle: undefined,
  },
)

defineOptions({ name: 'BasePageHeader' })
</script>

<template>
  <header class="base-page-header">
    <div v-if="$slots.breadcrumb" class="base-page-header__breadcrumb">
      <slot name="breadcrumb" />
    </div>

    <div class="base-page-header__row">
      <div class="base-page-header__heading">
        <h1 class="base-page-header__title">{{ title }}</h1>
        <p v-if="subtitle" class="base-page-header__subtitle">{{ subtitle }}</p>
      </div>

      <div v-if="$slots.actions" class="base-page-header__actions">
        <slot name="actions" />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-page-header__breadcrumb {
  margin-bottom: $space-12;
}

.base-page-header__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-24;
}

.base-page-header__heading {
  min-width: 0;
}

.base-page-header__title {
  @include typo('h1', $font-family-base, $font-weight-bold);
  margin: 0;
  color: $color-neutral-900;
}

.base-page-header__subtitle {
  @include typo('body', $font-family-base, $font-weight-regular);
  margin: $space-4 0 0;
  color: $color-neutral-500;
}

.base-page-header__actions {
  display: flex;
  align-items: center;
  gap: $space-12;
  flex-shrink: 0;
}
</style>
