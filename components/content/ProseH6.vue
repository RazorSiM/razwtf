<script lang="ts" setup>
defineProps<{ id: string }>()
</script>

<template>
  <h6 :id="id" class="mb-8 mt-12 block text-lg font-bold leading-tight tracking-tight text-subtext-0">
    <NuxtLink :href="`#${id}`" class="group">
      <slot />
      <div class="i-fluent-emoji-link ml-7 inline-block text-text opacity-0 transition group-hover:opacity-100" />
    </NuxtLink>
  </h6>
</template>
