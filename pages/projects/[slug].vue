<script lang="ts" setup>
import { formatDate } from '@/helpers/dateFormat'
const { page, next, prev } = useContent()
definePageMeta({
  layout: 'no-prose',
})
useContentHead(page)
</script>

<template>
  <NuxtImg
    v-if="page.hero" :src="page.hero" quality="80" :width="1000" :height="600" :alt="page.title" class="
  w-auto mx-auto rounded-3xl shadow-3xl max-h-2xl"
  />
  <div class="flex flex-col items-center justify-center mt-10">
    <p class="text-primary">
      {{ formatDate(page.date) }}
    </p>
    <p class="text-tertiary">
      {{ page.readingTime.text }}
    </p>
  </div>
  <ContentRenderer
    :key="page._id" :value="page" class="prose mx-auto text-base md:text-xl"
  />
  <div v-if="page.gallery && page.gallery.length > 0">
    <template v-for="image in page.gallery" :key="image.name">
      <div class="prose text-base md:text-xl mx-auto">
        <h3>
          {{ image.description }}
        </h3>
      </div>

      <ImagesGallery v-if="(image.images.length > 1)" :images="image.images" />
      <ImgLightbox v-else-if="(image.images.length === 1)" :src="image.images[0].src" class="mx-auto" :width="700" :height="500" />
    </template>
  </div>
  <Pagination :previous-page="prev?._path ?? null" :previous-title="prev?.title ?? null" :next-page="next?._path ?? null" :next-title="next?.title ?? null" class="mt-10 justify-center" />
</template>
