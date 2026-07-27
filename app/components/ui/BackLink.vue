<script setup lang="ts">
interface Props {
  /** Route the link navigates to. */
  to: string
  /** Visible, accessible link text (e.g. "All notes", "All work"). */
  label: string
  /** Arrow placement + slide direction. 'left' = leading ← sliding left; 'right' = trailing → sliding right. */
  direction?: 'left' | 'right'
}

withDefaults(defineProps<Props>(), {
  direction: 'left',
})
</script>

<template>
  <NuxtLink :to class="backlink group">
    <!-- Leading arrow: mono accent, slides left on hover (reduced-motion safe). -->
    <span
      v-if="direction === 'left'"
      aria-hidden="true"
      class="arw text-[rgb(var(--accent,var(--mauve)))] group-hover:-translate-x-[3px] motion-reduce:group-hover:translate-x-0"
      >←</span
    >
    {{ label }}
    <!-- Trailing arrow: mono accent, slides right on hover (arw default). -->
    <span v-if="direction === 'right'" aria-hidden="true" class="arw text-[rgb(var(--accent,var(--mauve)))]">→</span>
  </NuxtLink>
</template>
