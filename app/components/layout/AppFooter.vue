<script lang="ts" setup>
// Footer - the one sanctioned terminal flourish: a shell-style status line.
// `flavor` (via useFlavor) and the live clock are both client-resolved values,
// so both segments render inside <ClientOnly> with a stable-width fallback to
// avoid a hydration mismatch (see build contract).
const { flavor } = useFlavor()

// Notes only appears once there's something published to read (raz-je5).
const hasPublishedPosts = await useHasPublishedPosts()

// Footer copy + link list (content/site.yml).
const { data: site } = await useAsyncData('site-chrome-footer', () => queryCollection('site').first())

// A link is shown unless it is gated on there being published posts.
const footerLinks = computed(() =>
  (site.value?.footer.links ?? []).filter((l) => !l.requiresPosts || hasPublishedPosts.value),
)

const clock = ref('--:--:--')
let clockTimer: ReturnType<typeof setInterval> | undefined

function updateClock() {
  clock.value = new Date().toLocaleTimeString('en-GB', {
    timeZone: 'Europe/Rome',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

onMounted(() => {
  updateClock()
  clockTimer = setInterval(updateClock, 1000)
})
onBeforeUnmount(() => {
  if (clockTimer) clearInterval(clockTimer)
})
</script>

<template>
  <footer class="border-surface-0/90 bg-mantle border-t">
    <div class="wrap">
      <div class="foot:grid-cols-[1.5fr_1fr_1fr] grid grid-cols-1 gap-8 pt-[clamp(3rem,6vw,5rem)] pb-9">
        <div>
          <BrandWordmark to="/" size-class="text-[1.35rem]" />
          <p class="text-body text-subtext-1 mt-4 max-w-[30ch]">
            {{ site?.footer.blurb }}
          </p>
        </div>

        <div>
          <h2 class="text-micro font-600 text-overlay-1 mb-4 font-mono tracking-[.2em] uppercase">
            {{ site?.footer.elsewhereHeading }}
          </h2>
          <ul class="flex flex-col gap-[.65rem]">
            <li v-for="s in CHIP_SOCIALS" :key="s.key">
              <a
                :href="s.url"
                :target="isExternal(s.url) ? '_blank' : undefined"
                :rel="isExternal(s.url) ? 'noopener' : undefined"
                class="link-footer"
                >{{ s.label }}</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h2 class="text-micro font-600 text-overlay-1 mb-4 font-mono tracking-[.2em] uppercase">
            {{ site?.footer.siteHeading }}
          </h2>
          <ul class="flex flex-col gap-[.65rem]">
            <li v-for="link in footerLinks" :key="link.to">
              <a v-if="isExternal(link.to)" :href="link.to" target="_blank" rel="noopener" class="link-footer">{{
                link.label
              }}</a>
              <NuxtLink v-else :to="link.to" class="link-footer">
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <div
        aria-hidden="true"
        class="footer-mark pt-[clamp(1.5rem,4vw,2.75rem)] pb-[clamp(1.2rem,3vw,2rem)] select-none"
      >
        raz<span class="dot">.</span>wtf
      </div>

      <div
        class="border-surface-0/90 bg-crust text-micro flex flex-wrap items-stretch overflow-hidden rounded border font-mono tracking-[.06em]"
        role="group"
        aria-label="Status line"
      >
        <span class="status-seg bg-mauve font-700 text-crust tracking-[.1em] uppercase">{{
          site?.footer.statusLine.mode
        }}</span>
        <span class="status-seg bg-surface-0/80 text-subtext-1">
          <span class="text-green" aria-hidden="true">✔</span> {{ site?.footer.statusLine.branch }}
        </span>
        <span class="status-seg text-overlay-1">{{ site?.footer.statusLine.path }}</span>
        <span class="min-w-0 flex-1" aria-hidden="true" />
        <ClientOnly>
          <span class="status-seg text-subtext-0">
            {{ site?.footer.statusLine.flavorLabel }}&nbsp;<b class="font-600 text-mauve capitalize">{{ flavor }}</b>
          </span>
          <template #fallback>
            <span class="status-seg text-subtext-0">
              {{ site?.footer.statusLine.flavorLabel }}&nbsp;<b class="font-600 text-mauve capitalize">----</b>
            </span>
          </template>
        </ClientOnly>
        <span class="status-seg text-overlay-1">{{ site?.footer.statusLine.coords }}</span>
        <ClientOnly>
          <span class="status-seg text-subtext-0 ml-auto tabular-nums">{{ clock }}</span>
          <template #fallback>
            <span class="status-seg text-subtext-0 ml-auto tabular-nums">--:--:--</span>
          </template>
        </ClientOnly>
      </div>

      <div
        class="text-micro text-overlay-1 flex flex-wrap justify-between gap-x-8 gap-y-[.7rem] pt-6 pb-[2.4rem] font-mono tracking-[.06em]"
      >
        <span>{{ site?.footer.colophon.left }}</span>
        <span>{{ site?.footer.colophon.right }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Big decorative wordmark echo - outlined text needs hand CSS (text-stroke
   has no UnoCSS utility here), so only this bit escapes the shortcut system. */
.footer-mark {
  font-family: var(--font-display);
  font-optical-sizing: auto;
  font-weight: 600;
  font-size: var(--fs-mark);
  line-height: 0.82;
  letter-spacing: -0.03em;
  color: transparent;
  -webkit-text-stroke: 1px rgb(var(--overlay0) / 0.5);
}

.footer-mark .dot {
  -webkit-text-fill-color: rgb(var(--mauve));
}
</style>
