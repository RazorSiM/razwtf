<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <h2 :id="id">
    <a :href="`#${id}`">
      <slot />
    </a>
  </h2>
</template>
