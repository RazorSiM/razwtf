<script lang="ts" setup>
/* ==========================================================================
   KineticText - pretext-driven kinetic display type (raz-lx4).

   Renders its slot as plain, complete text on the server (hidden at first
   paint via the site's `data-reveal` rule), then on the client measures with
   pretext, splits into per-word / per-letter spans preserving inline markup,
   and springs them in with motion-v when scrolled into view.

   Modes:
     mode="words"  (default) - per-word cascade + pretext balanced wrap
     mode="letters"           - per-grapheme cascade (hero mega-wordmark)
     fill                     - scale font-size so the text fills its column

   Degrades gracefully: no JS / reduced-motion / measurement failure → plain
   text shows instantly. Re-fits on container resize without re-animating.
   ========================================================================== */
import { cascade, primeHidden, showInstant, splitLetters, splitWords } from '~/utils/kinetic'

const props = withDefaults(
  defineProps<{
    as?: string
    mode?: 'words' | 'letters'
    fill?: boolean
    balanced?: boolean
    stagger?: number
    rise?: number
    stiffness?: number
    damping?: number
    /** Scale cascade intensity down for smaller type (keeps body headings calm). */
    scaleBySize?: boolean
  }>(),
  {
    as: 'span',
    mode: 'words',
    fill: false,
    balanced: true,
    stagger: 42,
    rise: 26,
    stiffness: 130,
    damping: 21,
    scaleBySize: true,
  },
)

const { loadPretext, fontsReady, fontStringOf, balancedWidth, naturalWidth } = usePretext()

const root = ref<HTMLElement | null>(null)
const revealed = ref(false)

let text = ''
let spans: HTMLElement[] = []
let pt: Awaited<ReturnType<typeof loadPretext>> = null
let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null
let played = false

function intensity(): number {
  if (!props.scaleBySize || !root.value) return 1
  const fs = Number.parseFloat(getComputedStyle(root.value).fontSize)
  return Math.min(1, Math.max(0.4, fs / 48))
}

// Recompute layout-only bits (fill scale + balanced width). No re-split.
function relayout() {
  const el = root.value
  if (!el || !pt) return
  if (props.fill) {
    el.style.fontSize = ''
    const base = Number.parseFloat(getComputedStyle(el).fontSize)
    const natural = naturalWidth(pt, text, fontStringOf(el))
    const cw = (el.parentElement?.clientWidth ?? el.clientWidth) - 2
    if (natural > 0 && cw > 0) {
      el.style.fontSize = `${base * (cw / natural)}px`
      // pretext's canvas measure can't see letter-spacing, ligatures or child
      // spans (e.g. a coloured wordmark dot), so the first estimate can over- or
      // undershoot. Measure the real rendered box and rescale once to fit exactly.
      const actual = el.getBoundingClientRect().width
      if (actual > 0) el.style.fontSize = `${Number.parseFloat(el.style.fontSize) * (cw / actual)}px`
    }
  } else if (props.balanced && props.mode === 'words') {
    el.style.maxWidth = ''
    const cw = el.clientWidth
    const bw = balancedWidth(pt, text, fontStringOf(el), cw)
    if (bw < cw) el.style.maxWidth = `${bw}px`
  }
}

function play() {
  if (played) return
  played = true
  cascade(spans, {
    distance: props.rise,
    stagger: props.stagger,
    stiffness: props.stiffness,
    damping: props.damping,
    scale: intensity(),
  })
}

let enhanced = false

// Lazy enhancement: load pretext, scale/wrap, split + prime, then either
// cascade ('play') or show at rest ('instant'). Deferred until the heading
// nears the viewport so below-fold headings cost nothing on load - no pretext
// import, no canvas measurement, no DOM split until they're about to be seen.
// mode 'layout' does the fill/balance scaling only (reduced-motion): no split.
async function enhance(mode: 'layout' | 'instant' | 'play') {
  const el = root.value
  if (enhanced || !el) return
  enhanced = true

  try {
    pt = await loadPretext()
    await fontsReady()
  } catch {
    revealed.value = true
    return
  }
  if (!pt) {
    revealed.value = true
    return
  }

  try {
    // fill / balanced scaling is layout (not motion) → apply in every mode.
    relayout()

    let rt: ReturnType<typeof setTimeout> | null = null
    ro = new ResizeObserver(() => {
      if (rt) clearTimeout(rt)
      rt = setTimeout(relayout, 120)
    })
    ro.observe(el.parentElement ?? el)

    if (mode === 'layout') {
      revealed.value = true // global reduced-motion CSS also forces it visible
      return
    }

    spans = props.mode === 'letters' ? splitLetters(el) : splitWords(el)
    primeHidden(spans, props.rise, intensity())
    revealed.value = true

    if (mode === 'play') play()
    else showInstant(spans)
  } catch {
    // Never leave the heading hidden: reveal it and show any split words.
    revealed.value = true
    if (spans.length) showInstant(spans)
  }
}

onMounted(() => {
  const el = root.value
  if (!el) return
  text = (el.textContent ?? '').replace(/\s+/g, ' ').trim()

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduce) {
    // Layout-only scaling, applied eagerly so the (already-visible) heading is
    // sized correctly at once; no scroll-gated motion under reduced-motion.
    enhance('layout')
    return
  }

  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue
          io!.unobserve(e.target)
          enhance('play')
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.1 },
    )
    io.observe(el)
  } else {
    enhance('instant')
  }
})

onBeforeUnmount(() => {
  io?.disconnect()
  ro?.disconnect()
})
</script>

<template>
  <component :is="as" ref="root" data-reveal :class="{ 'is-in': revealed }">
    <slot />
  </component>
</template>
