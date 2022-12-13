<script lang="ts" setup>
definePageMeta({
  layout: 'no-prose',
})
const elementsPerPage = 6
const currentPage = 1
const articles = await queryContent('blog').limit(elementsPerPage).skip(elementsPerPage * (currentPage - 1)).sort({ date: -1 }).find()
const nextArticles = await queryContent('blog').limit(1).skip(elementsPerPage * (currentPage)).sort({ date: -1 }).find()

const previousPage = currentPage > 1 ? `/blog/_${currentPage - 1}` : null
const nextPage = nextArticles.length === 1 ? `/blog/_${currentPage + 1}` : null
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ContentCard v-for="article in articles" :key="article._path" :title="article.title ?? ''" :image="article.hero" :excerpt="article.excerpt ?? ''" :url="article._path ?? ''" :date="article.date" :timetoread="article.readingTime.text" />
    </div>
    <Pagination :previous-page="previousPage" :next-page="nextPage" class="mt-10 justify-center" />
  </div>
</template>
