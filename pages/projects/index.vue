<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})
const { page } = useContent()
const elementsPerPage = 6
const currentPage = 1
const projects = await queryContent('projects').limit(elementsPerPage).skip(elementsPerPage * (currentPage - 1)).sort({ date: -1 }).find()
const nextProjects = await queryContent('projects').limit(1).skip(elementsPerPage * (currentPage)).sort({ date: -1 }).find()

const previousPage = currentPage > 1 ? `/projects/_${currentPage - 1}` : null
const nextPage = nextProjects.length === 1 ? `/projects/_${currentPage + 1}` : null
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <ContentRenderer :key="page._id" :value="page" />
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <template v-for="project in projects">
        <ContentCard v-if="project._path !== '/projects'" :key="project._path" :title="project.title ?? ''" :image="project.hero" :excerpt="project.excerpt ?? ''" :url="project._path ?? ''" :date="project.date" :timetoread="project.readingTime.text" />
      </template>
    </div>
    <Pagination :previous-page="previousPage" :next-page="nextPage" class="mt-10 justify-center" />
  </div>
</template>
