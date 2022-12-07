<script lang="ts" setup>
import { formatDate } from '@/helpers/dateFormat'
const { page, next, prev } = useContent()
definePageMeta({
  layout: 'no-prose',
})
</script>

<template>
  <NuxtImg
    v-if="page.hero" :src="page.hero" :alt="page.title" class="
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
  <Pagination :previous-page="prev._path" :previous-title="prev.title" :next-page="next._path" :next-title="next.title" class="mt-10 justify-center" />
</template>
