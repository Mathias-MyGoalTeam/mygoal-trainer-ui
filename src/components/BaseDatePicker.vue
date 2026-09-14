<script setup lang="ts">
// Native date input styled to match BaseInput, for future
// scheduling/appointment forms (e.g. planning a training session).
// Deliberately not wrapping a third-party date-picker library - the native
// <input type="date"> is sufficient for this sprint's scope and keeps the
// bundle free of a new dependency; swap the implementation later if a
// custom calendar UI becomes necessary.
//
// Usage:
//   <BaseDatePicker v-model="sessionDate" label="Datum" />
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    name?: string
    min?: string
    max?: string
    disabled?: boolean
  }>(),
  {
    label: undefined,
    name: undefined,
    min: undefined,
    max: undefined,
    disabled: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

defineOptions({ name: 'BaseDatePicker' })

const inputId = computed(() => props.name ?? `base-date-picker-${Math.random().toString(36).slice(2, 9)}`)

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value)
}
</script>

<template>
  <div class="base-date-picker">
    <label v-if="label" :for="inputId" class="base-date-picker__label">{{ label }}</label>
    <input
      :id="inputId"
      type="date"
      class="base-date-picker__field"
      :value="modelValue"
      :min="min"
      :max="max"
      :disabled="disabled"
      @input="onInput"
    />
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-date-picker {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-8;
}

.base-date-picker__label {
  @include typo('label', $font-family-base, $font-weight-light);
  color: inherit;
}

.base-date-picker__field {
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
