<script setup lang="ts">
import { useRouter, type RouterLinkProps } from 'vue-router'

type NavigableCardTag = 'article' | 'div' | 'section' | 'tr'

const props = withDefaults(
  defineProps<{
    /** The route location to navigate to when the content is activated. */
    to: RouterLinkProps['to']
    /** Use `tr` when the wrapped content is a table row. */
    tag?: NavigableCardTag
  }>(),
  {
    tag: 'div',
  },
)

defineOptions({ name: 'NavigableCard' })

const router = useRouter()

function navigate() {
  return router.push(props.to)
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key !== 'Enter' && event.key !== ' ') {
    return
  }

  event.preventDefault()
  void navigate()
}
</script>

<template>
  <component
    :is="tag"
    class="navigable-card"
    role="link"
    tabindex="0"
    @click="navigate"
    @keydown="handleKeydown"
  >
    <slot />
  </component>
</template>

<style scoped lang="scss">
@use '../assets/scss/variables' as *;

.navigable-card {
  cursor: pointer;
  transition: background-color 0.15s ease, box-shadow 0.15s ease;
}

.navigable-card:hover {
  background-color: $color-neutral-50;
  box-shadow: $shadow-card;
}

.navigable-card:focus-visible {
  outline: 3px solid $color-blue-300;
  outline-offset: 2px;
}
</style>
