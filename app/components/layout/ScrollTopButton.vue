<script lang="ts" setup>
// Fixed bottom-right "back to top" button. Hidden near the top of the page,
// fades/scales in once the reader has scrolled past the fold. `y` is 0 on the
// server and until the client measures scroll, so the button starts hidden on
// both - no hydration mismatch.
const { y } = useWindowScroll()
const visible = computed(() => y.value > 600)

const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)')

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion.value ? 'auto' : 'smooth' })
}
</script>

<template>
  <Transition
    enter-active-class="transition duration-300 ease-out"
    enter-from-class="opacity-0 scale-75"
    enter-to-class="opacity-100 scale-100"
    leave-active-class="transition duration-200 ease"
    leave-from-class="opacity-100 scale-100"
    leave-to-class="opacity-0 scale-75"
  >
    <IconButton
      v-if="visible"
      icon="i-carbon-arrow-up h-5 w-5"
      label="Scroll to top"
      shape="round"
      size="w-11 h-11"
      floating
      @click="scrollToTop"
    />
  </Transition>
</template>
