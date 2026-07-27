<script setup lang="ts">
// Markdown `###` headings, cascaded (raz-bjp.1). See ProseH2 for rationale.
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
    || (typeof headings?.anchorLinks === 'object' && headings.anchorLinks?.h3)))
</script>

<template>
  <KineticText :id="props.id" as="h3">
    <a v-if="generate" :href="`#${props.id}`"><slot /></a>
    <slot v-else />
  </KineticText>
</template>
