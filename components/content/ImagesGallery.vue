<script lang="ts" setup>
import type { ImageProps } from '@/types'
interface Images {
  images: ImageProps[]
}
defineProps<Images>()
</script>

<template>
  <div v-if="images" class="grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-3 justify-center">
    <ImgLightbox v-for="image in images" :key="image.src" v-bind="image" />
  </div>
</template>
