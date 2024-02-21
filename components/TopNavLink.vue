<script lang="ts" setup>
interface Props {
  link: string
  title: string
}
defineProps<Props>()
</script>

<template>
  <NuxtLink :to="link" class="rounded px-3 py-2 text-sm text-text font-medium leading-5 transition duration-150 ease-in-out hover:bg-surface-2 hover:text-subtext-1 focus:outline-none">
    {{ title }}
  </NuxtLink>
</template>
