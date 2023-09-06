<script lang="ts" setup>
defineProps<{ id: string }>()
</script>

<template>
  <h1 :id="id" class="my-8 block text-5xl font-bold leading-tight tracking-tight text-subtext-0">
    <NuxtLink :href="`#${id}`" class="group">
      <slot />
      <div class="i-fluent-emoji-link ml-7 inline-block text-3xl opacity-0 transition group-hover:opacity-100" />
    </NuxtLink>
  </h1>
</template>
