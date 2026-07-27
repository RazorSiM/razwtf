<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})

const route = useRoute()

// Resolve a standalone page (e.g. /about) from the `pages` collection.
// The dedicated /about route (about.vue) still takes precedence over this
// catch-all via Nuxt file-based routing.
const { data: page } = await useAsyncData(`page-${route.path}`, () =>
  queryCollection('pages').path(route.path).first())

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}
</script>

<template>
  <ProseDocument v-if="page" :value="page" />
</template>
