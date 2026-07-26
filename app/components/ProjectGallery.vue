<script setup lang="ts">
interface GalleryImage {
  src: string
  alt?: string
  name?: string
}
interface GalleryGroup {
  description?: string
  images: GalleryImage[]
}

const props = defineProps<{
  groups: GalleryGroup[]
}>()

const { openLightbox } = injectLightbox()

// One flattened list across every group so a single lightbox spans the whole
// gallery. caption falls back name -> alt -> group description.
const flatItems = computed(() =>
  props.groups.flatMap(g =>
    (g.images ?? []).map(img => ({
      src: img.src,
      alt: img.alt,
      caption: img.name || img.alt || g.description,
    }))))

// Running offset per group → maps a group-local index to its global index in
// flatItems, so clicking any tile opens the lightbox at the right position.
const groupOffsets = computed(() => {
  const offsets: number[] = []
  let acc = 0
  for (const g of props.groups) {
    offsets.push(acc)
    acc += g.images?.length ?? 0
  }
  return offsets
})
</script>

<template>
  <div class="project-gallery">
    <div
      v-for="(group, gi) in groups"
      :key="gi"
      v-reveal
      class="ggroup"
      :style="{ '--rd': `${gi * 0.06}s` }"
    >
      <div v-if="group.description" class="flex items-center gap-4 mb-[clamp(.85rem,2vw,1.25rem)]">
        <span class="font-mono text-micro tracking-[.18em] uppercase text-overlay-1">{{ group.description }}</span>
        <span class="flex-1 min-w-[1.5rem] h-px bg-gradient-to-r from-[var(--hair-strong)] to-transparent" aria-hidden="true" />
      </div>

      <div class="grid grid-cols-2 gap-[clamp(.7rem,1.6vw,1.1rem)] nav:grid-cols-3">
        <button
          v-for="(image, ii) in group.images"
          :key="image.src"
          type="button"
          class="gallery__item relative block w-full m-0 p-0 cursor-zoom-in text-inherit text-left border border-[color:var(--hair)] rounded-md overflow-hidden bg-mantle aspect-[4/3]"
          :aria-label="`Open ${image.name || image.alt || 'image'} full size`"
          @click="openLightbox(flatItems, groupOffsets[gi] + ii)"
        >
          <NuxtImg
            :src="image.src"
            :alt="image.alt ?? ''"
            :width="640"
            :height="480"
            loading="lazy"
            decoding="async"
            format="webp"
          />
          <span class="zoom" aria-hidden="true">⤢</span>
          <span v-if="image.name || image.alt" class="gallery__cap">{{ image.name || image.alt }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Grouped project gallery - tiles feed the shared lightbox. Accent inherits
   from the page (--accent); green is the fallback. Ported from the e-project
   mockup .gallery / .gallery__item / .zoom / .gallery__cap.

   Kept scoped (utilities cannot express these): the `.ggroup + .ggroup`
   sibling rule; the tile's per-property transition (.35s border vs .4s
   transform, two easings) and its `font: inherit` shorthand; the parent-hover
   coordination into :deep(img)/.zoom/.gallery__cap (lift + image zoom must
   animate the `transform` PROPERTY the shared transitions target); and the
   .gallery__cap vertical gradient. Tile static styling is inlined above; the
   820px 3-col step maps to the `nav:` breakpoint. */

.ggroup + .ggroup { margin-top: clamp(1.6rem, 4vw, 2.6rem); }

.gallery__item {
  font: inherit;
  transition: border-color .35s var(--ease), transform .4s var(--ease-out);
}
.gallery__item :deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform .7s var(--ease-out), filter .5s var(--ease);
}
.gallery__item:hover,
.gallery__item:focus-visible {
  border-color: rgb(var(--accent, var(--green)) / .8);
  transform: translateY(-3px);
}
.gallery__item:hover :deep(img),
.gallery__item:focus-visible :deep(img) {
  transform: scale(1.06);
  filter: saturate(1.07);
}

.zoom {
  position: absolute;
  top: .6rem;
  right: .6rem;
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: var(--radius);
  background: rgb(var(--crust) / .72);
  color: rgb(var(--text));
  font-family: var(--font-mono);
  font-size: .8rem;
  opacity: 0;
  transform: scale(.85);
  transition: opacity .3s var(--ease), transform .3s var(--ease-out);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
.gallery__item:hover .zoom,
.gallery__item:focus-visible .zoom {
  opacity: 1;
  transform: scale(1);
}

.gallery__cap {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  padding: .85rem .9rem .6rem;
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: .08em;
  color: rgb(var(--text));
  text-align: left;
  background: linear-gradient(transparent, rgb(var(--crust) / .82));
  opacity: 0;
  transition: opacity .35s var(--ease);
}
.gallery__item:hover .gallery__cap,
.gallery__item:focus-visible .gallery__cap {
  opacity: 1;
}
</style>
