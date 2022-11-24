<script lang="ts" setup>
interface Link {
  name: string
  url: string
  icon: string
}
interface Props {
  socials: Link[]
}
defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-1">
    <SocialLink v-for="link in socials" :key="link.name" :name="link.name" :url="link.url" :icon="link.icon" />
  </div>
</template>
