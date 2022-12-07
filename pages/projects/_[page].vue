<script lang="ts" setup>
definePageMeta({
  layout: 'no-prose',
})
const route = useRoute()
const elementsPerPage = 4
const currentPage = parseInt(route.params.page as string) || 1
const projects = await queryContent('projects').limit(elementsPerPage).skip(elementsPerPage * (currentPage - 1)).sort({ date: -1 }).find()
const nextProjects = await queryContent('projects').limit(1).skip(elementsPerPage * (currentPage)).sort({ date: -1 }).find()
const previousPage = currentPage > 1 ? `/projects/_${currentPage - 1}` : null
const nextPage = nextProjects.length === 1 ? `/projects/_${currentPage + 1}` : null
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <ContentCard v-for="project in projects" :key="project._path" :title="project.title ?? ''" :image="project.hero" :excerpt="project.excerpt ?? ''" :url="project._path ?? ''" :date="project.date" :timetoread="project.readingTime.text" />
    </div>
    <Pagination :previous-page="previousPage" :next-page="nextPage" class="mt-10 justify-center" />
  </div>
</template>
