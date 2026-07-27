<script setup lang="ts">
// Two-up previous / next navigation for the foot of a detail page. Purely
// presentational: pass a resolved item for either side (path + title, plus an
// optional thumb source and Catppuccin accent token), or null to omit that
// cell. Left cell = prev, right cell = next (right-aligned). Lifted verbatim
// from the .prevnext / .pn markup in pages/projects/[slug].vue.

interface PrevNextItem {
  path: string
  title: string
  hero?: string
  cover?: string
  image?: string
  /** Catppuccin token name (e.g. 'lavender') driving this cell's hover accent. */
  accent?: string
}

withDefaults(
  defineProps<{
    prev?: PrevNextItem | null
    next?: PrevNextItem | null
  }>(),
  {
    prev: null,
    next: null,
  },
)

// Per-cell accent → inline --accent var (hover border + hover title colour).
// Mirrors the source defaults: prev falls back to lavender, next to sky.
function accent(item: PrevNextItem, fallback: string) {
  return `var(--${item.accent ?? fallback})`
}

// Thumb source: source used .hero; generalised to the same hero → cover → image
// chain the page hero figure resolves against.
function thumb(item: PrevNextItem) {
  return item.hero ?? item.cover ?? item.image
}
</script>

<template>
  <nav v-if="prev || next" class="border-t border-[color:var(--hair)]" aria-label="More projects">
    <div class="wrap">
      <div
        class="foot:grid-cols-[1fr_1fr] grid grid-cols-[1fr] gap-[clamp(.8rem,2vw,1.2rem)] py-[clamp(2.5rem,5vw,3.5rem)]"
      >
        <!-- prev -->
        <div
          v-if="prev"
          v-reveal
          class="pn bg-base relative grid grid-cols-[auto_1fr] items-center gap-4 rounded-md border border-[color:var(--hair)] p-[clamp(1rem,2.4vw,1.4rem)]"
          :style="{ '--accent': accent(prev, 'lavender') }"
        >
          <MediaFrame class="w-[74px]" ratio="74/56" rounded="sm">
            <NuxtImg
              v-if="thumb(prev)"
              :src="thumb(prev)"
              :width="148"
              :height="112"
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          </MediaFrame>
          <div>
            <span class="text-micro text-overlay-1 font-mono tracking-[.16em] uppercase">← Previous set</span>
            <h3
              class="pn__title font-display text-h3 text-text mt-[.35rem] leading-[1.05] font-[540] tracking-[-.01em] [font-optical-sizing:auto]"
            >
              <NuxtLink :to="prev.path">
                {{ prev.title }}
              </NuxtLink>
            </h3>
          </div>
        </div>

        <!-- next -->
        <div
          v-if="next"
          v-reveal
          class="pn bg-base relative grid grid-cols-[1fr_auto] items-center gap-4 rounded-md border border-[color:var(--hair)] p-[clamp(1rem,2.4vw,1.4rem)] text-right"
          :style="{ '--accent': accent(next, 'sky'), '--rd': '.08s' }"
        >
          <div>
            <span class="text-micro text-overlay-1 font-mono tracking-[.16em] uppercase">Next set →</span>
            <h3
              class="pn__title font-display text-h3 text-text mt-[.35rem] leading-[1.05] font-[540] tracking-[-.01em] [font-optical-sizing:auto]"
            >
              <NuxtLink :to="next.path">
                {{ next.title }}
              </NuxtLink>
            </h3>
          </div>
          <MediaFrame class="w-[74px]" ratio="74/56" rounded="sm">
            <NuxtImg
              v-if="thumb(next)"
              :src="thumb(next)"
              :width="148"
              :height="112"
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
            />
          </MediaFrame>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* KEEP-AS-CSS only: the multi-property transition (distinct durations/easings
   per property), the parent-hover choreography of descendants (thumb zoom +
   title colour), the functional stretched-link ::after overlay, and the
   reduced-motion opt-out. Everything static is inline utilities above; the
   per-cell project accent (--accent) is set inline on each .pn. */
.pn {
  transition:
    border-color 0.35s var(--ease),
    transform 0.4s var(--ease-out);
}
.pn:hover {
  border-color: rgb(var(--accent) / 0.8);
  transform: translateY(-3px);
}
.pn :deep(img) {
  transition: transform 0.6s var(--ease-out);
}
.pn:hover :deep(img) {
  transform: scale(1.08);
}
.pn:hover .pn__title {
  color: rgb(var(--accent));
}

/* Stretched link: makes the whole card clickable via the title's <a>. */
.pn__title :deep(a)::after {
  content: '';
  position: absolute;
  inset: 0;
}

@media (prefers-reduced-motion: reduce) {
  .pn:hover {
    transform: none;
  }
}
</style>
