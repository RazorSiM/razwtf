<script lang="ts" setup>
interface Props {
  name: string
  url: string
  icon: string
}
defineProps<Props>()
</script>

<template>
  <a :href="url" target="_blank" class="text-subtext-0 hover:text-sapphire">
    <div
      :title="name"
      :class="icon"
      class="h-8 w-8 transition"
    />
  </a>
</template>
