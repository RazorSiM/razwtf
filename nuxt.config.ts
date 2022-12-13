// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@unocss/nuxt', '@pinia/nuxt', '@vueuse/nuxt', '@nuxt/image-edge', '@nuxtjs/robots',
  ],
  app: {
    // pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
  },
  content: {
    documentDriven: true,
    markdown: {
      remarkPlugins: ['remark-reading-time'],
    },
  },
  image: {
    domains: ['unsplash.com', 'raz.wtf', 'i.imgur.com', 'imgur.com'],
    // dir: 'assets/images',
  },
  css: ['@unocss/reset/tailwind.css', '@/assets/css/themes.css', '@/assets/css/globals.css',
  ],
  postcss: {
    plugins: {
      autoprefixer: {
        grid: false,
      },
    },
  },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },
})
