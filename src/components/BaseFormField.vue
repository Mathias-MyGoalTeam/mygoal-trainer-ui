<script setup lang="ts">
// Label + input + error message wrapper for consistent form layout. The
// input control itself is provided via the default slot (BaseInput,
// BaseDatePicker, a future BaseSelect, ...) - this component only owns the
// label/error/hint chrome around it, it has no knowledge of the input's
// value or validation logic.
//
// Note: BaseInput already renders its own `label` internally. When wrapping
// BaseInput with BaseFormField, omit BaseInput's `label` prop and use
// BaseFormField's `label` instead, to avoid rendering two labels.
//
// Usage:
//   <BaseFormField label="E-Mail" :error="emailError" required>
//     <BaseInput v-model="email" type="email" />
//   </BaseFormField>
withDefaults(
  defineProps<{
    label: string
    error?: string
    hint?: string
    required?: boolean
  }>(),
  {
    error: undefined,
    hint: undefined,
    required: false,
  },
)

defineOptions({ name: 'BaseFormField' })
</script>

<template>
  <div class="base-form-field">
    <label class="base-form-field__label">
      {{ label }}
      <span v-if="required" class="base-form-field__required" aria-hidden="true">*</span>
    </label>

    <slot />

    <p v-if="error" class="base-form-field__message base-form-field__message--error" role="alert">
      {{ error }}
    </p>
    <p v-else-if="hint" class="base-form-field__message base-form-field__message--hint">
      {{ hint }}
    </p>
  </div>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-form-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: $space-8;
}

.base-form-field__label {
  @include typo('label', $font-family-base, $font-weight-semibold);
  color: $color-neutral-700;
}

.base-form-field__required {
  color: $color-red-500;
}

.base-form-field__message {
  @include typo('caption', $font-family-base, $font-weight-regular);
  margin: 0;
}

.base-form-field__message--error {
  color: $color-red-500;
}

.base-form-field__message--hint {
  color: $color-neutral-400;
}
</style>
