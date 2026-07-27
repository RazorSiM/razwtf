<script lang="ts" setup>
defineProps<{ title?: string }>()
</script>

<template>
  <Callout type="warning" :title>
    <slot />
  </Callout>
</template>
