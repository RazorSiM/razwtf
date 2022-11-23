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
  <div class="hidden sm:flex sm:ml-6 gap-3">
    <template v-for="page in pages" :key="page._path">
      <NuxtLink :to="page._path" class="px-3 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out rounded text-foreground focus:outline-none hover:bg-base03 hover:text-fmuted">
        {{ page.title }}
      </NuxtLink>
    </template>
  </div>
</template>
