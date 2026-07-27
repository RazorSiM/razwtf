<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    src: string
    alt?: string
    width?: number
    height?: number
    quality?: number
  }>(),
  {
    alt: 'image',
    width: 1200,
    height: 800,
    quality: 70,
  },
)

const { openLightbox } = injectLightbox()

function open() {
  openLightbox([{ src: props.src, alt: props.alt, caption: props.alt }], 0)
}
</script>

<template>
  <button type="button" class="figbox" :aria-label="`Open ${alt} full size`" @click="open">
    <NuxtImg :src="src" :alt="alt" :width="width" :height="height" :quality="quality" format="webp" />
    <span class="zoom" aria-hidden="true">⤢</span>
  </button>
</template>

<style scoped>
/* Framed, clickable feature figure (MDC ::img-lightbox) → shared lightbox.
   Accent inherits from the page (--accent); green is the fallback. Ported
   from the e-project mockup .figbox. */
.figbox {
  position: relative;
  display: block;
  width: 100%;
  margin: 0;
  padding: 0;
  cursor: zoom-in;
  font: inherit;
  color: inherit;
  text-align: left;
  border: 1px solid var(--hair);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: rgb(var(--base));
  transition: border-color 0.35s var(--ease);
}
.figbox:hover,
.figbox:focus-visible {
  border-color: rgb(var(--accent, var(--green)) / 0.7);
}
.figbox :deep(img) {
  display: block;
  width: 100%;
  height: auto;
}

.zoom {
  position: absolute;
  top: 0.6rem;
  right: 0.6rem;
  display: grid;
  place-items: center;
  width: 1.9rem;
  height: 1.9rem;
  border-radius: var(--radius);
  background: rgb(var(--crust) / 0.72);
  color: rgb(var(--text));
  font-family: var(--font-mono);
  font-size: 0.8rem;
  opacity: 0;
  transform: scale(0.85);
  transition:
    opacity 0.3s var(--ease),
    transform 0.3s var(--ease-out);
  -webkit-backdrop-filter: blur(4px);
  backdrop-filter: blur(4px);
}
.figbox:hover .zoom,
.figbox:focus-visible .zoom {
  opacity: 1;
  transform: scale(1);
}
</style>
