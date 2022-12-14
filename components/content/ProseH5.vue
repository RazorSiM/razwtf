<script lang="ts" setup>
defineProps<{ id: string }>()
</script>

<template>
  <h5 :id="id" class="block mt-12 mb-8 text-xl leading-tight font-bold tracking-tight text-subtext-0">
    <NuxtLink :href="`#${id}`" class="group ">
      <slot />
      <div class="i-fluent-emoji-link opacity-0 group-hover:opacity-100 transition text-lg inline-block ml-7" />
    </NuxtLink>
  </h5>
</template>
