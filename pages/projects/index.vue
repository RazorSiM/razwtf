<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})

const elementsPerPage = 6
const currentPage = 1

const { data: projects } = await useAsyncData('currentProjects', () => queryContent('projects').limit(elementsPerPage).skip(elementsPerPage * (currentPage - 1)).sort({ date: -1 }).find())

const { data: nextProjects } = await useAsyncData('nextProjects', () => queryContent('projects').limit(1).skip(elementsPerPage * (currentPage)).sort({ date: -1 }).find())

const previousPage = currentPage > 1 ? `/projects/_${currentPage - 1}` : null
const nextPage = nextProjects.value?.length === 1 ? `/projects/_${currentPage + 1}` : null
</script>

<template>
  <div class="mx-auto max-w-4xl">
    <ContentDoc>
      <template #not-found="{ value }">
        <DocumentDrivenEmpty :value="value" />
      </template>
    </ContentDoc>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <template v-for="project in projects">
        <ContentCard v-if="project._path !== '/projects'" :key="project._path" :title="project.title ?? ''" :image="project.hero" :excerpt="project.excerpt ?? ''" :url="project._path ?? ''" :date="project.date" :timetoread="project.readingTime.text" />
      </template>
    </div>
    <Pagination :previous-page="previousPage" :next-page="nextPage" class="mt-10 justify-center" />
  </div>
</template>
