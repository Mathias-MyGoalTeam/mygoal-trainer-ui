<script setup lang="ts">
// Presentation-only base atom adapted (simplified) from
// mygoal-webapp-ui's CustomInput.vue molecule. No validation/business
// logic beyond an optional character counter driven purely by props.
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue: string
    label?: string
    name?: string
    type?: 'text' | 'password' | 'email' | 'number' | 'date' | 'textarea'
    placeholder?: string
    disabled?: boolean
    max?: number
  }>(),
  {
    label: undefined,
    name: undefined,
    type: 'text',
    placeholder: undefined,
    disabled: false,
    max: undefined,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputId = computed(() => props.name ?? `base-input-${Math.random().toString(36).slice(2, 9)}`)

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="base-input">
    <label v-if="label" :for="inputId" class="base-input__label">{{ label }}</label>

    <textarea
      v-if="type === 'textarea'"
      :id="inputId"
      class="base-input__field"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="max"
      rows="3"
      @input="onInput"
    />
    <input
      v-else
      :id="inputId"
      class="base-input__field"
      :type="type"
      :value="modelValue"
      :disabled="disabled"
      :placeholder="placeholder"
      :maxlength="max"
      @input="onInput"
    />

    <span v-if="max" class="base-input__count">{{ modelValue.length }} / {{ max }}</span>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-input {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: $space-8;
}

.base-input__label {
  @include typo('label', $font-family-base, $font-weight-light);
  color: inherit;
}

.base-input__field {
  width: 100%;
  @include padding($space-12 $space-16);
  @include typo('body', $font-family-base, $font-weight-regular);
  border-radius: $radius-sm;
  border: 1px solid $color-neutral-100;
  color: $color-neutral-900;
  background-color: $color-neutral-0;
  box-sizing: border-box;
  resize: vertical;

  &::placeholder {
    color: $color-neutral-500;
  }

  &:focus {
    outline: none;
    border-color: $color-blue-500;
  }

  &:disabled {
    background-color: $color-neutral-50;
    cursor: not-allowed;
  }
}

.base-input__count {
  @include typo('caption', $font-family-base, $font-weight-regular);
  color: $color-neutral-300;
  align-self: flex-end;
}
</style>
