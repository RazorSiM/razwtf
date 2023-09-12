<script lang="ts" setup>
const { page, next, prev } = useContent()
definePageMeta({
  layout: 'default',
})
useContentHead(page)
// useSeoMeta({
//   twitterTitle: page.title,
//   twitterDescription: page.description,
//   twitterImage: page.hero,
//   ogImage: page.title,
// })
const distroIcon = 'M11.390232.60509C10.375655 3.09168 9.764285 4.7185 8.63513 7.13162c.692712.734695 1.542857 1.589214 2.923032 2.553937-1.484256-.610496-2.49621-1.223615-3.25277-1.859475-1.444897 3.015743-3.710204 7.311953-8.30554 15.568513 3.612246-2.08513 6.411955-3.36997 9.020993-3.861516-.111954-.48105-.175802-1.003208-.17143-1.54723l.0035-.115453c.057725-2.314286 1.261224-4.09417 2.68688-3.972595 1.425656.119825 2.53382 2.095627 2.477843 4.409038-.010496.43557-.06035.85452-.146064 1.242857 2.58105.504665 5.351895 1.78688 8.914286 3.844024-.702333-1.29271-1.329447-2.4586-1.928572-3.569387-.943732-.731196-1.926822-1.6828-3.933236-2.71312 1.3793.3586 2.366764.77143 3.136443 1.23411C13.970407 7.010922 13.478862 5.503924 11.390232.60509zM22.897813 21.360193v-.623615h-.233528v-.083965h.561516v.083965h-.2344v.623615h-.093587M23.322886 21.360193v-.70758h.14169l.167056.501166c.015744.04723.027114.082215.03411.10583.007873-.025365.020118-.06385.038485-.113703l.168805-.493294h.126822v.70758h-.090962v-.593003l-.206414.593003h-.083965l-.204665-.602624v.602623h-.090962'

const distroTitle = 'Arch Linux'
</script>

<template>
  <NuxtImg
    v-if="page.hero" :src="page.hero" quality="80" :width="1000" :height="600" :alt="page.title" class="mx-auto w-full rounded-3xl shadow-3xl"
  />
  <div class="mt-10 flex flex-col items-center justify-center">
    <p class="text-subtext-0">
      {{ formatDate(new Date(page.date)) }}
    </p>
    <p class="text-subtext-1">
      {{ page.readingTime.text }}
    </p>
  </div>
  <TerminalShell
    title="projects"
    distro-title="Arch Linux"
    :distro-icon="distroIcon"
    class="mx-auto mt-10 max-w-4xl overflow-x-hidden shadow-3xl md:text-xl"
  >
    <template v-if="page">
      <TerminalCommand
        :command="`cat ${page.title}`"
        :distro-icon="distroIcon"
        :distro-title="distroTitle"
      />
      <ContentRenderer :key="page._id" :value="page">
        <template #empty="{ value }">
          <DocumentDrivenEmpty :value="value" />
        </template>
      </ContentRenderer>
      <div
        v-if="page.gallery && page.gallery.length > 0" class="mx-auto mt-10 max-w-4xl"
      >
        <h2 class="mb-10 text-5xl font-bold">
          Gallery
        </h2>
        <template v-for="image in page.gallery" :key="image.name">
          <div class="mx-auto text-text md:text-xl">
            <h3 class="mb-2 mt-5 text-center text-3xl font-bold">
              {{ image.description }}
            </h3>
          </div>

          <ImagesGallery v-if="(image.images.length > 1)" :images="image.images" />
          <ImgLightbox v-else-if="(image.images.length === 1)" :src="image.images[0].src" class="mx-auto" :width="700" :height="500" />
        </template>
      </div>
    </template>
    <template v-else>
      <TerminalCommand>
        <DocumentDrivenNotFound />
      </TerminalCommand>
    </template>
  </TerminalShell>
  <Pagination :previous-page="prev?._path ?? null" :previous-title="prev?.title ?? null" :next-page="next?._path ?? null" :next-title="next?.title ?? null" class="mt-10 justify-center" />
</template>
