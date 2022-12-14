import { acceptHMRUpdate, defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
export const useThemeStore = defineStore('theme', () => {
  const mode = useColorMode({
    attribute: 'theme',
    modes: {
      latte: 'latte',
      frappe: 'frappe',
      macchiato: 'macchiato',
      mocha: 'mocha',
    },
  })
  const theme = useStorage('theme', 'latte')
  const setTheme = (newTheme: string) => {
    theme.value = newTheme
  }
  return { theme, setTheme, mode }
})

if (import.meta.hot)
  import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot))
