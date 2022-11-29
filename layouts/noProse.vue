<script lang="ts" setup>
import { useThemeStore } from '@/stores/theme'
import themesList from '@/helpers/themeList'
// import socialsList from '@/helpers/socialList'
const themeStore = useThemeStore()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
</script>

<template>
  <div
    :class="themeStore.theme" class="bg-base0 min-h-screen w-full transition text-foreground p-4 font-sans flex flex-col"
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
    <main class="mt-40">
      <slot />
    </main>

    <footer class="mt-auto prose mx-auto text-center text-xs py-10">
      <p>Crafted by me - this website is built on <a href="https://nuxt.com" target="_blank">Nuxt</a> with <a href="https://content.nuxtjs.org/" target="_blank">Content V2</a> and <a href="https://github.com/unocss/unocss" target="_blank">UnoCSS</a> under the hood.</p>
    </footer>
  </div>
</template>

<style>
::selection {
  color: rgb(var(--base00));
  background: rgb(var(--base0C));
}
</style>

