import { defineConfig, presetIcons, presetTypography, presetUno, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetIcons({
      scale: 1.2,
    }),
    presetWebFonts({
      provider: 'google',
      fonts: {
        sans: 'Roboto',
        serif: 'Source Serif Pro',
        mono: 'Fira Code',
      },
    }),
  ],
  theme: {

    colors: {
      base: {
        1: 'rgb(var(--base00))',
        2: 'rgb(var(--base01))',
        3: 'rgb(var(--base02))',
        4: 'rgb(var(--base03))',
      },

      primary: 'rgb(var(--base08))',
      secondary: 'rgb(var(--base09))',
      tertiary: 'rgb(var(--base0A))',
      accent: 'rgb(var(--base0C))',

      foreground: 'rgb(var(--base06))',
      faccent: 'rgb(var(--base04))',
      fmuted: 'rgb(var(--base05))',
    },

  },
})
