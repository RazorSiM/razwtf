<script lang="ts" setup>
defineProps<{ id: string }>()
</script>

<template>
  <h2 :id="id" class="block mt-12 mb-8 text-4xl leading-tight font-bold tracking-tight text-subtext-0">
    <NuxtLink :href="`#${id}`" class="group">
      <slot />
      <div class="i-fluent-emoji-link opacity-0 group-hover:opacity-100 transition text-2xl inline-block ml-7" />
    </NuxtLink>
  </h2>
</template>
