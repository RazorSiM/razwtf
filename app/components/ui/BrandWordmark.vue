<script setup lang="ts">
// "raz.wtf" logotype - Victor Mono 700, accent-coloured dot.
// Covers the two mono wordmark call-sites (AppHeader nav link, AppFooter small
// link). If `to` is set the root is a <NuxtLink>, otherwise a plain <span>.
// `sizeClass` overrides the font-size utility; `interactiveDot` makes the dot
// fade mauve -> text on group-hover (header behaviour).
//
// NOT covered by this component (bespoke, different type / structure):
//  - the footer's big outlined Fraunces echo (.footer-mark, -webkit-text-stroke)
//  - the hero <h1> wordmark (positive tracking + blinking .cursor keyframe)
// Both stay where they are; do not route them through BrandWordmark.
//
// aria-label: this is text ("raz.wtf"), not an icon button, so no label is
// forced. The header's `aria-label="raz.wtf home"` is passed by the caller and
// falls through to the root element via attribute inheritance.
withDefaults(defineProps<{
  to?: string
  sizeClass?: string
  interactiveDot?: boolean
}>(), {
  sizeClass: 'text-[1.05rem]',
  interactiveDot: false,
})

// Resolve the real component: `<component :is="'NuxtLink'">` (a bare string)
// does NOT resolve the globally-registered NuxtLink - Vue renders an inert
// <nuxtlink> element with no href, so the wordmark link never navigates.
const NuxtLink = resolveComponent('NuxtLink')
</script>

<template>
  <component
    :is="to ? NuxtLink : 'span'"
    :to="to || undefined"
    class="inline-flex items-center gap-[.15em] font-mono font-700 tracking-[-.01em] text-text"
    :class="[sizeClass, { group: interactiveDot }]"
  >
    raz<span
      class="text-mauve"
      :class="{ 'transition-colors duration-300 ease group-hover:text-text': interactiveDot }"
    >.</span>wtf
  </component>
</template>
