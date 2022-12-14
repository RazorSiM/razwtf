import { defineConfig, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetUno(),
    presetScrollbar(),
    // presetTypography({
    //   cssExtend: {
    //     'p': {
    //       'color': 'rgb(var(--base06))',
    //       'font-family': 'Victor',
    //     },
    //     'h1>a,h2>a,h3>a,h4>a,h5>a,h6>a': {
    //       'font-family': 'Victor',
    //       'font-weight': 'bold',
    //       'color': 'rgb(var(--base05))',
    //       'text-decoration': 'none',
    //     },
    //     'a': {
    //       'color': 'rgb(var(--base0C))',
    //       'transition': 'color 0.2s ease-in-out',
    //       'font-family': 'VictorItalic',
    //     },
    //     'a:hover': {
    //       color: 'rgb(var(--base09))',
    //     },
    //     'a:visited': {
    //       color: 'rgb(var(--base0C))',
    //     },
    //     'a:active': {
    //       color: 'rgb(var(--base08))',
    //     },
    //     'strong': {
    //       color: 'rgb(var(--base08))',
    //     },
    //     'em': {
    //       'color': 'rgb(var(--base09))',
    //       'font-family': 'VictorItalic',
    //     },
    //     'blockquote': {
    //       'color': 'rgb(var(--base0A))',
    //       'border-left': 'rgb(var(--base0A)) 0.25em solid',
    //     },
    //     'blockquote>p': {
    //       'color': 'rgb(var(--base0A))',
    //       'font-family': 'VictorItalic',
    //     },
    //     'ul>li::before': {
    //       'background-color': 'rgb(var(--base09))',
    //     },
    //     'table': {
    //       color: 'rgb(var(--base08))',
    //     },
    //     'table>thead': {
    //       'color': 'rgb(var(--base09))',
    //       'border-bottom': 'rgb(var(--base03)) 2px solid',
    //     },
    //     'table>tbody': {
    //       color: 'rgb(var(--base06))',
    //     },
    //     'table>tbody>tr': {
    //       'border-bottom': 'rgb(var(--base02)) solid 1px',
    //     },

    //   },
    // }),
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
      rosewater: 'rgb(var(--rosewater))',
      flamingo: 'rgb(var(--flamingo))',
      pink: 'rgb(var(--pink))',
      mauve: 'rgb(var(--mauve))',
      red: 'rgb(var(--red))',
      maroon: 'rgb(var(--maroon))',
      peach: 'rgb(var(--peach))',
      yellow: 'rgb(var(--yellow))',
      green: 'rgb(var(--green))',
      teal: 'rgb(var(--teal))',
      sky: 'rgb(var(--sky))',
      sapphire: 'rgb(var(--sapphire))',
      blue: 'rgb(var(--blue))',
      lavender: 'rgb(var(--lavender))',
      text: 'rgb(var(--text))',
      subtext: {
        0: 'rgb(var(--subtext0))',
        1: 'rgb(var(--subtext1))',
      },
      overlay: {
        0: 'rgb(var(--overlay0))',
        1: 'rgb(var(--overlay1))',
        2: 'rgb(var(--overlay2))',
      },
      surface: {
        0: 'rgb(var(--surface0))',
        1: 'rgb(var(--surface1))',
        2: 'rgb(var(--surface2))',
      },
      base: 'rgb(var(--base))',
      mantle: 'rgb(var(--mantle))',
      crust: 'rgb(var(--crust))',
    },
    boxShadow: {
      '3xl': '0 25px 50px -12px rgb(0 0 0 / 50%)',
    },

  },
})
