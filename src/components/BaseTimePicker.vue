<script setup lang="ts">
// Native time input styled to match BaseInput/BaseDatePicker, for future
// scheduling/appointment forms. See BaseDatePicker.vue for the rationale
// on using a native input instead of a custom picker library.
//
// Usage:
//   <BaseTimePicker v-model="sessionTime" label="Uhrzeit" />
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    name?: string
    disabled?: boolean
  }>(),
  {
    label: undefined,
    name: undefined,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineOptions({ name: 'BaseTimePicker' })

const inputId = computed(() => props.name ?? `base-time-picker-${Math.random().toString(36).slice(2, 9)}`)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="base-time-picker">
    <label v-if="label" :for="inputId" class="base-time-picker__label">{{ label }}</label>
    <input
      :id="inputId"
      type="time"
      class="base-time-picker__field"
      :value="modelValue"
      :disabled="disabled"
      @input="onInput"
    />
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-time-picker {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-8;
}

.base-time-picker__label {
  @include typo('label', $font-family-base, $font-weight-light);
  color: inherit;
}

.base-time-picker__field {
  width: 100%;
  @include padding($space-12 $space-16);
  @include typo('body', $font-family-base, $font-weight-regular);
  border-radius: $radius-sm;
  border: 1px solid $color-neutral-100;
  color: $color-neutral-900;
  background-color: $color-neutral-0;
  box-sizing: border-box;

  &:focus {
    outline: none;
    border-color: $color-blue-500;
  }

  &:disabled {
    background-color: $color-neutral-50;
    cursor: not-allowed;
  }
}
</style>
