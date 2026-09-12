<script setup lang="ts">
// App-wide navigation shell: a persistent top bar with a hamburger toggle
// that opens a slide-in side drawer. Lives in App.vue so it's present on
// every route. Presentation + local UI state only - no data fetching.
//
// Desktop-first: this is a full-width top bar + overlay drawer meant for
// desktop/laptop viewports. It is not a mobile nav pattern adaptation - see
// docs/design-principles.md.
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useGettext } from 'vue3-gettext'

interface NavLink {
  to: { name: string }
  label: string
}

const { $gettext } = useGettext()

// Add more entries here as real routes are introduced.
const navLinks = computed<NavLink[]>(() => [{ to: { name: 'dashboard' }, label: $gettext('Dashboard') }])

const isOpen = ref(false)
const route = useRoute()

const toggleLabel = computed(() => (isOpen.value ? $gettext('Menü schließen') : $gettext('Menü öffnen')))

function close() {
  isOpen.value = false
}

function toggle() {
  isOpen.value = !isOpen.value
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    close()
  }
}

// Listen globally (not just while focus is inside the drawer) so Escape
// closes it regardless of where focus currently is.
watch(isOpen, (open) => {
  if (open) {
    window.addEventListener('keydown', onKeydown)
  } else {
    window.removeEventListener('keydown', onKeydown)
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeydown)
})

// Close the drawer automatically after navigating to a new route.
watch(
  () => route.fullPath,
  () => close(),
)
</script>

<template>
  <header class="app-header">
    <button
      type="button"
      class="app-header__toggle"
      :class="{ 'app-header__toggle--open': isOpen }"
      :aria-label="toggleLabel"
      aria-controls="app-nav-drawer"
      :aria-expanded="isOpen"
      @click="toggle"
    >
      <span class="app-header__bar" />
      <span class="app-header__bar" />
      <span class="app-header__bar" />
    </button>

    <span class="app-header__brand">MyGoal Trainer</span>
  </header>

  <Transition name="app-nav-backdrop">
    <div v-if="isOpen" class="app-nav-backdrop" @click="close" />
  </Transition>

  <Transition name="app-nav-drawer">
    <nav
      v-if="isOpen"
      id="app-nav-drawer"
      class="app-nav-drawer"
      :aria-label="$gettext('Hauptnavigation')"
    >
      <div class="app-nav-drawer__header">
        <span class="app-nav-drawer__brand">MyGoal Trainer</span>
        <button type="button" class="app-nav-drawer__close" :aria-label="$gettext('Menü schließen')" @click="close">
          &times;
        </button>
      </div>

      <ul class="app-nav-drawer__list">
        <li v-for="link in navLinks" :key="link.label">
          <RouterLink :to="link.to" class="app-nav-drawer__link" @click="close">
            {{ link.label }}
          </RouterLink>
        </li>
      </ul>
    </nav>
  </Transition>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;
@use '../assets/scss/mixins' as *;

.app-header {
  display: flex;
  align-items: center;
  gap: $space-16;
  padding: $space-16 $space-24;
  background: $color-neutral-0;
  box-shadow: $shadow-card;
}

.app-header__toggle {
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: $radius-xs;
  background: transparent;
  cursor: pointer;
  padding: 0;

  &:hover {
    background: $color-neutral-50;
  }
}

.app-header__bar {
  display: block;
  width: 20px;
  height: 2px;
  border-radius: $radius-xxs;
  background: $color-neutral-900;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.app-header__toggle--open {
  .app-header__bar:nth-child(1) {
    transform: translateY(7px) rotate(45deg);
  }

  .app-header__bar:nth-child(2) {
    opacity: 0;
  }

  .app-header__bar:nth-child(3) {
    transform: translateY(-7px) rotate(-45deg);
  }
}

.app-header__brand {
  @include typo('h2', $font-family-base, $font-weight-bold);
  color: $color-neutral-900;
}

.app-nav-backdrop {
  position: fixed;
  inset: 0;
  background: rgba($color-neutral-900, 0.4);
  z-index: $z-drawer-backdrop;
}

.app-nav-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 320px;
  background: $color-neutral-0;
  box-shadow: $shadow-elevated;
  z-index: $z-drawer;
  display: flex;
  flex-direction: column;
}

.app-nav-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: $space-16 $space-24;
  border-bottom: 1px solid $color-neutral-100;
}

.app-nav-drawer__brand {
  @include typo('h2', $font-family-base, $font-weight-bold);
  color: $color-neutral-900;
}

.app-nav-drawer__close {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 24px;
  line-height: 1;
  color: $color-neutral-700;
  padding: $space-4;

  &:hover {
    color: $color-neutral-900;
  }
}

.app-nav-drawer__list {
  list-style: none;
  margin: 0;
  padding: $space-16 0;
  display: flex;
  flex-direction: column;
}

.app-nav-drawer__link {
  @include typo('body', $font-family-base, $font-weight-semibold);
  display: block;
  padding: $space-12 $space-24;
  color: $color-neutral-700;
  text-decoration: none;

  &:hover {
    background: $color-neutral-50;
    color: $color-neutral-900;
  }

  &.router-link-active {
    color: $color-orange-600;
    background: $color-orange-50;
  }
}

// Drawer + backdrop transitions
.app-nav-drawer-enter-active,
.app-nav-drawer-leave-active {
  transition: transform 0.2s ease;
}

.app-nav-drawer-enter-from,
.app-nav-drawer-leave-to {
  transform: translateX(-100%);
}

.app-nav-backdrop-enter-active,
.app-nav-backdrop-leave-active {
  transition: opacity 0.2s ease;
}

.app-nav-backdrop-enter-from,
.app-nav-backdrop-leave-to {
  opacity: 0;
}
</style>
