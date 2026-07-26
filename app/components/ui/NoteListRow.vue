<script setup lang="ts">
withDefaults(defineProps<{
  /** Path the whole row links to (via the stretched-link overlay). */
  to: string
  /** Note title, rendered inside the heading. */
  title: string
  /** Optional excerpt shown beneath the title. */
  description?: string
  /** Raw ISO date string; displayed as `yyyy · MM`. */
  date?: string
  /** Tag slugs, rendered as `#tag`. */
  tags?: string[]
  /** Reading estimate in minutes; shown as a chip when present. */
  readMin?: number
  /** Heading element: `h2` on the dedicated notes list, `h3` when nested. */
  as?: string
}>(), {
  as: 'h2',
})
</script>

<template>
  <article class="group relative grid grid-cols-1 gap-x-8 gap-y-2 border-b border-[color:var(--hair)] py-[clamp(1.4rem,3vw,2.1rem)] transition-[padding] duration-400 ease-out caps:grid-cols-[190px_1fr] caps:items-baseline caps:hover:pl-3">
    <div class="font-mono text-micro text-overlay-1 tracking-[.06em]">
      <span v-if="date" class="tabular-nums">{{ formatDate(date, 'yyyy · MM') }}</span>
      <div v-if="tags?.length || readMin" class="mt-3 flex flex-wrap items-center gap-2">
        <!-- relative z-1 lifts these above the row's stretched-link overlay
             (.row-link::after, position:absolute + inset:0 on the article's
             positioning context) so each tag is its own click target rather
             than being swallowed by the "open this note" overlay. -->
        <span v-if="tags?.length" class="flex flex-wrap gap-[.7em] text-mauve">
          <NuxtLink
            v-for="t in tags"
            :key="t"
            :to="`/blog/tag/${slugifyTag(t)}`"
            class="relative z-1 transition-colors duration-300 ease hover:text-lavender hover:underline"
          >
            #{{ t }}
          </NuxtLink>
        </span>
        <span v-if="readMin" class="chip">{{ readMin }} min</span>
      </div>
    </div>
    <div>
      <component :is="as" class="font-display text-h3 font-[540] leading-[1.08] tracking-[-.01em] [font-optical-sizing:auto]">
        <NuxtLink :to="to" class="row-link text-text group-hover:text-mauve">
          {{ title }}
        </NuxtLink>
      </component>
      <p v-if="description" class="mt-[.6rem] max-w-[60ch] text-body text-subtext-1">
        {{ description }}
      </p>
    </div>
  </article>
</template>

<style scoped>
/* Stretched-link overlay - makes the entire row clickable. Kept as CSS per
   policy: this ::after (content + absolute inset-0) is functional, not
   decorative. The article's `relative` is its positioning context. */
.row-link::after {
  content: "";
  position: absolute;
  inset: 0;
}
</style>
