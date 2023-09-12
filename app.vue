<script lang="ts" setup>
provideLightbox()

const description = 'Raz.WTF - Web Designer & Developer. I build things on the web, like this website'
const title = 'Raz - Simone Colabufalo'
const socialTitle = 'Raz.WTF'
const image = '/socialShare.jpg'
const imageAlt = 'Raz Logo'
const twitterName = '@Razor_SiM'
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
  ogUrl: 'https://raz.wtf',
})
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png',
    },
  ],
})
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
