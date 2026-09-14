<script setup lang="ts">
// "Are you sure?" confirmation pattern built directly on BaseModal - for
// destructive/important actions (delete athlete, cancel a plan, ...).
// Purely presentational: it emits `confirm`/`cancel`, the caller decides
// what actually happens (e.g. calling a repository through the Data-Hub).
//
// Usage:
//   <BaseConfirmDialog
//     v-model="isConfirmOpen"
//     title="Athlet entfernen?"
//     message="Diese Aktion kann nicht rückgängig gemacht werden."
//     variant="danger"
//     @confirm="removeAthlete"
//   />
import { useGettext } from 'vue3-gettext'

import questionMarkIcon from '@/assets/svg/icons/questionMark.svg?raw'
import warningIcon from '@/assets/svg/icons/warning.svg?raw'
import BaseButton from '@/components/BaseButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import BaseModal from '@/components/BaseModal.vue'

withDefaults(
  defineProps<{
    modelValue: boolean
    title: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'default' | 'danger'
  }>(),
  {
    message: undefined,
    confirmLabel: undefined,
    cancelLabel: undefined,
    variant: 'default',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  confirm: []
  cancel: []
}>()

defineOptions({ name: 'BaseConfirmDialog' })

const { $gettext } = useGettext()

function onCancel() {
  emit('update:modelValue', false)
  emit('cancel')
}

function onConfirm() {
  emit('update:modelValue', false)
  emit('confirm')
}
</script>

<template>
  <BaseModal
    :model-value="modelValue"
    :title="title"
    size="small"
    @update:model-value="(value) => emit('update:modelValue', value)"
    @close="onCancel"
  >
    <div class="base-confirm-dialog__icon" :class="`base-confirm-dialog__icon--${variant}`">
      <BaseIcon :svg="variant === 'danger' ? warningIcon : questionMarkIcon" size="large" />
    </div>

    <p v-if="message" class="base-confirm-dialog__message">{{ message }}</p>

    <template #footer>
      <BaseButton variant="secondary" @click="onCancel">
        {{ cancelLabel ?? $gettext('Abbrechen') }}
      </BaseButton>
      <BaseButton
        :class="{ 'base-confirm-dialog__confirm--danger': variant === 'danger' }"
        @click="onConfirm"
      >
        {{ confirmLabel ?? $gettext('Bestätigen') }}
      </BaseButton>
    </template>
  </BaseModal>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-confirm-dialog__message {
  @include typo('body', $font-family-base, $font-weight-regular);
  margin: 0;
  color: $color-neutral-700;
}

.base-confirm-dialog__icon {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: $space-16;
}

.base-confirm-dialog__icon--default {
  color: $color-orange-900;
}

.base-confirm-dialog__icon--danger {
  color: $color-red-500;
}

// Recolors the (otherwise "primary" orange) confirm button for destructive
// actions, using the shared severe-alert red token - no new one-off color.
.base-confirm-dialog__confirm--danger {
  background-color: $color-red-500 !important;

  &:hover {
    filter: brightness(90%);
  }
}
</style>
