<script lang="ts" setup>
defineProps<{ title?: string }>()
</script>

<template>
  <Callout type="info" :title>
    <slot />
  </Callout>
</template>
