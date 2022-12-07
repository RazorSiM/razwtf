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
  <div class="flex items-center gap-7 not-prose">
    <nuxt-link class="flex gap-2 items-center transition " :class="previousPage ? 'text-primary hover:text-secondary' : 'cursor-not-allowed text-foreground/30'" :to="previousPage ?? undefined">
      <div class="i-carbon-previous-outline" /><span>{{ previousTitle ?? '' }}</span>
    </nuxt-link>

    <nuxt-link class="flex gap-2 items-center transition " :class="nextPage ? 'text-primary hover:text-secondary' : 'cursor-not-allowed text-foreground/30'" :to="nextPage ?? undefined">
      <span>{{ nextTitle ?? '' }}</span><div class="i-carbon-next-outline" />
    </nuxt-link>
  </div>
</template>
