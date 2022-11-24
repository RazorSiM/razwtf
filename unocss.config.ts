import { defineConfig, presetIcons, presetTypography, presetUno } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography({
      cssExtend: {
        'p': {
          'color': 'rgb(var(--base06))',
          'font-family': 'Victor',
        },
        'h1': {
          color: 'rgb(var(--base06))',
        },
        'h2': {
          color: 'rgb(var(--base06))',
        },
        'h3': {
          color: 'rgb(var(--base06))',
        },
        'h4': {
          color: 'rgb(var(--base06))',
        },
        'h5': {
          color: 'rgb(var(--base06))',
        },
        'a': {
          'color': 'rgb(var(--base0A))',
          'transition': 'color 0.2s ease-in-out',
          'font-family': 'VictorItalic',
        },
        'a:hover': {
          color: 'rgb(var(--base09))',

        },
        'a:visited': {
          color: 'rgb(var(--base0C))',
        },
        'a:active': {
          color: 'rgb(var(--base08))',
        },
        'strong': {
          color: 'rgb(var(--base08))',
        },
        'em': {
          'color': 'rgb(var(--base09))',
          'font-family': 'VictorItalic',
        },
        'blockquote': {
          'color': 'rgb(var(--base0A))',
          'border-left-color': 'rgb(var(--base0A))',
        },
        'ul>li::before': {
          'background-color': 'rgb(var(--base09))',
        },
        'table': {
          color: 'rgb(var(--base08))',
        },
        'table>thead': {
          'color': 'rgb(var(--base09))',
          'border-bottom-color': 'rgb(var(--base03))',
        },
        'table>tbody': {
          color: 'rgb(var(--base06))',
        },
        'table>tbody>tr': {
          'border-bottom-color': 'rgb(var(--base02))',
        },

      },
    }),
    presetIcons({
      scale: 1.2,
    }),
    // presetWebFonts({
    //   provider: 'google',
    //   fonts: {
    //     sans: 'Roboto',
    //     serif: 'Source Serif Pro',
    //     mono: 'Fira Code',
    //   },
    // }),
  ],
  theme: {
    fontFamily: {
      sans: 'Victor',
      serif: 'VictorItalic',
    },
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
