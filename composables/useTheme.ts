const themesList = [
  'auto',
  'frappe',
  'macchiato',
  'dark',
  'light',
] as const

export type Theme = typeof themesList[number]

export function useTheme() {
  const { store, system } = useColorMode({
    attribute: 'class',
    modes: {
      frappe: 'frappe',
      macchiato: 'macchiato',
    },
  })

  // const theme = useStorage<Themes>('theme', 'latte')
  // mode.value = theme.value

  const setTheme = (newTheme: Theme) => {
    store.value = newTheme
  }

  const selectedTheme = computed(() => {
    if (store.value === 'light')
      return 'latte'
    if (store.value === 'dark')
      return 'mocha'
    return store.value
  })

  return {
    themesList,
    store,
    system,
    selectedTheme,
    setTheme,
  }
}
