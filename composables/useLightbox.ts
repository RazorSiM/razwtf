interface Lightbox {
  show: boolean
  src: string
}
export function useLightbox() {
  const image = ref<Lightbox>({ show: false, src: '' })
  function setImage(newLightbox: Lightbox): void {
    image.value = newLightbox
  }
  return { image, setImage }
}

export const LightboxKey: InjectionKey<ReturnType<typeof useLightbox>> = Symbol('lightbox')
export function provideLightbox() {
  const lightbox = useLightbox()
  provide(LightboxKey, lightbox)
}

export function injectLightbox() {
  const lightbox = inject(LightboxKey)
  if (!lightbox)
    throw new Error('No lightbox provided')
  return lightbox
}
