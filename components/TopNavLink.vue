<script lang="ts" setup>
interface Props {
  link: string
  title: string
}
defineProps<Props>()
</script>

<template>
  <NuxtLink :to="link" class="px-3 py-2 text-sm font-medium leading-5 transition duration-150 ease-in-out rounded text-foreground focus:outline-none hover:bg-base03 hover:text-fmuted">
    {{ title }}
  </NuxtLink>
</template>
