<script lang="ts" setup>
provideLightbox()

const SITE_ORIGIN = 'https://raz.wtf'
const description = 'Raz.WTF - Web Designer & Developer. I build things on the web, like this website'
const title = 'Raz - Simone Colabufalo'
const socialTitle = 'Raz.WTF'
// Absolute - social crawlers (Facebook/X/LinkedIn) reject relative og/twitter images.
const image = `${SITE_ORIGIN}/socialShare.jpg`
const imageAlt = 'Raz Logo'
const twitterName = '@Razor_SiM'

// Canonical + og:url track the current route so every page is self-referential
// (the homepage-hardcoded value would otherwise label every route as "/").
// route.path is stable during prerender; strip any trailing slash except root.
const route = useRoute()
const canonical = computed(() => {
  const path = route.path.replace(/\/+$/, '') || '/'
  return path === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${path}`
})

useSeoMeta({
  title,
  description,
  twitterCard: 'summary_large_image',
  twitterSite: twitterName,
  twitterCreator: twitterName,
  twitterTitle: socialTitle,
  twitterDescription: description,
  twitterImage: image,
  twitterImageAlt: imageAlt,
  ogTitle: socialTitle,
  ogDescription: description,
  ogImage: image,
  ogImageAlt: imageAlt,
  ogSiteName: socialTitle,
  ogType: 'website',
  ogLocale: 'en_US',
  ogUrl: canonical,
})
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    { rel: 'canonical', href: canonical },
    // Modern icon set. SVG is the primary (crisp at any size); .ico is the
    // legacy fallback; apple-touch-icon covers iOS home-screen bookmarks.
    { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
    { rel: 'manifest', href: '/site.webmanifest' },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'raz.wtf · Notes',
      href: '/rss.xml',
    },
    // Preload the LCP font (hero ASCII logo + kinetic title render in Victor
    // Mono Regular) so first paint doesn't wait on the CSS-discovered @font-face.
    {
      rel: 'preload',
      as: 'font',
      type: 'font/woff2',
      href: '/fonts/VictorMono-Regular.woff2',
      crossorigin: '',
    },
  ],
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <RouteWipe />
  </div>
</template>
