<script setup lang="ts">
interface Segment {
  /** Directory label shown in the path (e.g. "~/notes"). */
  label: string
  /** Optional route - when set the segment renders as a NuxtLink that recolours on hover. */
  to?: string
}

interface Props {
  /** Shell prompt / identity shown first (e.g. "raz@wtf"). Accent-coloured; omit for a bare path. */
  prompt?: string
  /** Ancestor path segments between the prompt and the current page. Linkable via `to`. */
  segments: Segment[]
  /** Current page - the final, plain (non-link) path component (e.g. "my-post.md"). */
  leaf: string
}

withDefaults(defineProps<Props>(), {
  prompt: '',
})
</script>

<template>
  <!--
    Terminal-style breadcrumb: {prompt}:{segment}/…/{leaf}. Colour roles mirror the
    old per-page `.path` CSS - prompt = accent (mauve fallback), separators = surface-2,
    segments = subtext-0 (links recolour to mauve on hover), leaf = plain overlay-1.
    The `:` only follows the prompt; every other separator is `/`.
  -->
  <p class="text-cap text-overlay-1 inline-flex flex-wrap items-baseline gap-[.1em] font-mono tracking-[.02em]">
    <span v-if="prompt" class="text-[rgb(var(--accent,var(--mauve)))]">{{ prompt }}</span>
    <template v-for="(seg, i) in segments" :key="seg.label">
      <span v-if="i > 0 || prompt" aria-hidden="true" class="text-surface-2">{{ i === 0 ? ':' : '/' }}</span>
      <NuxtLink v-if="seg.to" :to="seg.to" class="group text-subtext-0">
        <span class="ease group-hover:text-mauve transition-colors duration-[250ms]">{{ seg.label }}</span>
      </NuxtLink>
      <span v-else class="text-subtext-0">{{ seg.label }}</span>
    </template>
    <span aria-hidden="true" class="text-surface-2">/</span>
    <span>{{ leaf }}</span>
  </p>
</template>
