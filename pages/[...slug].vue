<script lang="ts" setup>
const { page, layout } = useContent()
</script>

<template>
  <NuxtLayout :name="layout || 'default'">
    <ContentRenderer v-if="page" :key="page._id" :value="page">
      <template #empty="{ value }">
        <DocumentDrivenEmpty :value="value" />
      </template>
    </ContentRenderer>
    <DocumentDrivenNotFound v-else />
  </NuxtLayout>
</template>
