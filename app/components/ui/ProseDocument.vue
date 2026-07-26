<script setup lang="ts">
// Centred reading column for a rendered content document (about page Q&A,
// project case-study write-ups). Lifts the shared `.read > .prose` pattern from
// about.vue / projects/[slug].vue: the wrapper owns the measure + gutter, and
// the inner `.prose` is forced to max-w-none so the wrapper controls width.
// All prose typography lives in the global `.prose` rules (main.css) - nothing
// to reproduce here beyond the wrapper.
interface Props {
  /** The parsed content document to hand to <ContentRenderer>. */
  value: any
  /** Optional max-width override (any CSS length); defaults to the reading measure. */
  maxWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  maxWidth: undefined,
})
</script>

<template>
  <!-- wrap-read = w-full max-w-[var(--maxw-read)] mx-auto px-[var(--pad-x)];
       an inline max-width (higher specificity than the utility) overrides the
       measure when the maxWidth prop is supplied. -->
  <div class="wrap-read" :style="props.maxWidth ? { maxWidth: props.maxWidth } : undefined">
    <div class="prose max-w-none">
      <ContentRenderer :value="props.value" />
    </div>
  </div>
</template>
