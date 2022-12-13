<script lang="ts" setup>
import { formatDate } from '@/helpers/dateFormat'
interface Props {
  title: string
  image: string
  excerpt: string
  url: string
  date: string
  timetoread: string
}
defineProps<Props>()
const formattedDate = computed(() => {
  return formatDate('MMMM D, YYYY')
})
</script>

<template>
  <div
    class="flex flex-col transition-all duration-100 transform rounded-xl shadow-3xl hover:scale-105 hover:z-50 project-card "
  >
    <NuxtLink :to="url" class="relative">
      <NuxtImg v-if="image" :alt="title" :src="image" class="rounded-t-xl" />
      <div v-else class="aspect-ratio-[400/300]" />
      <div
        class="absolute top-0 flex-col items-center justify-center hidden w-full h-full bg-gray-900 bg-opacity-0 project-card__img-container rounded-t-xl"
      >
        <svg
          class="w-10 h-10"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
          />
        </svg>
      </div>
    </NuxtLink>
    <div class="flex flex-col justify-between flex-1 p-3">
      <h3 class="text-xl font-bold text-primary">
        {{ title }}
      </h3>
      <div class="text-xs flex gap-3">
        <span class="text-secondary">{{ formattedDate }} </span>
        <span class="text-tertiary">{{ timetoread }}</span>
      </div>
      <p class="mt-2">
        {{ excerpt }}
      </p>
      <NuxtLink
        class="block p-2 mt-4 font-bold text-center rounded shadow-lg bg-base1 hover:bg-base2 transition"
        :to="url"
      >
        Checkout this project!
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.project-card:hover {

}
.project-card:hover .project-card__img-container {
  --at-apply: flex bg-opacity-75
  }
</style>

