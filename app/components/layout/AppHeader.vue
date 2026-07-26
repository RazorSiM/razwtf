<script lang="ts" setup>
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogRoot, DialogTitle, DialogTrigger } from 'reka-ui'

const { FLAVORS, preference, setFlavor, cycle } = useFlavor()

// Sticky glass background kicks in once the page has scrolled a touch.
const { y } = useWindowScroll()
const scrolled = computed(() => y.value > 8)

// Notes only appears once there's something published to read (raz-je5).
const hasPublishedPosts = await useHasPublishedPosts()

const links = computed(() => [
  { label: 'Work', to: '/projects' },
  { label: 'About', to: '/about' },
  ...(hasPublishedPosts.value ? [{ label: 'Notes', to: '/blog' }] : []),
])

// Mauve preview per flavor - used only for the dots row, since each dot must
// show ITS OWN flavor's accent regardless of which flavor is currently active.
const ACCENT_PREVIEW: Record<typeof FLAVORS[number], string> = {
  latte: 'rgb(136 57 239)',
  frappe: 'rgb(202 158 230)',
  macchiato: 'rgb(198 160 246)',
  mocha: 'rgb(203 166 247)',
}

const mobileOpen = ref(false)
</script>

<template>
  <header
    class="sticky top-0 z-50 h-[var(--nav-h)] flex items-center border-b transition-all duration-400 ease"
    :class="scrolled
      ? 'border-[color:var(--hair)] bg-crust/72 backdrop-blur-14px backdrop-saturate-[1.15]'
      : 'border-transparent bg-transparent'"
  >
    <div class="wrap flex items-center justify-between gap-5">
      <BrandWordmark to="/" interactive-dot aria-label="raz.wtf home" />

      <nav class="hidden items-center gap-[clamp(1rem,2.4vw,2.1rem)] nav:flex" aria-label="Primary">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="group relative py-5px font-mono text-micro tracking-[.14em] uppercase text-subtext-0 transition-colors duration-300 ease hover:text-text"
        >
          {{ link.label }}
          <span
            aria-hidden="true"
            class="absolute inset-x-0 bottom-0 h-1px origin-left scale-x-0 bg-mauve transition-transform duration-400 ease-out group-hover:scale-x-100"
          />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-[.6rem]" role="group" aria-label="Theme flavour">
          <ClientOnly>
            <button
              type="button"
              class="inline-flex items-center gap-[.5em] border border-surface-1/90 rounded-full bg-base/60 py-[.34rem] pl-[.55rem] pr-[.7rem] font-mono text-micro uppercase tracking-[.12em] transition-colors duration-300 ease hover:border-mauve active:scale-97"
              :aria-label="`Cycle theme flavour, currently ${preference}`"
              @click="cycle()"
            >
              <span
                aria-hidden="true"
                class="h-9px w-9px rounded-full bg-mauve shadow-[0_0_0_3px_rgb(var(--mauve)/0.18)]"
              />
              <span class="min-w-[4.6em] text-left">{{ preference }}</span>
            </button>

            <!-- 24px hit target (WCAG 2.5.8) around a 16px visual dot. -->
            <div class="hidden items-center gap-0 dots:inline-flex">
              <button
                v-for="f in FLAVORS"
                :key="f"
                type="button"
                class="group grid h-6 w-6 place-items-center p-0"
                :aria-pressed="preference === f"
                :aria-label="`Set ${f} theme`"
                @click="setFlavor(f)"
              >
                <span
                  class="h-4 w-4 border border-overlay-0/50 rounded-full transition-transform duration-250 ease-out group-hover:scale-118"
                  :class="preference === f ? 'scale-105 shadow-[0_0_0_2px_rgb(var(--crust)),0_0_0_3px_rgb(var(--text))]' : ''"
                  :style="{ background: ACCENT_PREVIEW[f] }"
                />
              </button>
            </div>

            <template #fallback>
              <button
                type="button"
                class="inline-flex items-center gap-[.5em] border border-surface-1/90 rounded-full bg-base/60 py-[.34rem] pl-[.55rem] pr-[.7rem] font-mono text-micro uppercase tracking-[.12em]"
                aria-hidden="true"
                tabindex="-1"
              >
                <span class="h-9px w-9px rounded-full bg-overlay-0" />
                <span class="min-w-[4.6em] text-left">&nbsp;</span>
              </button>
              <div class="hidden items-center gap-0 dots:inline-flex" aria-hidden="true">
                <span v-for="i in FLAVORS.length" :key="i" class="grid h-6 w-6 place-items-center">
                  <span class="h-4 w-4 border border-overlay-0/50 rounded-full bg-overlay-0/40" />
                </span>
              </div>
            </template>
          </ClientOnly>
        </div>

        <!-- Reka Dialog is client-only: DialogRoot crashes reka-ui's slot
             render during static prerender ("Cannot read 'ce' of null"). The
             mobile menu is JS-interactive anyway; the #fallback keeps a static
             hamburger in the prerendered HTML with no layout shift. -->
        <ClientOnly>
          <DialogRoot v-model:open="mobileOpen">
            <DialogTrigger
              class="icon-btn h-9 w-9 nav:hidden"
              aria-label="Open menu"
            >
              <span class="i-carbon-menu text-[1.35rem]" aria-hidden="true" />
            </DialogTrigger>

            <DialogPortal>
              <DialogOverlay class="dialog-overlay fixed inset-0 z-50 bg-crust/60 backdrop-blur-sm" />
              <DialogContent
                class="dialog-content fixed inset-x-4 top-[calc(var(--nav-h)+.75rem)] z-50 border border-[color:var(--hair-strong)] rounded-md bg-base p-6 shadow-[0_25px_50px_-12px_rgb(0_0_0/50%)]"
              >
                <DialogTitle class="sr-only">
                  Menu
                </DialogTitle>

                <div class="flex items-center justify-between">
                  <span class="font-mono text-micro uppercase tracking-[.2em] text-overlay-1">Menu</span>
                  <DialogClose
                    class="inline-flex h-8 w-8 items-center justify-center rounded text-text transition-colors duration-300 ease hover:text-mauve"
                    aria-label="Close menu"
                  >
                    <span class="i-carbon-close text-[1.1rem]" aria-hidden="true" />
                  </DialogClose>
                </div>

                <nav class="mt-6 flex flex-col gap-1" aria-label="Primary">
                  <NuxtLink
                    v-for="link in links"
                    :key="link.to"
                    :to="link.to"
                    class="border-b border-[color:var(--hair)] py-4 font-mono text-lead text-text transition-colors duration-300 ease last:border-b-0 hover:text-mauve"
                    @click="mobileOpen = false"
                  >
                    {{ link.label }}
                  </NuxtLink>
                </nav>

                <ClientOnly>
                  <div class="mt-6 flex items-center gap-[.3rem]" role="group" aria-label="Theme flavour">
                    <button
                      v-for="f in FLAVORS"
                      :key="f"
                      type="button"
                      class="group grid h-6 w-6 place-items-center p-0"
                      :aria-pressed="preference === f"
                      :aria-label="`Set ${f} theme`"
                      @click="setFlavor(f)"
                    >
                      <span
                        class="h-4 w-4 border border-overlay-0/50 rounded-full transition-transform duration-250 ease-out group-hover:scale-118"
                        :class="preference === f ? 'scale-105 shadow-[0_0_0_2px_rgb(var(--crust)),0_0_0_3px_rgb(var(--text))]' : ''"
                        :style="{ background: ACCENT_PREVIEW[f] }"
                      />
                    </button>
                  </div>
                </ClientOnly>
              </DialogContent>
            </DialogPortal>
          </DialogRoot>

          <template #fallback>
            <span class="icon-btn h-9 w-9 nav:hidden" aria-hidden="true">
              <span class="i-carbon-menu text-[1.35rem]" />
            </span>
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dialog-overlay[data-state='open'] { animation: header-fade .25s var(--ease-out); }
.dialog-overlay[data-state='closed'] { animation: header-fade .18s var(--ease) reverse; }
.dialog-content[data-state='open'] { animation: header-panel-in .3s var(--ease-out); }
.dialog-content[data-state='closed'] { animation: header-panel-out .18s var(--ease); }

@keyframes header-fade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes header-panel-in {
  from { opacity: 0; transform: translateY(-8px) scale(.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes header-panel-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-8px) scale(.98); }
}
</style>
