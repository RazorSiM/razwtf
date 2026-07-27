<script lang="ts" setup>
import type { NuxtError } from '#app'

// Branded, flavour-aware error page. Nuxt renders this OUTSIDE the normal
// layout (no AppHeader/Footer), so it is self-contained - but global main.css
// + the pre-paint data-flavor script still apply, so all 4 flavours resolve.
const props = defineProps<{ error: NuxtError }>()

// Copy comes from content/site.yml like every other surface. Verified to work
// here: Nuxt renders error.vue through the same Suspense boundary as a page, so
// the awaited query resolves before the branded page is sent.
const { data: site } = await useAsyncData('site-chrome-error', () => queryCollection('site').first())
const copy = computed(() => site.value?.error)

const code = computed(() => props.error?.statusCode ?? 500)
const isNotFound = computed(() => code.value === 404)
const heading = computed(() => (isNotFound.value ? copy.value?.notFoundHeading : copy.value?.genericHeading))
const detail = computed(() =>
  isNotFound.value ? copy.value?.notFoundDetail : props.error?.statusMessage || copy.value?.genericDetail,
)

useSeoMeta({
  title: () => `${code.value} · raz.wtf`,
  robots: 'noindex',
})

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <main class="grid min-h-screen place-items-center px-[var(--pad-x)] py-[clamp(3rem,8vw,6rem)]">
    <div class="w-full max-w-[46rem] text-center">
      <BrandWordmark to="/" size-class="text-[1.05rem]" class="mb-[clamp(2.5rem,6vw,4rem)]" @click="goHome" />

      <p class="kicker mb-6 justify-center"><span aria-hidden="true">→</span> {{ copy?.kicker }} · {{ code }}</p>

      <p class="display font-700 text-mauve text-[clamp(5rem,26vw,13rem)] leading-[.9]">
        {{ code }}
      </p>

      <h1 class="display text-h2 mt-4">
        {{ heading }}
      </h1>

      <p class="lead text-subtext-1 mx-auto mt-5 max-w-[42ch]">
        {{ detail }}
      </p>

      <div class="mt-[clamp(2rem,5vw,3rem)] flex flex-wrap items-center justify-center gap-4">
        <button type="button" class="btn-primary" @click="goHome">
          {{ copy?.homeCta }}
        </button>
        <NuxtLink to="/projects" class="backlink" @click="goHome">
          <span aria-hidden="true">↳</span> {{ copy?.workCta }}
        </NuxtLink>
      </div>
    </div>
  </main>
</template>
