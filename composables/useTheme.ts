export const useTheme = () => {
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

  const setTheme = (newTheme: 'latte' | 'frappe' | 'macchiato' | 'mocha' | 'light' | 'dark') => {
    mode.value = newTheme
  }

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
    selectedTheme,
    setTheme,
  }
}
