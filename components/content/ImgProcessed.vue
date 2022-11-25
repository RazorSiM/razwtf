<script setup lang="ts">
defineProps({
  src: {
    type: String,
    default: '',
  },
  alt: {
    type: String,
    default: '',
  },
  format: {
    type: String,
    default: 'webp',
  },
  quality: {
    type: String,
    default: '80',
  },
  fit: {
    type: String,
    default: 'cover',
  },
})
</script>

<template>
  <!-- <img :src="src" :alt="alt" :width="width" :height="height"> -->
  <nuxt-img :src="src" :alt="alt" :format="format" quality="80" :fit="fit" />
</template>
