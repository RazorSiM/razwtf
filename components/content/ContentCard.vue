<script lang="ts" setup>
interface Props {
  title: string
  image?: string
  excerpt: string
  url: string
  date: string
  timeToRead?: string
}
const props = withDefaults(defineProps<Props>(), {
  image: undefined,
})
const formattedDate = computed(() => {
  const date = new Date(props.date)
  return formatDate(date)
})
</script>

<template>
  <div
    class="project-card flex flex-col transform rounded-xl shadow-3xl transition-all duration-100 hover:z-50 hover:scale-105"
  >
    <NuxtLink :to="url" class="relative">
      <NuxtImg v-if="image" :alt="title" :src="image" class="h-[210px] w-full rounded-t-xl object-cover" :width="400" :height="210" quality="80" />
      <div v-else class="aspect-ratio-[400/300] bg-overlay-0" />
      <div
        class="project-card__img-container absolute top-0 h-full w-full flex-col items-center justify-center rounded-t-xl bg-overlay-1/30 bg-opacity-0 backdrop-blur hidden"
      >
        <div class="i-fluent-emoji-link text-3xl" />
      </div>
    </NuxtLink>
    <div class="flex flex-1 flex-col justify-between rounded-b-xl bg-base p-3">
      <h3 class="text-xl text-sky font-bold">
        {{ title }}
      </h3>
      <div class="flex gap-3 text-xs">
        <span class="text-lavender">{{ formattedDate }} </span>
        <span v-if="timeToRead" class="text-subtext-0">{{ timeToRead ?? '' }}</span>
      </div>
      <p class="mt-2 text-text">
        {{ excerpt }}
      </p>
      <NuxtLink
        class="mt-4 block rounded bg-surface-1 p-2 text-center font-bold shadow-lg transition hover:bg-surface-2"
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
