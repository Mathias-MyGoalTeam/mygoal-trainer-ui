<script setup lang="ts">
// Presentation-only base atom adapted from mygoal-webapp-ui's AppButton.vue.
// No business logic: consumers own click handling via the `click` event.
withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'text' | 'accent'
    size?: 'small' | 'medium' | 'large'
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'primary',
    size: 'medium',
    type: 'button',
    disabled: false,
  },
)

const emit = defineEmits<{
  click: [event: MouseEvent]
}>()

const onClick = (event: MouseEvent) => {
  emit('click', event)
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="base-button"
    :class="[`base-button--${variant}`, `base-button--${size}`]"
    @click="onClick"
  >
    <slot />
  </button>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-button {
  @include typo('body', $font-family-base, $font-weight-semibold);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: $space-8;
  border: none;
  border-radius: $radius-md;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  box-sizing: border-box;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  // Sizes
  &--small {
    @include padding($space-8 $space-12);
    @include typo('small', $font-family-base, $font-weight-semibold);
    height: 32px;
  }

  &--medium {
    @include padding($space-12 $space-16);
    height: 44px;
  }

  &--large {
    @include padding($space-16 $space-24);
    height: 56px;
  }

  // Variants
  &--primary {
    background-color: $color-orange-500;
    color: $color-neutral-0;

    &:hover:not(:disabled) {
      background-color: $color-orange-600;
    }

    &:active:not(:disabled) {
      background-color: $color-orange-700;
    }
  }

  &--secondary {
    background-color: $color-neutral-100;
    color: $color-neutral-900;

    &:hover:not(:disabled) {
      background-color: $color-neutral-200;
    }

    &:active:not(:disabled) {
      background-color: $color-neutral-300;
    }
  }

  &--text {
    background-color: transparent;
    color: $color-neutral-700;
    padding-left: 0;
    padding-right: 0;

    &:hover:not(:disabled) {
      color: $color-orange-500;
    }

    &:active:not(:disabled) {
      color: $color-orange-900;
    }
  }

  &--accent {
    background-color: $color-yellow-500;
    color: $color-neutral-900;

    &:hover:not(:disabled) {
      background-color: $color-yellow-400;
    }

    &:active:not(:disabled) {
      background-color: $color-yellow-600;
    }
  }
}
</style>
