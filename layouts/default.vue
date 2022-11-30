<script lang="ts" setup>
import { useScroll } from '@vueuse/core'
import { useThemeStore } from '@/stores/theme'
import { useLightboxStore } from '@/stores/lightbox'
import themesList from '@/helpers/themeList'
// import socialsList from '@/helpers/socialList'
const themeStore = useThemeStore()
const lightboxStore = useLightboxStore()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
const mainContainer = ref<HTMLElement | null>(null)
const { y } = useScroll(mainContainer)
</script>

<template>
  <div
    ref="mainContainer" :class="themeStore.theme" class="bg-base0 h-screen transition w-screen text-foreground p-4 font-sans flex flex-col overflow-x-hidden overflow-y-scroll"
  >
    <TopHeader>
      <template #leftSide>
        <LogoSvg />
        <TopNav :pages="navigation" />
      </template>
      <template #rightSide>
        <!-- <SocialLinks :socials="socialsList" /> -->
        <ThemePicker :themes="themesList" :theme-selected="themeStore.theme" @theme-selection="(newTheme:string) => themeStore.setTheme(newTheme)" />
      </template>
      <template #hamburgerContent>
        <TopNavHamburgerContent :pages="navigation" />
      </template>
    </TopHeader>
    <main class="prose mx-auto mt-10 mx-auto text-base md:text-xl">
      <slot />
    </main>
    <DefaultFooter class="mt-10 w-110% -ml-5% " />
    <LightBox :show="lightboxStore.lightbox.show" :show-close="true" :image="lightboxStore.lightbox.src" @close="lightboxStore.setLightbox({ show: false, src: '' }) " />
    <transition>
      <ScrollTop v-if="(y >= 20)" class="self-start fixed bottom-10 right-15" @click="(y = 0)" />
    </transition>
  </div>
</template>

<style>
::selection {
  color: rgb(var(--base00));
  background: rgb(var(--base0C));
}
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>

