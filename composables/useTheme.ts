import { useStorage } from '@vueuse/core'

export type Themes = 'latte' | 'frappe' | 'macchiato' | 'mocha' | 'light' | 'dark'
export function useTheme() {
  const themesList = [
    'latte',
    'frappe',
    'macchiato',
    'mocha',
  ]
  const mode = useColorMode({
    attribute: 'class',
    modes: {
      latte: 'latte',
      frappe: 'frappe',
      macchiato: 'macchiato',
      mocha: 'mocha',
    },
  })

  const theme = useStorage<Themes>('theme', 'latte')
  mode.value = theme.value

  const setTheme = (newTheme: Themes) => {
    theme.value = newTheme
  }

  watch(theme, (newTheme) => {
    mode.value = newTheme
  })

  const selectedTheme = computed(() => {
    if (mode.value === 'light')
      return 'latte'
    if (mode.value === 'dark')
      return 'mocha'
    return mode.value
  })

  return {
    themesList,
    mode,
    theme,
    selectedTheme,
    setTheme,
  }
}
