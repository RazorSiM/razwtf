<script lang="ts" setup>
interface Props {
  previousPage: string | null
  nextPage: string | null
}
defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-7 not-prose">
    <nuxt-link class="flex gap-2 items-center transition " :class="previousPage ? 'text-primary hover:text-secondary' : 'cursor-not-allowed text-foreground/30'" :to="previousPage ?? undefined">
      <div class="i-carbon-previous-outline" />  <span>Previous Page</span>
    </nuxt-link>

    <nuxt-link class="flex gap-2 items-center transition " :class="nextPage ? 'text-primary hover:text-secondary' : 'cursor-not-allowed text-foreground/30'" :to="nextPage ?? undefined">
      <span>Next Page</span> <div class="i-carbon-next-outline" />
    </nuxt-link>
  </div>
</template>
