<script setup lang="ts">
// Project / work card - the presentational unit duplicated verbatim between
// pages/index.vue (work grid) and pages/projects/index.vue (featured + rest).
// Composes MediaFrame for the cropped hero; the coordinated card-hover
// choreography (glow / accentbar / go slide / img saturate / title colour) and
// the functional stretched-link overlay live in <style scoped> below.
interface WorkProject {
  path: string
  title: string
  kicker?: string
  year?: string | number
  description?: string
  hero?: string
  cover?: string
  image?: string
  accent?: string
  role?: string
  [k: string]: any
}

const props = withDefaults(defineProps<{
  /** The project record. hero → cover → image is the media src fallback chain;
   *  excerpt → description the copy fallback; collab → role the foot byline. */
  project: WorkProject
  /** Larger 2-col media/body split (≥900px), spanning the full grid row. */
  featured?: boolean
  /** Heading level the title renders as (default h3; featured cards use h2). */
  as?: 'h2' | 'h3'
}>(), {
  featured: false,
  as: 'h3',
})

// Per-card accent → inline CSS var (mirrors the pages' accentVar helper). The
// scoped glow / accentbar / hover utilities all read rgb(var(--accent)); it is
// inert without this, so it must be set on the root every render.
const accent = computed(() => `var(--${props.project.accent ?? 'mauve'})`)
</script>

<template>
  <article
    class="card group relative flex flex-col overflow-hidden rounded-md bg-base border border-[color:var(--hair)]"
    :class="featured && 'wide:col-span-full wide:grid wide:grid-cols-[1.12fr_.88fr] wide:items-stretch'"
    :style="{ '--accent': accent }"
  >
    <!-- Media: MediaFrame owns the cover-crop + interactive zoom. Its default
         border + radius are stripped (the card itself carries the frame). -->
    <MediaFrame
      ratio="720/495"
      interactive
      class="!border-0 !rounded-none" :class="[featured && 'wide:!aspect-auto wide:min-h-[400px]']"
    >
      <NuxtImg
        :src="project.hero ?? project.cover ?? project.image"
        :alt="project.title"
        loading="lazy"
        decoding="async"
        width="720"
        height="495"
      />
      <span class="card-glow" aria-hidden="true" />
      <span class="card-accentbar" aria-hidden="true" />
    </MediaFrame>

    <div
      class="flex flex-col flex-1 gap-[.7rem] p-[clamp(1.25rem,2.6vw,2rem)]"
      :class="featured && 'wide:justify-center wide:p-[clamp(2rem,4vw,3rem)]'"
    >
      <span class="kicker">
        <span class="swatch bg-[rgb(var(--accent))]" aria-hidden="true" /> {{ project.kicker ?? `${project.year ?? ''}` }}
      </span>

      <component
        :is="as"
        class="card-title font-display font-[560] text-h3 leading-[1.04] tracking-[-.015em] [font-optical-sizing:auto]"
      >
        <NuxtLink :to="project.path">
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
      <div class="mt-auto pt-[.4rem] flex items-center justify-between gap-4 font-mono text-micro tracking-[.14em] uppercase text-overlay-2">
        <span>{{ project.collab ?? project.role ?? '' }}</span>
        <span class="card-go text-subtext-0" aria-hidden="true">view →</span>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Card frame + hover choreography. Static styling is inline utilities; what
   stays here is KEEP-AS-CSS: dual-easing transitions, the radial-gradient glow,
   the parent-hover coordination of multiple descendants, and the functional
   stretched-link ::after overlay that makes the whole card clickable. */

.card { transition: border-color .4s var(--ease), transform .4s var(--ease-out); }
.card:hover { border-color: rgb(var(--accent) / .8); transform: translateY(-4px); }
.card:focus-within { border-color: rgb(var(--accent)); }

/* MediaFrame(interactive) owns the scale zoom + its transition. Re-assert the
   FULL transition here (winning specificity over MediaFrame's .mf-zoom rule) so
   the source's eased saturate() survives alongside the zoom, then apply it. */
.card.group :deep(img) { transition: transform .8s var(--ease-out), filter .6s var(--ease); }
.card:hover :deep(img) { filter: saturate(1.06); }

.card-glow {
  position: absolute; inset: 0; pointer-events: none; opacity: 0;
  background: radial-gradient(120% 80% at 85% 115%, rgb(var(--accent) / .32), transparent 60%);
  transition: opacity .5s var(--ease);
}
.card:hover .card-glow { opacity: 1; }

.card-accentbar {
  position: absolute; left: 0; right: 0; bottom: 0; height: 3px; z-index: 2;
  background: rgb(var(--accent)); transform: scaleX(0); transform-origin: left;
  transition: transform .5s var(--ease-out);
}
.card:hover .card-accentbar { transform: scaleX(1); }

/* Title link colour + the stretched-link overlay (FUNCTIONAL - whole card is
   the click target). The <a> inherits `text` at rest via main.css. */
.card-title :deep(a)::after { content: ""; position: absolute; inset: 0; }
.card:hover .card-title :deep(a) { color: rgb(var(--accent)); }

.card-go { transition: transform .3s var(--ease-out), color .3s var(--ease); }
.card:hover .card-go { transform: translateX(4px); color: rgb(var(--accent)); }
</style>
