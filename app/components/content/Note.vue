<script lang="ts" setup>
defineProps<{ title?: string }>()
</script>

<template>
  <Callout type="note" :title="title">
    <slot />
  </Callout>
</template>
