<script lang="ts" setup>
import { useScroll } from '@vueuse/core'
import { useLightboxStore } from '@/stores/lightbox'
const { themesList, mode, selectedTheme, setTheme } = useTheme()
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

        <button aria-label="Switch Light and Dark" class="rounded-full flex items-center justify-center  shadow text-2xl" @click="mode === 'light' || mode === 'latte' ? mode = 'dark' : mode = 'light'">
          <div v-if="mode === 'light' || mode === 'latte'" class="i-fluent-emoji-new-moon" /><div v-else class="i-fluent-emoji-sun" />
        </button>
        <button />
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

<style>
@media (prefers-color-scheme: dark) {
  html {
    --rosewater: 245, 224, 220;
    --flamingo: 242, 205, 205;
    --pink: 245, 194, 231;
    --mauve: 203, 166, 247;
    --red: 243, 139, 168;
    --maroon: 235, 160, 172;
    --peach: 250, 179, 135;
    --yellow: 249, 226, 175;
    --green: 166, 227, 161;
    --teal: 148, 226, 213;
    --sky: 137, 220, 235;
    --sapphire: 116, 199, 236;
    --blue: 135, 176, 249;
    --lavender: 180, 190, 254;
    --text: 198, 208, 245;
    --subtext1: 179, 188, 223;
    --subtext0: 161, 168, 201;
    --overlay2: 142, 149, 179;
    --overlay1: 123, 129, 157;
    --overlay0: 105, 109, 134;
    --surface2: 86, 89, 112;
    --surface1: 67, 70, 90;
    --surface0: 49, 50, 68;
    --base: 30, 30, 46;
    --mantle: 24, 24, 37;
    --crust: 17, 17, 27;
    background-color: var(rgb(--crust)) ;
  }
}

@media (prefers-color-scheme: light) {
  html {
    --rosewater: 222, 149, 132;
    --flamingo: 221, 120, 120;
    --pink: 236, 131, 208;
    --mauve: 136, 57, 239;
    --red: 210, 15, 57;
    --maroon: 230, 69, 83;
    --peach: 254, 100, 11;
    --yellow: 228, 147, 32;
    --green: 64, 160, 43;
    --teal: 23, 146, 153;
    --sky: 4, 165, 229;
    --sapphire: 32, 159, 181;
    --blue: 42, 110, 245;
    --lavender: 114, 135, 253;
    --text: 76, 79, 105;
    --subtext1: 92, 95, 119;
    --subtext0: 108, 111, 133;
    --overlay2: 124, 127, 147;
    --overlay1: 140, 143, 161;
    --overlay0: 156, 160, 176;
    --surface2: 172, 176, 190;
    --surface1: 188, 192, 204;
    --surface0: 204, 208, 218;
    --base: 239, 241, 245;
    --mantle: 230, 233, 239;
    --crust: 220, 224, 232;
    background-color: var(rgb(--crust)) ;
  }
}
</style>
