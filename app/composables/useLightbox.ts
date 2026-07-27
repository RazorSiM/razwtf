// Shared lightbox state. The gallery, ImgLightbox and the LightBox dialog all
// read/act through this single source of truth (provided once in app.vue).
export interface LightboxImage {
  src: string
  alt?: string
  caption?: string
}

interface LightboxState {
  open: boolean
  index: number
  items: LightboxImage[]
}

export function useLightbox() {
  const state = reactive<LightboxState>({
    open: false,
    index: 0,
    items: [],
  })

  function gotoImage(i: number): void {
    const len = state.items.length
    if (len === 0) return
    // Wrap around at both ends.
    state.index = ((i % len) + len) % len
  }

  function openLightbox(items: LightboxImage[], startIndex = 0): void {
    state.items = items
    state.index = startIndex
    state.open = true
  }

  function closeLightbox(): void {
    state.open = false
  }

  function nextImage(): void {
    gotoImage(state.index + 1)
  }

  function prevImage(): void {
    gotoImage(state.index - 1)
  }

  return { state, openLightbox, closeLightbox, nextImage, prevImage, gotoImage }
}

export const LightboxKey: InjectionKey<ReturnType<typeof useLightbox>> = Symbol('lightbox')

export function provideLightbox() {
  const lightbox = useLightbox()
  provide(LightboxKey, lightbox)
  return lightbox
}

export function injectLightbox() {
  const lightbox = inject(LightboxKey)
  if (!lightbox) throw new Error('No lightbox provided')
  return lightbox
}
