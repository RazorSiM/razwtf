<script lang="ts" setup>
defineProps<{ title?: string }>()
</script>

<template>
  <Callout type="tip" :title="title">
    <slot />
  </Callout>
</template>
