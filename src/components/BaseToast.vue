<script setup lang="ts">
// App-wide feedback messages (success/error/info/warning), stacked
// top-right. This component only renders the shared `useToast()` queue -
// mount it once near the app root (e.g. App.vue) and call `show(...)` from
// anywhere else in the app; see useToast.ts for the full pattern.
//
// Usage (once, near the app root):
//   <BaseToast />
//
// Usage (anywhere else, to trigger one):
//   const { show } = useToast()
//   show({ message: 'Video erfolgreich hochgeladen.', variant: 'success' })
import { useGettext } from 'vue3-gettext'

import successIcon from '@/assets/svg/icons/success.svg?raw'
import warningIcon from '@/assets/svg/icons/warning.svg?raw'
import xcloseIcon from '@/assets/svg/icons/xclose.svg?raw'
import BaseIcon from '@/components/BaseIcon.vue'
import { useToast, type ToastVariant } from '@/composables/useToast'

defineOptions({ name: 'BaseToast' })

const { $gettext } = useGettext()
const { toasts, dismiss } = useToast()

// mygoal-webapp-ui's AppNotification only has a warning/success icon pair
// (see src/components/organisms/AppNotification.vue) - reused here 1:1 so
// "warning"/"error" both read as an alert, matching that app's pattern.
const icons: Record<ToastVariant, string> = {
  success: successIcon,
  error: warningIcon,
  warning: warningIcon,
  info: warningIcon,
}
</script>

<template>
  <Teleport to="body">
    <div class="base-toast-stack">
      <TransitionGroup name="base-toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="base-toast"
          :class="`base-toast--${toast.variant}`"
          role="status"
        >
          <BaseIcon class="base-toast__icon" :svg="icons[toast.variant]" />
          <p class="base-toast__message">{{ toast.message }}</p>
          <button
            type="button"
            class="base-toast__close"
            :aria-label="$gettext('Schließen')"
            @click="dismiss(toast.id)"
          >
            <BaseIcon :svg="xcloseIcon" size="small" />
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.base-toast-stack {
  position: fixed;
  top: $space-20;
  right: $space-20;
  z-index: $z-toast;
  display: flex;
  flex-direction: column;
  gap: $space-12;
  width: 320px;
}

.base-toast {
  display: flex;
  align-items: flex-start;
  gap: $space-12;
  background: $color-neutral-0;
  border-radius: $radius-sm;
  box-shadow: $shadow-elevated;
  padding: $space-16;
  border-left: 4px solid $color-neutral-300;
}

.base-toast--success {
  border-left-color: $color-lime-600;
}

.base-toast--error {
  border-left-color: $color-red-500;
}

.base-toast--warning {
  border-left-color: $color-orange-600;
}

.base-toast--info {
  border-left-color: $color-blue-500;
}

.base-toast__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.base-toast--success .base-toast__icon {
  color: $color-lime-700;
}

.base-toast--error .base-toast__icon,
.base-toast--warning .base-toast__icon {
  color: $color-orange-900;
}

.base-toast--info .base-toast__icon {
  color: $color-blue-500;
}

.base-toast__message {
  @include typo('small', $font-family-base, $font-weight-regular);
  margin: 0;
  flex: 1;
  color: $color-neutral-900;
}

.base-toast__close {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  padding: 0;
  color: $color-neutral-400;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: $color-neutral-900;
  }
}

.base-toast-move,
.base-toast-enter-active,
.base-toast-leave-active {
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.base-toast-enter-from,
.base-toast-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

.base-toast-leave-active {
  position: absolute;
}
</style>
