import { defineConfig, presetIcons, presetTypography, presetUno, transformerDirectives } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  transformers: [transformerDirectives()],
  presets: [
    presetUno(),
    presetScrollbar(),
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
          'color': 'rgb(var(--base0C))',
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
          'border-left': 'rgb(var(--base0A)) 0.25em solid',
        },
        'blockquote>p': {
          'color': 'rgb(var(--base0A))',
          'font-family': 'VictorItalic',
        },
        'ul>li::before': {
          'background-color': 'rgb(var(--base09))',
        },
        'table': {
          color: 'rgb(var(--base08))',
        },
        'table>thead': {
          'color': 'rgb(var(--base09))',
          'border-bottom': 'rgb(var(--base03)) 2px solid',
        },
        'table>tbody': {
          color: 'rgb(var(--base06))',
        },
        'table>tbody>tr': {
          'border-bottom': 'rgb(var(--base02)) solid 1px',
        },

      },
    }),
    presetIcons({
      scale: 1.2,
    }),
  ],
  rules: [
    ['text-xxs', { 'font-size': '0.6rem' }],
  ],
  theme: {
    fontFamily: {
      sans: 'Victor',
      serif: 'VictorItalic',
    },
    colors: {
      base: {
        0: 'rgb(var(--base00))',
        1: 'rgb(var(--base01))',
        2: 'rgb(var(--base02))',
        3: 'rgb(var(--base03))',
      },

      primary: 'rgb(var(--base08))',
      secondary: 'rgb(var(--base09))',
      tertiary: 'rgb(var(--base0A))',
      accent: 'rgb(var(--base0C))',

      foreground: 'rgb(var(--base06))',
      faccent: 'rgb(var(--base04))',
      fmuted: 'rgb(var(--base05))',
    },
    boxShadow: {
      '3xl': '0 25px 50px -12px rgb(0 0 0 / 50%)',
    },

  },
})
