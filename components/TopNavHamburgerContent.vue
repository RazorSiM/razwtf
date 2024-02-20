<script lang="ts" setup>
interface NavItem {
  title: string
  _path: string
  _id?: string
  _draft?: boolean
  children?: NavItem[]

  [key: string]: any
}
interface Props {
  pages: NavItem[] | null
}
defineProps<Props>()
</script>

<template>
  <div>
    <template v-for="page in pages" :key="page._path">
      <NuxtLink :to="page._path" class="mt-1 block rounded-md px-3 py-2 text-text font-medium transition duration-150 ease-in-out hover:bg-surface-0 focus:outline-none">
        {{ page.title }}
      </NuxtLink>
    </template>
  </div>
</template>
