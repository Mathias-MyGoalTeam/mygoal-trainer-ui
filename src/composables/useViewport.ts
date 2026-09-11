import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

export function useViewport() {
  const width = ref(typeof window === 'undefined' ? 0 : window.innerWidth)

  const updateWidth = () => {
    width.value = window.innerWidth
  }

  onMounted(() => {
    updateWidth()
    window.addEventListener('resize', updateWidth)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', updateWidth)
  })

  const label = computed(() => (width.value < 768 ? 'mobile' : 'desktop'))

  return {
    width,
    label,
  }
}
