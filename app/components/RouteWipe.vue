<script setup lang="ts">
/* ==========================================================================
   RouteWipe - Studio-Terminal route transition (raz-ws5).

   On client navigation an accent "curtain" sweeps left→right to cover the
   viewport; the page swaps instantly behind it; then the curtain sweeps off
   to the right, revealing the new page as its title cascades in - a terminal
   "repaint". Compositor-only (transform), so it stays smooth.

   Fallbacks: reduced-motion and no-JS both skip the curtain entirely and get
   the plain `.page` opacity fade (main.css). SSR renders the curtain parked
   off-screen. A watchdog guarantees the curtain can never stay stuck covering
   if `page:finish` never fires (e.g. an aborted navigation).
   ========================================================================== */
const curtain = ref<HTMLElement | null>(null)

if (import.meta.client) {
  const router = useRouter()
  const nuxtApp = useNuxtApp()

  let active = false
  let coverDone = false
  let pageReady = false
  let watchdog: ReturnType<typeof setTimeout> | null = null
  let animateFn: (typeof import('motion-v'))['animate'] | null = null
  let current: any = null

  const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

  async function ensureAnimate() {
    if (!animateFn) animateFn = (await import('motion-v')).animate
    return animateFn
  }

  async function cover() {
    const el = curtain.value
    if (!el) return
    const animate = await ensureAnimate()
    current?.stop?.()
    el.style.willChange = 'transform'
    // in from the left, accelerating
    current = animate(
      el,
      { transform: ['translateX(-101%)', 'translateX(0%)'] },
      { duration: 0.26, ease: [0.5, 0, 0.7, 0] },
    )
    current.finished?.then(() => {
      coverDone = true
      maybeReveal()
    })
  }

  async function reveal() {
    const el = curtain.value
    if (!el) return
    const animate = await ensureAnimate()
    current?.stop?.()
    // continue off to the right, decelerating - new page revealed behind it
    current = animate(
      el,
      { transform: ['translateX(0%)', 'translateX(101%)'] },
      { duration: 0.36, ease: [0.16, 1, 0.3, 1] },
    )
    current.finished?.then(() => {
      active = false
      el.style.willChange = ''
      // park off-screen-left again (both ends are off-screen, so no flash)
      el.style.transform = 'translateX(-101%)'
    })
  }

  function maybeReveal() {
    if (active && coverDone && pageReady) {
      if (watchdog) clearTimeout(watchdog)
      reveal()
    }
  }

  router.beforeEach((to, from) => {
    if (reduce() || from.matched.length === 0 || to.path === from.path) return
    active = true
    coverDone = false
    pageReady = false
    cover()
    if (watchdog) clearTimeout(watchdog)
    // never let the curtain stick if the incoming page never resolves
    watchdog = setTimeout(() => {
      if (active) {
        pageReady = true
        maybeReveal()
      }
    }, 900)
  })

  nuxtApp.hook('page:finish', () => {
    if (active) {
      pageReady = true
      maybeReveal()
    }
  })
}
</script>

<template>
  <div ref="curtain" class="route-wipe" aria-hidden="true" />
</template>

<style scoped>
.route-wipe {
  position: fixed;
  inset: 0;
  z-index: 300;
  transform: translateX(-101%);
  pointer-events: none; /* decorative - never blocks interaction, even if stuck */
  background: linear-gradient(96deg, rgb(var(--mauve)) 0%, rgb(var(--mauve)) 82%, rgb(var(--lavender)) 100%);
}
/* bright leading edge reads like a terminal cursor sweeping across */
.route-wipe::after {
  content: '';
  position: absolute;
  inset-block: 0;
  right: 0;
  width: 4px;
  background: rgb(var(--text));
  box-shadow: 0 0 22px 3px rgb(var(--lavender) / 0.75);
}
</style>
