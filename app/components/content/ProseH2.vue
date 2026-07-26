<script setup lang="ts">
// Markdown `##` headings, cascaded (raz-bjp.1). Wraps the default MDC heading
// markup (id + optional anchor link) in KineticText so body headings get the
// same per-word cascade as page titles - scaled down by size so they stay calm
// in long-form reading. Preserves the heading anchor (KineticText keeps child
// <a> markup while splitting the text into words).
const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc as any
const generate = computed(() =>
  props.id && ((typeof headings?.anchorLinks === 'boolean' && headings.anchorLinks)
    || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h2)))
</script>

<template>
  <KineticText :id="props.id" as="h2">
    <a v-if="generate" :href="`#${props.id}`"><slot /></a>
    <slot v-else />
  </KineticText>
</template>
