// v-reveal - scroll-into-view reveal. SSR-renders the data-reveal attribute so
// the element is hidden at first paint (no flash, via html.js CSS), then, on the
// client, springs into place with motion (motion-v) when it enters the viewport.
// Stagger with :style="{ '--rd': '.08s' }". Under reduced-motion / no-IO it
// shows immediately (the directive adds .is-in; motion is never loaded).
export default defineNuxtPlugin(async (nuxtApp) => {
  let io: IntersectionObserver | null = null

  if (import.meta.client) {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!reduce && 'IntersectionObserver' in window) {
      // Load motion only on the client, only when we'll actually animate.
      const { animate } = await import('motion-v')
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue
            const el = e.target as HTMLElement
            io!.unobserve(el)
            // Per-element stagger, authored as --rd (seconds).
            const rd = Number.parseFloat(getComputedStyle(el).getPropertyValue('--rd')) || 0
            animate(
              el,
              { opacity: [0, 1], transform: ['translateY(22px)', 'translateY(0px)'] },
              { type: 'spring', stiffness: 130, damping: 21, delay: rd },
            )
            // Mark revealed for any state/consumers; motion owns the inline styles.
            el.classList.add('is-in')
          }
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
      )
    }
  }

  nuxtApp.vueApp.directive('reveal', {
    getSSRProps: () => ({ 'data-reveal': '' }),
    mounted(el: HTMLElement) {
      el.setAttribute('data-reveal', '')
      if (io) io.observe(el)
      else el.classList.add('is-in')
    },
    beforeUnmount(el: HTMLElement) {
      io?.unobserve(el)
    },
  })
})
