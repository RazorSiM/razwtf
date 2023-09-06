import { defineConfig, presetIcons, presetUno, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

export default defineConfig({
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetUno(),
    presetScrollbar(),
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
