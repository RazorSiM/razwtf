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
  <div class="hidden gap-3 sm:ml-6 sm:flex">
    <template v-for="page in pages" :key="page._path">
      <NuxtLink :to="page._path" class="rounded px-3 py-2 text-sm font-medium leading-5 text-subtext-0 transition duration-150 ease-in-out hover:bg-surface-0 hover:text-flamingo focus:outline-none">
        {{ page.title }}
      </NuxtLink>
    </template>
  </div>
</template>
