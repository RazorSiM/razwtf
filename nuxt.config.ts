// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@unocss/nuxt', '@pinia/nuxt', '@vueuse/nuxt'],
  content: {
    documentDriven: true,
  },
  css: ['@unocss/reset/tailwind.css', '@/assets/css/themes.css',
  ],
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },
})
