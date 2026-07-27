<script lang="ts" setup>
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from 'reka-ui'

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
const ACCENT_PREVIEW: Record<(typeof FLAVORS)[number], string> = {
  latte: 'rgb(136 57 239)',
  frappe: 'rgb(202 158 230)',
  macchiato: 'rgb(198 160 246)',
  mocha: 'rgb(203 166 247)',
}

const mobileOpen = ref(false)
</script>

<template>
  <header
    class="ease sticky top-0 z-50 flex h-[var(--nav-h)] items-center border-b transition-all duration-400"
    :class="
      scrolled
        ? 'bg-crust/72 backdrop-blur-14px border-[color:var(--hair)] backdrop-saturate-[1.15]'
        : 'border-transparent bg-transparent'
    "
  >
    <div class="wrap flex items-center justify-between gap-5">
      <BrandWordmark to="/" interactive-dot aria-label="raz.wtf home" />

      <nav class="nav:flex hidden items-center gap-[clamp(1rem,2.4vw,2.1rem)]" aria-label="Primary">
        <NuxtLink
          v-for="link in links"
          :key="link.to"
          :to="link.to"
          class="group py-5px text-micro text-subtext-0 ease hover:text-text relative font-mono tracking-[.14em] uppercase transition-colors duration-300"
        >
          {{ link.label }}
          <span
            aria-hidden="true"
            class="h-1px bg-mauve absolute inset-x-0 bottom-0 origin-left scale-x-0 transition-transform duration-400 ease-out group-hover:scale-x-100"
          />
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-3">
        <div class="flex items-center gap-[.6rem]" role="group" aria-label="Theme flavour">
          <ClientOnly>
            <button
              type="button"
              class="border-surface-1/90 bg-base/60 text-micro ease hover:border-mauve inline-flex items-center gap-[.5em] rounded-full border py-[.34rem] pr-[.7rem] pl-[.55rem] font-mono tracking-[.12em] uppercase transition-colors duration-300 active:scale-97"
              :aria-label="`Cycle theme flavour, currently ${preference}`"
              @click="cycle()"
            >
              <span
                aria-hidden="true"
                class="h-9px w-9px bg-mauve rounded-full shadow-[0_0_0_3px_rgb(var(--mauve)/0.18)]"
              />
              <span class="min-w-[4.6em] text-left">{{ preference }}</span>
            </button>

            <!-- 24px hit target (WCAG 2.5.8) around a 16px visual dot. -->
            <div class="dots:inline-flex hidden items-center gap-0">
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
                  class="border-overlay-0/50 h-4 w-4 rounded-full border transition-transform duration-250 ease-out group-hover:scale-118"
                  :class="
                    preference === f ? 'scale-105 shadow-[0_0_0_2px_rgb(var(--crust)),0_0_0_3px_rgb(var(--text))]' : ''
                  "
                  :style="{ background: ACCENT_PREVIEW[f] }"
                />
              </button>
            </div>

            <template #fallback>
              <!-- False positive: the rule's own help text prescribes tabindex="-1"
                   as the remedy, then flags the element anyway. Verified against
                   vize 0.291 with a minimal case: a <button> carrying both
                   aria-hidden and tabindex="-1" reports identically to one with
                   no tabindex at all. This placeholder is inert by design. -->
              <!-- eslint-disable-next-line a11y/no-aria-hidden-on-focusable -->
              <button
                type="button"
                class="border-surface-1/90 bg-base/60 text-micro inline-flex items-center gap-[.5em] rounded-full border py-[.34rem] pr-[.7rem] pl-[.55rem] font-mono tracking-[.12em] uppercase"
                aria-hidden="true"
                tabindex="-1"
              >
                <span class="h-9px w-9px bg-overlay-0 rounded-full" />
                <span class="min-w-[4.6em] text-left">&nbsp;</span>
              </button>
              <div class="dots:inline-flex hidden items-center gap-0" aria-hidden="true">
                <span v-for="i in FLAVORS.length" :key="i" class="grid h-6 w-6 place-items-center">
                  <span class="border-overlay-0/50 bg-overlay-0/40 h-4 w-4 rounded-full border" />
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
            <DialogTrigger class="icon-btn nav:hidden h-9 w-9" aria-label="Open menu">
              <span class="i-carbon-menu text-[1.35rem]" aria-hidden="true" />
            </DialogTrigger>

            <DialogPortal>
              <DialogOverlay class="dialog-overlay bg-crust/60 fixed inset-0 z-50 backdrop-blur-sm" />
              <DialogContent
                class="dialog-content bg-base fixed inset-x-4 top-[calc(var(--nav-h)+.75rem)] z-50 rounded-md border border-[color:var(--hair-strong)] p-6 shadow-[0_25px_50px_-12px_rgb(0_0_0/50%)]"
              >
                <DialogTitle class="sr-only"> Menu </DialogTitle>

                <div class="flex items-center justify-between">
                  <span class="text-micro text-overlay-1 font-mono tracking-[.2em] uppercase">Menu</span>
                  <DialogClose
                    class="text-text ease hover:text-mauve inline-flex h-8 w-8 items-center justify-center rounded transition-colors duration-300"
                    aria-label="Close menu"
                  >
                    <span class="i-carbon-close text-[1.1rem]" aria-hidden="true" />
                  </DialogClose>
                </div>

                <!-- Labelled "Mobile", not "Primary": the desktop nav above carries
                     that name. The two are mutually exclusive at any viewport (the
                     desktop one is display:none below the `nav:` breakpoint, so it
                     leaves the a11y tree), but distinct landmark names stay
                     unambiguous even if the responsive CSS never applies. -->
                <nav class="mt-6 flex flex-col gap-1" aria-label="Mobile">
                  <NuxtLink
                    v-for="link in links"
                    :key="link.to"
                    :to="link.to"
                    class="text-lead text-text ease hover:text-mauve border-b border-[color:var(--hair)] py-4 font-mono transition-colors duration-300 last:border-b-0"
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
                        class="border-overlay-0/50 h-4 w-4 rounded-full border transition-transform duration-250 ease-out group-hover:scale-118"
                        :class="
                          preference === f
                            ? 'scale-105 shadow-[0_0_0_2px_rgb(var(--crust)),0_0_0_3px_rgb(var(--text))]'
                            : ''
                        "
                        :style="{ background: ACCENT_PREVIEW[f] }"
                      />
                    </button>
                  </div>
                </ClientOnly>
              </DialogContent>
            </DialogPortal>
          </DialogRoot>

          <template #fallback>
            <span class="icon-btn nav:hidden h-9 w-9" aria-hidden="true">
              <span class="i-carbon-menu text-[1.35rem]" />
            </span>
          </template>
        </ClientOnly>
      </div>
    </div>
  </header>
</template>

<style scoped>
.dialog-overlay[data-state='open'] {
  animation: header-fade 0.25s var(--ease-out);
}
.dialog-overlay[data-state='closed'] {
  animation: header-fade 0.18s var(--ease) reverse;
}
.dialog-content[data-state='open'] {
  animation: header-panel-in 0.3s var(--ease-out);
}
.dialog-content[data-state='closed'] {
  animation: header-panel-out 0.18s var(--ease);
}

@keyframes header-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes header-panel-in {
  from {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
@keyframes header-panel-out {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-8px) scale(0.98);
  }
}
</style>
