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
  <div :class="`highlight-${language}`" class="my-5 overflow-x-scroll rounded-xl bg-[#282936] p-4 scrollbar-thumb-color-flamingo scrollbar-track-color-base scrollbar-h-1 scrollbar-w-1 scrollbar scrollbar-rounded" @mouseenter="hovered = true" @mouseleave="hovered = false">
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
