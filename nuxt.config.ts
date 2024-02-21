// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@unocss/nuxt',
    '@nuxt/content',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxthq/studio',
  ],
  content: {
    documentDriven: true,
    markdown: {
      remarkPlugins: ['remark-reading-time'],
    },
    highlight: {
      theme: 'dracula',
      preload: [
        'bash',
        'css',
        'javascript',
        'typescript',
        'vue',
        'markdown',
      ],
    },
  },
  image: {
    quality: 70,
    format: ['webp', 'avif'],
    domains: ['unsplash.com', 'raz.wtf', 'i.imgur.com', 'imgur.com'],
  },
  css: [
    '@unocss/reset/tailwind-compat.css',
    '~/assets/css/main.css',
  ],
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },
  app: {
    head: {
      title: 'Raz - Simone Colabufalo',
      meta: [
        { name: 'description', content: 'Raz.WTF - Web Designer & Developer. I build things on the web, like this website' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:site', content: '@Razor_SiM' },
        { name: 'twitter:creator', content: '@Razor_SiM' },
        { name: 'twitter:title', content: 'Raz.WTF' },
        { name: 'twitter:description', content: 'Raz.WTF - Web Designer & Developer. I build things on the web, like this website' },
        { name: 'twitter:image', content: 'https://raz.wtf/socialShare.jpg' },
        { name: 'twitter:url', content: 'https://raz.wtf' },
        { name: 'twitter:image:alt', content: 'Raz.WTF render' },
        { name: 'og:title', content: 'Raz.WTF' },
        { name: 'og:description', content: 'Raz.WTF - Web Designer & Developer. I build things on the web, like this website' },
        { name: 'og:image', content: 'https://raz.wtf/socialShare.jpg' },
        { name: 'og:url', content: 'https://raz.wtf' },
        { name: 'og:image:alt', content: 'Raz.WTF render' },
        { name: 'og:site_name', content: 'Raz.WTF' },
        { name: 'og:type', content: 'website' },
        { name: 'og:locale', content: 'en_US' },
      ],
    },
  },
})
