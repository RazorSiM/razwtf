<script setup lang="ts">
import { useLightboxStore } from '@/stores/lightbox'
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

const lightboxStore = useLightboxStore()
</script>

<template>
  <div>
    <NuxtImg class="cursor-pointer" :src="src" :alt="alt" :format="format" quality="80" :fit="fit" @click="lightboxStore.setLightbox({ show: true, src })" />
    <!-- <LightBox :show="show" :show-close="true" :image="src" @close="show = false" /> -->
  </div>
</template>
