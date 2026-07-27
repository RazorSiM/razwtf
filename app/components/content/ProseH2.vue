<script setup lang="ts">
// Markdown `##` headings, cascaded (raz-bjp.1). Wraps the default MDC heading
// markup (id + optional anchor link) in KineticText so body headings get the
// same per-word cascade as page titles - scaled down by size so they stay calm
// in long-form reading. Preserves the heading anchor (KineticText keeps child
// <a> markup while splitting the text into words).
const props = defineProps<{ id?: string }>()

// The shape we actually read out of the MDC runtime config. Narrow on purpose:
// `as any` here hid the fact that anchorLinks is a boolean OR a per-level map.
interface MdcHeadingsConfig {
  headings?: {
    anchorLinks?: boolean | Record<string, boolean>
  }
}

const { headings } = useRuntimeConfig().public.mdc as MdcHeadingsConfig
const generate = computed(() =>
  props.id && ((typeof headings?.anchorLinks === 'boolean' && headings.anchorLinks)
    || (typeof headings?.anchorLinks === 'object' && headings.anchorLinks?.h2)))
</script>

<template>
  <KineticText :id="props.id" as="h2">
    <a v-if="generate" :href="`#${props.id}`"><slot /></a>
    <slot v-else />
  </KineticText>
</template>
