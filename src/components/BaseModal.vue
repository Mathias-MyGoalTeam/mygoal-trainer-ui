<script setup lang="ts">
// Generic overlay dialog - content is passed in via slots, this component
// only owns the overlay mechanics (teleport, backdrop, Escape/close
// handling, scroll lock, focus-to-first-element). Visual language (dimmed
// backdrop, rounded card, top-right close button) matches
// mygoal-webapp-ui's Popup.vue molecule.
//
// Usage:
//   <BaseModal v-model="isOpen" title="Athlet hinzufügen">
//     <p>Modal content goes here.</p>
//
//     <template #footer>
//       <BaseButton variant="secondary" @click="isOpen = false">Abbrechen</BaseButton>
//       <BaseButton @click="save">Speichern</BaseButton>
//     </template>
//   </BaseModal>
//
// BaseConfirmDialog.vue builds directly on top of this component - prefer
// it over BaseModal for a plain "are you sure?" confirmation.
import { nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useGettext } from 'vue3-gettext'

import closeIcon from '@/assets/svg/icons/xclose.svg?raw'
import BaseIcon from '@/components/BaseIcon.vue'

const props = withDefaults(
  defineProps<{
    modelValue: boolean
    title?: string
    closeOnBackdrop?: boolean
    persistent?: boolean
    size?: 'small' | 'medium' | 'large'
  }>(),
  {
    title: undefined,
    closeOnBackdrop: true,
    persistent: false,
    size: 'medium',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  close: []
  open: []
}>()

defineOptions({ name: 'BaseModal' })

const { $gettext } = useGettext()
const dialogRef = ref<HTMLElement>()
const contentId = `base-modal-content-${Math.random().toString(36).slice(2, 9)}`

function requestClose() {
  if (props.persistent) return
  emit('update:modelValue', false)
  emit('close')
}

function onBackdropClick() {
  if (props.closeOnBackdrop) {
    requestClose()
  }
}

function focusFirstElement() {
  const focusable = dialogRef.value?.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  )
  focusable?.[0]?.focus()
}

let scrollY = 0

function lockScroll() {
  scrollY = window.scrollY
  document.body.style.position = 'fixed'
  document.body.style.top = `-${scrollY}px`
  document.body.style.width = '100%'
}

function unlockScroll() {
  document.body.style.position = ''
  document.body.style.top = ''
  document.body.style.width = ''
  window.scrollTo(0, scrollY)
}

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen) {
      lockScroll()
      await nextTick()
      focusFirstElement()
      emit('open')
    } else {
      unlockScroll()
    }
  },
)

onBeforeUnmount(() => {
  if (props.modelValue) {
    unlockScroll()
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="base-modal-backdrop">
      <div
        v-if="modelValue"
        class="base-modal-backdrop"
        role="dialog"
        aria-modal="true"
        :aria-describedby="contentId"
        @click="onBackdropClick"
        @keydown.esc="requestClose"
      >
        <div ref="dialogRef" class="base-modal" :class="`base-modal--${size}`" @click.stop>
          <header class="base-modal__header">
            <h2 v-if="title" class="base-modal__title">{{ title }}</h2>
            <slot v-else name="header" />

            <button
              type="button"
              class="base-modal__close"
              :aria-label="$gettext('Schließen')"
              @click="requestClose"
            >
              <BaseIcon :svg="closeIcon" size="small" />
            </button>
          </header>

          <div :id="contentId" class="base-modal__content">
            <slot />
          </div>

          <footer v-if="$slots.footer" class="base-modal__footer">
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba($color-neutral-900, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: $z-modal-backdrop;
  padding: $space-20;
}

.base-modal {
  background: $color-neutral-0;
  border-radius: $radius-md;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  box-shadow: $shadow-elevated;
  z-index: $z-modal;
}

.base-modal--small {
  width: 400px;
}

.base-modal--medium {
  width: 560px;
}

.base-modal--large {
  width: 760px;
}

.base-modal__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $space-16;
  padding: $space-20 $space-20 0;
  flex-shrink: 0;
}

.base-modal__title {
  @include typo('h2', $font-family-base, $font-weight-semibold);
  margin: 0;
  color: $color-neutral-900;
}

.base-modal__close {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border: none;
  border-radius: $radius-xs;
  background: transparent;
  color: $color-neutral-500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: $color-neutral-50;
    color: $color-neutral-900;
  }
}

.base-modal__content {
  padding: $space-20;
  overflow-y: auto;
  color: $color-neutral-700;
}

.base-modal__footer {
  display: flex;
  justify-content: flex-end;
  gap: $space-12;
  padding: 0 $space-20 $space-20;
  flex-shrink: 0;
}

.base-modal-backdrop-enter-active,
.base-modal-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.base-modal-backdrop-enter-from,
.base-modal-backdrop-leave-to {
  opacity: 0;
}
</style>
