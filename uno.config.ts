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
      rosewater: 'rgba(var(--rosewater))',
      flamingo: 'rgba(var(--flamingo))',
      pink: 'rgba(var(--pink))',
      mauve: 'rgba(var(--mauve))',
      red: 'rgba(var(--red))',
      maroon: 'rgba(var(--maroon))',
      peach: 'rgba(var(--peach))',
      yellow: 'rgba(var(--yellow))',
      green: 'rgba(var(--green))',
      teal: 'rgba(var(--teal))',
      sky: 'rgba(var(--sky))',
      sapphire: 'rgba(var(--sapphire))',
      blue: 'rgba(var(--blue))',
      lavender: 'rgba(var(--lavender))',
      text: 'rgba(var(--text))',
      subtext: {
        0: 'rgba(var(--subtext0))',
        1: 'rgba(var(--subtext1))',
      },
      overlay: {
        0: 'rgba(var(--overlay0))',
        1: 'rgba(var(--overlay1))',
        2: 'rgba(var(--overlay2))',
      },
      surface: {
        0: 'rgba(var(--surface0))',
        1: 'rgba(var(--surface1))',
        2: 'rgba(var(--surface2))',
      },
      base: 'rgba(var(--base))',
      // base: "#f5f5f5",
      mantle: 'rgba(var(--mantle))',
      crust: 'rgba(var(--crust))',
    },
    boxShadow: {
      '3xl': '0 25px 50px -12px rgb(0 0 0 / 50%)',
    },

  },
})
