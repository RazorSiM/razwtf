<script lang="ts" setup>
const { page } = useContent()

// Page not found, set correct status code on SSR
if (!page.value && process.server) {
  const event = useRequestEvent()
  event.res.statusCode = 404
}
</script>

<template>
  <div class="max-w-2xl mx-auto bg-base rounded-xl p-4">
    <ContentRenderer v-if="page" :key="page._id" :value="page">
      <template #empty="{ value }">
        <DocumentDrivenEmpty :value="value" />
      </template>
    </ContentRenderer>
    <DocumentDrivenNotFound v-else />
  </div>
</template>
