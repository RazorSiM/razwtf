<script setup lang="ts">
defineProps<{ id: string }>()
</script>

<template>
  <h3 :id="id">
    <a :href="`#${id}`">
      <slot />
    </a>
  </h3>
</template>
