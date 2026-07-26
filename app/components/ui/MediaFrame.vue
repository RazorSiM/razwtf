<script setup lang="ts">
// Shared media primitive: a bordered, rounded, fixed-aspect frame with a
// mantle backdrop that clips a slotted <NuxtImg>/<img> to `object-fit: cover`.
// Composed by WorkCard, PrevNextNav, spotlight/about/hero media, etc. Keep the
// API stable: <MediaFrame ratio="720/495" interactive><NuxtImg .../></MediaFrame>.
const props = withDefaults(defineProps<{
  /** Aspect ratio of the frame box, e.g. '720/495' or '16/11'. Fed to an inline
   *  --frame-ratio var and consumed by aspect-[var(--frame-ratio)]. */
  ratio?: string
  /** When true, the slotted image scales up slightly while an ancestor `.group`
   *  is hovered (standard group-hover choreography). */
  interactive?: boolean
  /** Corner radius: 'sm' (4px) · 'md' (10px) · 'lg' (16px) · 'full'. */
  rounded?: 'sm' | 'md' | 'lg' | 'full'
}>(), {
  ratio: '16/11',
  interactive: false,
  rounded: 'md',
})

// Radius token → CSS value. Maps onto the same --radius* tokens the source
// frames used (thumbs = --radius, hero/about = --radius-md, project = --radius-lg).
const RADII: Record<string, string> = {
  sm: 'var(--radius)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
  full: '9999px',
}
const frameRadius = computed(() => RADII[props.rounded] ?? RADII.md)
</script>

<template>
  <div
    class="relative block overflow-hidden bg-mantle border border-[color:var(--hair)] aspect-[var(--frame-ratio)] rounded-[var(--frame-radius)]"
    :class="interactive && 'mf-zoom group-hover:[--mf-zoom:1.05]'"
    :style="{ '--frame-ratio': ratio, '--frame-radius': frameRadius }"
  >
    <slot />
  </div>
</template>

<style scoped>
/* Reaches the slotted <NuxtImg>/<img>: the frame owns cover-cropping so any
   passed image fills the fixed-aspect box. :deep is required - the <img> is
   rendered by the caller (slot / NuxtImg), not by this component. */
:deep(img) {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Interactive zoom. `group-hover:[--mf-zoom:1.05]` on the frame is inert until
   an ancestor `.group` is hovered; the var then inherits down to the slotted
   img, whose transform reads it (scale can't be a group-hover utility on
   markup we don't render). Reduced-motion is handled globally in main.css,
   which collapses transition-duration to ~0 - matching the source frames. */
.mf-zoom :deep(img) {
  transform: scale(var(--mf-zoom, 1));
  transition: transform .8s var(--ease-out);
}
</style>
