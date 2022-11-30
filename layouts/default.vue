<script lang="ts" setup>
import { useThemeStore } from '@/stores/theme'
import themesList from '@/helpers/themeList'
// import socialsList from '@/helpers/socialList'
const themeStore = useThemeStore()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
</script>

<template>
  <div
    :class="themeStore.theme" class="bg-base0 min-h-screen transition max-w-screen text-foreground p-4 font-sans flex flex-col"
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
  </div>
</template>

<style>
::selection {
  color: rgb(var(--base00));
  background: rgb(var(--base0C));
}
</style>

