<script lang="ts" setup>
import { formatDate } from '@/helpers/dateFormat'
interface Props {
  title: string
  image?: string
  excerpt: string
  url: string
  date: string
  timetoread: string
}
const props = withDefaults(defineProps<Props>(), {
  image: undefined,
})
// const props = defineProps<Props>()
const formattedDate = computed(() => {
  return formatDate(props.date)
})
</script>

<template>
  <div
    class="flex flex-col transition-all duration-100 transform rounded-xl shadow-3xl hover:scale-105 hover:z-50 project-card "
  >
    <NuxtLink :to="url" class="relative">
      <NuxtImg v-if="image" :alt="title" :src="image" class="rounded-t-xl w-full h-[210px] object-cover" :width="400" :height="210" quality="80" />
      <div v-else class="aspect-ratio-[400/300] bg-overlay-0" />
      <div
        class="absolute top-0 flex-col items-center justify-center hidden w-full h-full bg-overlay-1/30 backdrop-blur bg-opacity-0 project-card__img-container rounded-t-xl"
      >
        <div class="i-fluent-emoji-link text-3xl" />
      </div>
    </NuxtLink>
    <div class="flex flex-col justify-between flex-1 p-3 bg-base rounded-b-xl">
      <h3 class="text-xl font-bold text-sky">
        {{ title }}
      </h3>
      <div class="text-xs flex gap-3">
        <span class="text-lavender">{{ formattedDate }} </span>
        <span class="text-subtext-0">{{ timetoread }}</span>
      </div>
      <p class="mt-2 text-text">
        {{ excerpt }}
      </p>
      <NuxtLink
        class="block p-2 mt-4 font-bold text-center rounded shadow-lg bg-surface-1 hover:bg-surface-2 transition"
        :to="url"
      >
        <slot>
          Read more
        </slot>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.project-card:hover .project-card__img-container {
  --at-apply: flex bg-opacity-75
  }
</style>
