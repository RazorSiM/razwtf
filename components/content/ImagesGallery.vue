<script lang="ts" setup>
import type { ImageProps } from '@/types'

interface Images {
  images: ImageProps[]
  height?: number
  width?: number
}
withDefaults(defineProps<Images>(), {
  height: 500,
  width: 700,
})
</script>

<template>
  <div v-if="images" class="grid grid-cols-1 justify-center gap-1 sm:grid-cols-2" :class="(images.length === 2) ? 'lg:grid-cols-2' : 'lg:grid-cols-3'">
    <ImgLightbox v-for="image in images" :key="image.src" class="h-full w-auto" v-bind="image" :height="height" :width="width" />
  </div>
</template>
