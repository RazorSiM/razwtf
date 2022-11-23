import { acceptHMRUpdate, defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
export const useThemeStore = defineStore('theme', () => {
  const theme = useStorage('theme', 'dracula')
  const setTheme = (newTheme: string) => {
    theme.value = newTheme
  }
  return { theme, setTheme }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot))

