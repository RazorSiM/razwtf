<script lang="ts" setup>
import { useScroll } from '@vueuse/core'

const { themesList, store, system, setTheme } = useTheme()
const { state: theme, next } = useCycleList([...themesList], { initialValue: store.value })

onMounted(() => {
  if (store.value === 'auto')
    setTheme(system.value)

  else
    setTheme(store.value)
})

watch(theme, () => {
  setTheme(theme.value)
})

const { setImage, image } = injectLightbox()

const { data: navigation } = await useAsyncData('navigation', () => fetchContentNavigation())

const mainContainer = ref<HTMLElement | null>(null)
const { y } = useScroll(mainContainer, { behavior: 'smooth' })
</script>

<template>
  <div
    id="mainContainer"
    ref="mainContainer" class="h-screen w-screen flex flex-col overflow-x-hidden overflow-y-scroll bg-crust p-4 text-text font-sans transition scrollbar-thumb-color-flamingo scrollbar-track-color-base scrollbar-w-1 scrollbar scrollbar-rounded"
  >
    <TopHeader>
      <template #leftSide>
        <LogoSvg />
        <TopNav :pages="navigation" />
      </template>
      <template #rightSide>
        <button class="flex items-center justify-center rounded-full bg-base p-1 text-xl text-pink shadow" @click="next()">
          <i v-if="theme === 'dark'" class="i-carbon-moon align-middlealign-middle inline-block" />
          <i v-if="theme === 'light'" class="i-carbon-sun inline-block align-middle align-middle" />
          <i v-if="theme === 'frappe'" class="i-bi:cup-straw inline-block align-middle align-middle" />
          <i v-if="theme === 'macchiato'" class="i-mynaui:coffee inline-block align-middle align-middle" />
          <i v-if="theme === 'auto'" class="i-carbon-laptop inline-block align-middle align-middle" />
        </button>
      </template>
      <template #hamburgerContent>
        <TopNavHamburgerContent :pages="navigation" />
      </template>
    </TopHeader>
    <main class="mt-10">
      <slot />
    </main>
    <DefaultFooter class="mt-10 w-110% -ml-5%" />
    <LightBox :show="image.show" :show-close="true" :image="image.src" @close="setImage({ show: false, src: '' }) " />
    <transition>
      <ScrollTop v-if="(y >= 20)" class="fixed bottom-10 right-15 self-start" @click="(y = 0)" />
    </transition>
  </div>
</template>
