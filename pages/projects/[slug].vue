<script lang="ts" setup>
import { formatDate } from '@/helpers/dateFormat'
const { page, next, prev } = useContent()
definePageMeta({
  layout: 'default',
})
useContentHead(page)
</script>

<template>
  <NuxtImg
    v-if="page.hero" :src="page.hero" quality="80" :width="1000" :height="600" :alt="page.title" class="
   mx-auto rounded-3xl shadow-3xl w-full"
  />
  <div class="flex flex-col items-center justify-center mt-10">
    <p class="text-subtext-0">
      {{ formatDate(page.date) }}
    </p>
    <p class="text-subtext-1">
      {{ page.readingTime.text }}
    </p>
  </div>
  <ContentRenderer
    :key="page._id" :value="page" class="max-w-4xl text-xl mx-auto text-text bg-base rounded-xl shadow-3xl p-4 mt-10"
  />
  <div v-if="page.gallery && page.gallery.length > 0" class="mt-10 max-w-4xl mx-auto bg-base rounded-xl p-4 shadow-3xl">
    <h2 class="text-5xl font-bold mb-10">
      Gallery
    </h2>
    <template v-for="image in page.gallery" :key="image.name">
      <div class="text-text md:text-xl mx-auto">
        <h3 class="text-center mt-5 mb-2 font-bold text-3xl">
          {{ image.description }}
        </h3>
      </div>

      <ImagesGallery v-if="(image.images.length > 1)" :images="image.images" />
      <ImgLightbox v-else-if="(image.images.length === 1)" :src="image.images[0].src" class="mx-auto" :width="700" :height="500" />
    </template>
  </div>
  <Pagination :previous-page="prev?._path ?? null" :previous-title="prev?.title ?? null" :next-page="next?._path ?? null" :next-title="next?.title ?? null" class="mt-10 justify-center" />
</template>
