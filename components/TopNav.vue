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
  <div class="gap-3 hidden sm:ml-6 sm:flex">
    <template v-for="page in pages" :key="page._path">
      <NuxtLink :to="page._path" class="rounded px-3 py-2 text-sm text-subtext-0 font-medium leading-5 transition duration-150 ease-in-out hover:bg-surface-0 hover:text-flamingo focus:outline-none">
        {{ page.title }}
      </NuxtLink>
    </template>
  </div>
</template>
