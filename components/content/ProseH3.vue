<script lang="ts" setup>
defineProps<{ id: string }>()
</script>

<template>
  <h3 :id="id" class="mb-8 mt-12 block text-3xl text-subtext-0 font-bold leading-tight tracking-tight">
    <NuxtLink :href="`#${id}`" class="group">
      <slot />
      <div class="i-fluent-emoji-link ml-7 inline-block text-xl opacity-0 transition group-hover:opacity-100" />
    </NuxtLink>
  </h3>
</template>
