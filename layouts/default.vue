<script lang="ts" setup>
import { useScroll } from '@vueuse/core'
import { useLightboxStore } from '@/stores/lightbox'
const { themesList, selectedTheme, setTheme } = useTheme()
const lightboxStore = useLightboxStore()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
const mainContainer = ref<HTMLElement | null>(null)
const { y } = useScroll(mainContainer, { behavior: 'smooth' })
</script>

<template>
  <div
    id="mainContainer"
    ref="mainContainer" class="bg-crust h-screen transition w-screen text-text p-4 font-sans flex flex-col overflow-x-hidden overflow-y-scroll scrollbar scrollbar-track-color-base scrollbar-thumb-color-flamingo scrollbar-rounded scrollbar-w-1"
  >
    <TopHeader>
      <template #leftSide>
        <LogoSvg />
        <TopNav :pages="navigation" />
      </template>
      <template #rightSide>
        <ThemePicker :themes="themesList" :theme-selected="selectedTheme" @theme-selection="(newTheme: 'latte' | 'frappe' | 'macchiato' | 'mocha' | 'light' | 'dark') => setTheme(newTheme)" />
      </template>
      <template #hamburgerContent>
        <TopNavHamburgerContent :pages="navigation" />
      </template>
    </TopHeader>
    <main class="mt-10">
      <slot />
    </main>
    <DefaultFooter class="mt-10 w-110% -ml-5%" />
    <LightBox :show="lightboxStore.lightbox.show" :show-close="true" :image="lightboxStore.lightbox.src" @close="lightboxStore.setLightbox({ show: false, src: '' }) " />
    <transition>
      <ScrollTop v-if="(y >= 20)" class="self-start fixed bottom-10 right-15" @click="(y = 0)" />
    </transition>
  </div>
</template>
