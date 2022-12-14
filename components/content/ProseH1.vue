<script lang="ts" setup>
defineProps<{ id: string }>()
</script>

<template>
  <h1 :id="id" class="block my-8 text-5xl leading-tight font-bold tracking-tight text-subtext-0">
    <NuxtLink :href="`#${id}`" class="group">
      <slot />
      <div class="i-fluent-emoji-link opacity-0 group-hover:opacity-100 transition text-3xl inline-block ml-7" />
    </NuxtLink>
  </h1>
</template>
