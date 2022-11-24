<script lang="ts" setup>
import { useThemeStore } from '@/stores/theme'
import themesList from '@/helpers/themeList'
// import socialsList from '@/helpers/socialList'
const themeStore = useThemeStore()
const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())
</script>

<template>
  <div
    :class="themeStore.theme" class="bg-base1 min-h-screen w-full transition text-foreground p-4 "
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
    <slot />
  </div>
</template>

<style>
::selection {
  color: rgb(var(--base00));
  background: rgb(var(--base0C));
}
</style>

