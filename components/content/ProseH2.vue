<script lang="ts" setup>
defineProps<{ id: string }>()
</script>

<template>
  <h2 :id="id" class="mb-8 mt-12 block text-4xl font-bold leading-tight tracking-tight text-subtext-0">
    <NuxtLink :href="`#${id}`" class="group">
      <slot />
      <div class="i-fluent-emoji-link ml-7 inline-block text-2xl opacity-0 transition group-hover:opacity-100" />
    </NuxtLink>
  </h2>
</template>
