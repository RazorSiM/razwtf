<script setup lang="ts">
import { useLightboxStore } from '@/stores/lightbox'

withDefaults(defineProps<{
  src: string
  alt?: string
  format?: string
  quality?: string
  fit?: string
}>(), {
  alt: 'image',
  format: 'auto',
  quality: 'auto',
  fit: 'cover',
})

const lightboxStore = useLightboxStore()
</script>

<template>
  <NuxtImg class="cursor-pointer" :src="src" :alt="alt" :format="format" quality="80" :fit="fit" @click="lightboxStore.setLightbox({ show: true, src })" />
</template>
