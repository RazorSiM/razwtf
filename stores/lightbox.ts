import { acceptHMRUpdate, defineStore } from 'pinia'
interface Lightbox {
  show: boolean
  src: string
}
export const useLightboxStore = defineStore('lightbox', () => {
  const lightbox = ref({ show: false, src: '' })
  const setLightbox = (newLightbox: Lightbox) => {
    lightbox.value = newLightbox
  }
  return { lightbox, setLightbox }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useLightboxStore, import.meta.hot))

