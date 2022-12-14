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
  <NuxtLink :to="href" :blank="blank" :static="static" class="transition text-rosewater font-medium decoration-none border-b border-flamingo border-dashed pb-[2px] hover:(text-flamingo border-flamingo)">
    <slot />
  </NuxtLink>
</template>
