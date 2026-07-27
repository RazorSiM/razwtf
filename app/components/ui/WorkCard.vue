<script setup lang="ts">
// Project / work card - the presentational unit shared by pages/index.vue (work
// grid) and pages/projects/index.vue (featured + rest). Composes MediaFrame for
// the cropped hero. Everything is UnoCSS: the hover choreography rides
// `group-hover:` off the root's `group`, so there is no scoped CSS and no
// competing `display` rule for the featured variant's grid to lose to.
// The generated collection type from content.config.ts's zod schema, rather than
// a hand-written shape with an `[k: string]: any` escape hatch. Adding a field to
// the schema now surfaces here automatically, and typos are caught.
import type { ProjectsCollectionItem } from '@nuxt/content'

const props = withDefaults(
  defineProps<{
    /** The project record. hero → cover → image is the media src fallback chain;
     *  excerpt → description the copy fallback; collab → role the foot byline. */
    project: ProjectsCollectionItem
    /** Larger 2-col media/body split (≥900px), spanning the full grid row. */
    featured?: boolean
    /** Heading level the title renders as (default h3; featured cards use h2). */
    as?: 'h2' | 'h3'
  }>(),
  {
    featured: false,
    as: 'h3',
  },
)

// Per-card accent → inline CSS var. Every accent-coloured utility below reads
// rgb(var(--accent)), so they are inert without this being set on the root.
const accent = computed(() => `var(--${props.project.accent ?? 'mauve'})`)
</script>

<template>
  <article
    class="card group bg-base relative flex flex-col overflow-hidden rounded-md border border-[color:var(--hair)] [transition:border-color_.4s_var(--ease),translate_.4s_var(--ease-out)] focus-within:border-[color:rgb(var(--accent))] hover:-translate-y-[4px] hover:border-[color:rgb(var(--accent)/0.8)] motion-reduce:hover:translate-y-0"
    :class="featured && 'wide:col-span-full wide:grid wide:grid-cols-[1.12fr_.88fr] wide:items-stretch'"
    :style="{ '--accent': accent }"
  >
    <!-- Media: MediaFrame owns the cover-crop, the group-driven zoom and the
         image transition. Its default border + radius are stripped (the card
         itself carries the frame). -->
    <MediaFrame
      ratio="720/495"
      interactive
      class="!rounded-none !border-0"
      :class="[featured && 'wide:!aspect-auto wide:min-h-[400px]']"
    >
      <NuxtImg
        :src="project.hero ?? project.cover ?? project.image"
        :alt="project.title"
        loading="lazy"
        decoding="async"
        width="720"
        height="495"
        class="group-hover:saturate-[1.06]"
      />
      <!-- Accent glow, bottom-right, fading in on card hover. -->
      <span
        class="ease pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_85%_115%,rgb(var(--accent)/0.32),transparent_60%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        aria-hidden="true"
      />
      <!-- Accent bar wiping in from the left along the bottom edge. -->
      <span
        class="pointer-events-none absolute inset-x-0 bottom-0 z-2 h-[3px] origin-left scale-x-0 bg-[rgb(var(--accent))] transition-transform duration-500 ease-out group-hover:scale-x-100"
        aria-hidden="true"
      />
    </MediaFrame>

    <div
      class="flex flex-1 flex-col gap-[.7rem] p-[clamp(1.25rem,2.6vw,2rem)]"
      :class="featured && 'wide:justify-center wide:p-[clamp(2rem,4vw,3rem)]'"
    >
      <span class="kicker">
        <span class="swatch bg-[rgb(var(--accent))]" aria-hidden="true" />
        {{ project.kicker ?? `${project.year ?? ''}` }}
      </span>

      <component
        :is="as"
        class="font-display text-h3 leading-[1.04] font-[560] tracking-[-.015em] [font-optical-sizing:auto]"
      >
        <!-- after:inset-0 is the stretched-link overlay: FUNCTIONAL, it makes the
             whole card the click target. -->
        <NuxtLink
          :to="project.path"
          class="ease transition-colors duration-300 group-hover:text-[rgb(var(--accent))] after:absolute after:inset-0 after:content-['']"
        >
          {{ project.title }}
        </NuxtLink>
      </component>

      <p
        class="text-body text-subtext-1 max-w-[48ch]"
        :class="featured && 'wide:text-lead wide:leading-[1.5] wide:max-w-[46ch]'"
      >
        {{ project.excerpt ?? project.description }}
      </p>

      <!-- overlay-2 (not overlay-1): on the card's bg-base this 11.52px label is
           functional (role/collab); overlay-1 is 4.27:1 there (below AA), overlay-2 clears 4.5. -->
      <div
        class="text-micro text-overlay-2 mt-auto flex items-center justify-between gap-4 pt-[.4rem] font-mono tracking-[.14em] uppercase"
      >
        <span>{{ project.collab ?? project.role ?? '' }}</span>
        <span
          class="text-subtext-0 [transition:translate_.3s_var(--ease-out),color_.3s_var(--ease)] group-hover:translate-x-[4px] group-hover:text-[rgb(var(--accent))] motion-reduce:group-hover:translate-x-0"
          aria-hidden="true"
          >view →</span
        >
      </div>
    </div>
  </article>
</template>
