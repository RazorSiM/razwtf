<script lang="ts" setup>
defineProps<{ emoji: string }>()
</script>

<template>
  <div :class="emoji" />
</template>
