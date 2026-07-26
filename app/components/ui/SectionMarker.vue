<script setup lang="ts">
defineProps<{
  n?: string
  label: string
  note?: string
}>()
</script>

<template>
  <div class="secmark">
    <span v-if="n" class="secmark-n">{{ n }}</span>
    <span class="secmark-label">{{ label }}</span>
    <span class="secmark-rule" aria-hidden="true" />
    <span v-if="note" class="secmark-note">{{ note }}</span>
  </div>
</template>
