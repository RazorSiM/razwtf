<script lang="ts" setup>
interface Props {
  previousPage: string | null
  previousTitle?: string | null
  nextPage: string | null
  nextTitle?: string | null
}
withDefaults(defineProps<Props>(), {
  previousPage: null,
  previousTitle: 'Previous Page',
  nextPage: null,
  nextTitle: 'Next Page',
})
</script>

<template>
  <div class="flex items-center gap-7">
    <nuxt-link v-if="previousPage && previousTitle" class="flex items-center gap-2 transition" :class="previousPage ? 'text-teal hover:text-green' : 'cursor-not-allowed text-subtext-0/30'" :to="previousPage">
      <div class="i-carbon-previous-outline" /><span>{{ previousTitle ?? '' }}</span>
    </nuxt-link>

    <nuxt-link v-if="nextPage && nextTitle" class="flex items-center gap-2 transition" :class="nextPage ? 'text-teal hover:text-green' : 'cursor-not-allowed text-subtext-0/30'" :to="nextPage">
      <span>{{ nextTitle }}</span><div class="i-carbon-next-outline" />
    </nuxt-link>
  </div>
</template>
