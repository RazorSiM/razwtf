// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ['@nuxt/content', '@unocss/nuxt', '@pinia/nuxt', '@vueuse/nuxt', '@nuxt/image-edge', '@nuxtjs/robots',
  ],
  app: {
    // pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' },
    head: {
      title: 'Raz - Simone Colabufalo',
      meta: [
        { name: 'description', content: 'Raz.WTF - Web Designer & Developer. I build things on the web, like this website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@Razor_SiM' },
        { name: 'twitter:creator', content: '@Razor_SiM' },
        { name: 'twitter:title', content: 'Raz.WTF' },
        { name: 'twitter:description', content: 'Raz.WTF - Web Designer & Developer. I build things on the web, like this website' },
        { name: 'twitter:image', content: 'https://raz.wtf/socialShare.png' },
        { name: 'twitter:url', content: 'https://raz.wtf' },
        { name: 'twitter:image:alt', content: 'Raz.WTF render' },
        { name: 'og:title', content: 'Raz.WTF' },
        { name: 'og:description', content: 'Raz.WTF - Web Designer & Developer. I build things on the web, like this website' },
        { name: 'og:image', content: 'https://raz.wtf/socialShare.png' },
        { name: 'og:url', content: 'https://raz.wtf' },
        { name: 'og:image:alt', content: 'Raz.WTF render' },
        { name: 'og:site_name', content: 'Raz.WTF' },
        { name: 'og:type', content: 'website' },
        { name: 'og:locale', content: 'en_US' },
      ],
    },
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
