<script setup lang="ts">
import { useLightboxStore } from '@/stores/lightbox'

withDefaults(defineProps<{
  src: string
  alt?: string
  format?: string
  quality?: number
  fit?: string
  width?: number
  height?: number
}>(), {
  alt: 'image',
  format: 'auto',
  quality: 70,
  fit: 'cover',
  width: 400,
  height: 400,
})

const lightboxStore = useLightboxStore()
</script>

<template>
  <NuxtImg class="cursor-pointer" :src="src" :alt="alt" format="webp" :width="width" :height="height" :quality="quality" @click="lightboxStore.setLightbox({ show: true, src })" />
</template>
