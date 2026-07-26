<script setup lang="ts">
// Markdown `###` headings, cascaded (raz-bjp.1). See ProseH2 for rationale.
const props = defineProps<{ id?: string }>()

const { headings } = useRuntimeConfig().public.mdc as any
const generate = computed(() =>
  props.id && ((typeof headings?.anchorLinks === 'boolean' && headings.anchorLinks)
    || (typeof headings?.anchorLinks === 'object' && headings?.anchorLinks?.h3)))
</script>

<template>
  <KineticText :id="props.id" as="h3">
    <a v-if="generate" :href="`#${props.id}`"><slot /></a>
    <slot v-else />
  </KineticText>
</template>
