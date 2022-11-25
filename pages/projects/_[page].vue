<script lang="ts" setup>
const route = useRoute()
const elementsPerPage = 4
const currentPage = parseInt(route.params.page as string) || 1
const projects = await queryContent('projects').limit(elementsPerPage).skip(elementsPerPage * (currentPage - 1)).sort({ date: -1 }).find()
const nextProjects = await queryContent('projects').limit(1).skip(elementsPerPage * (currentPage)).sort({ date: -1 }).find()
const previousPage = currentPage > 1 ? `/projects/_${currentPage - 1}` : null
const nextPage = nextProjects.length === 1 ? `/projects/_${currentPage + 1}` : null
</script>

<template>
  <ul>
    <li v-for="project in projects" :key="project._path" class="text-xs">
      {{ project._path }}
    </li>
  </ul>
  <Pagination :previous-page="previousPage" :next-page="nextPage" />
</template>
