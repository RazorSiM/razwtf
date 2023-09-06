<script setup lang="ts">
defineProps({
  href: {
    type: String,
    default: '',
  },
  blank: {
    type: Boolean,
    default: false,
  },
  /**
   * `true` if `href` points to a static file
   */
  static: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <NuxtLink :to="href" :blank="blank" :static="static" class="border-b border-flamingo border-dashed pb-[2px] font-medium text-rosewater decoration-none transition hover:(border-flamingo text-flamingo)">
    <slot />
  </NuxtLink>
</template>
