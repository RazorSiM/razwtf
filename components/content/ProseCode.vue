<script lang="ts" setup>
defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
})

const hovered = ref(false)
</script>

<template>
  <div :class="`highlight-${language}`" class="bg-[#282936] rounded-xl p-4 my-5" @mouseenter="hovered = true" @mouseleave="hovered = false">
    <span v-if="filename" class="filename">
      {{ filename }}
    </span>
    <slot />
  </div>
</template>

<style>
pre code .line {
  display: block;
  min-height: 1rem;
}
</style>
