<script lang="ts" setup>
definePageMeta({ layout: 'default' })

// --- Copy: every visitor-facing string on this page lives in
// content/index.md (raz-edg). This component owns which sections exist, their
// order and their layout; it owns none of the words. ---
const { data: home } = await useAsyncData('home-copy', () =>
  queryCollection('home').first())

if (!home.value) {
  throw createError({
    statusCode: 500,
    statusMessage: 'content/index.md is missing or failed to parse',
    fatal: true,
  })
}

// --- Content: projects (work grid + spotlight) and latest notes ---
const { data: projectData } = await useAsyncData('home-projects', () =>
  queryCollection('projects').all())
const { data: postData } = await useAsyncData('home-notes', () =>
  queryCollection('posts').order('date', 'DESC').all())

const projects = computed(() =>
  [...(projectData.value ?? [])].sort((a, b) =>
    (a.order ?? 99) - (b.order ?? 99)
    || +new Date(b.date) - +new Date(a.date)))

const featured = computed(() => projects.value.find(p => p.featured) ?? projects.value[0])
// Pinned to a project explicitly flagged `spotlight: true`. Its copy travels
// with the project (`spotlightCopy`), so the section only renders when both the
// flag and the copy are present; moving the flag can't strand the old prose.
const spotlight = computed(() => projects.value.find(p => p.spotlight))
const spotCopy = computed(() => spotlight.value?.spotlightCopy)

// Featured card first, then the next two, for the work grid.
const workCards = computed(() => {
  const feat = featured.value
  if (!feat)
    return projects.value.slice(0, 3)
  return [feat, ...projects.value.filter(p => p.path !== feat.path)].slice(0, 3)
})

const notes = computed(() => (postData.value ?? []).filter(p => !p.draft).slice(0, 3))
const spotThumbs = computed(() => (spotlight.value?.gallery ?? []).flatMap(g => g.images ?? []).slice(0, 3))

// Year and Role are derived from the project's own fields so they can't drift
// from it; everything after comes from the project's `spotlightCopy.specs`.
const spotRows = computed(() => [
  { label: 'Year', value: String(spotlight.value?.year ?? '') },
  { label: 'Role', value: spotlight.value?.role ?? '' },
  ...(spotCopy.value?.specs ?? []),
])

function accentVar(p?: { accent?: string }) {
  return { '--accent': `var(--${p?.accent ?? 'mauve'})` }
}

useSeoMeta({
  title: () => home.value?.seo?.title ?? home.value?.title,
  description: () => home.value?.seo?.description ?? home.value?.description,
})
</script>

<template>
  <div v-if="home">
    <!-- ================= 00 · HERO ================= -->
    <section class="hero relative overflow-hidden pt-[clamp(2rem,5vw,3.5rem)]" aria-labelledby="hero-title">
      <div class="wrap flex flex-col items-center text-center">
        <span class="eyebrow justify-center before:hidden">{{ home.hero.eyebrow }}</span>

        <ClientOnly>
          <HeroAsciiLogo class="my-[clamp(1.1rem,3vw,2rem)]" />
          <template #fallback>
            <div class="my-[clamp(1.1rem,3vw,2rem)] aspect-square w-full max-w-[560px] rounded-full" />
          </template>
        </ClientOnly>

        <KineticText id="hero-title" as="h1" fill mode="letters" class="wordmark inline-flex items-center justify-center font-mono font-700 leading-none tracking-[.01em] text-text">
          raz<span class="text-mauve">.</span>wtf<span class="cursor" aria-hidden="true" />
        </KineticText>

        <p class="tagline mt-4 font-display text-[clamp(1.35rem,3.6vw,2rem)] font-[460] leading-[1.15] text-text">
          {{ home.hero.taglineBefore }} <span class="amp">&amp;</span> {{ home.hero.taglineAfter }}
        </p>

        <p class="mt-[clamp(1.2rem,3vw,1.7rem)] max-w-[50ch] text-lead leading-[1.55] text-subtext-1">
          {{ home.hero.lead }}
        </p>

        <div class="mt-[clamp(1.7rem,4vw,2.3rem)] flex flex-wrap justify-center gap-4">
          <a :href="home.hero.primaryCta.to" class="btn-primary">
            {{ home.hero.primaryCta.label }} <span class="arw" aria-hidden="true">↓</span>
          </a>
          <NuxtLink :to="home.hero.secondaryCta.to" class="btn-ghost">
            {{ home.hero.secondaryCta.label }}
          </NuxtLink>
        </div>

        <p class="mt-[clamp(1.5rem,3vw,2rem)] inline-flex items-center gap-[.6em] font-mono text-cap tracking-[.02em] text-subtext-0">
          <span class="pulse" aria-hidden="true" /> {{ home.hero.status }}
        </p>
      </div>

      <!-- capabilities strip -->
      <div class="mt-[clamp(3rem,7vw,5.5rem)] border-y border-[color:var(--hair)]" aria-label="Capabilities">
        <div class="wrap">
          <div class="grid grid-cols-1 caps:grid-cols-3">
            <div
              v-for="(cap, i) in home.capabilities"
              :key="cap.label"
              v-reveal
              class="py-[clamp(1.4rem,3vw,2.1rem)] border-t border-[color:var(--hair-soft)] first:border-t-0 caps:border-t-0 caps:border-l caps:pl-[clamp(1.3rem,2.5vw,2rem)] caps:pr-4 caps:first:border-l-0 caps:first:pl-0"
              :style="{ '--rd': `${i * 0.08}s` }"
            >
              <div class="font-mono text-micro text-mauve tracking-[.2em] uppercase">
                {{ cap.label }}
              </div>
              <div class="mt-[.55rem] max-w-[34ch] text-body text-subtext-1">
                {{ cap.body }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 01 · WORK ================= -->
    <section id="work" class="section-y scroll-mt-[calc(var(--nav-h)+14px)]" aria-labelledby="work-h">
      <div class="wrap">
        <SectionMarker v-reveal class="mb-[clamp(2.25rem,4.5vw,3.5rem)]" n="01" :label="home.work.marker" :note="home.work.note" />

        <div class="mb-[clamp(2rem,4vw,3rem)] max-w-[60ch]">
          <KineticText id="work-h" as="h2" class="display text-h2">
            {{ home.work.heading }}
          </KineticText>
          <p v-reveal class="lead mt-4" :style="{ '--rd': '.12s' }">
            {{ home.work.lead }}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-[clamp(1.1rem,2vw,1.6rem)] wide:grid-cols-2">
          <WorkCard
            v-for="(p, i) in workCards"
            :key="p.path"
            v-reveal
            :project="p"
            :featured="i === 0 && !!p.featured"
            :style="{ '--rd': `${i * 0.08}s` }"
          />
        </div>
      </div>
    </section>

    <!-- ================= 02 · SPOTLIGHT ================= -->
    <section v-if="spotlight && spotCopy" id="spotlight" class="section-y scroll-mt-[calc(var(--nav-h)+14px)]" aria-labelledby="spot-h" :style="accentVar(spotlight)">
      <div class="wrap">
        <SectionMarker v-reveal class="mb-[clamp(2.25rem,4.5vw,3.5rem)]" n="02" :label="home.spotlight.marker" :note="home.spotlight.note" />

        <div class="grid gap-[clamp(1.6rem,3.5vw,2.75rem)] grid-cols-1 spot:grid-cols-[minmax(0,1.12fr)_minmax(0,.88fr)] spot:items-start">
          <div v-reveal>
            <MediaFrame ratio="16/11">
              <NuxtImg :src="spotlight.hero ?? spotlight.cover ?? spotlight.image" :alt="spotlight.title" loading="lazy" decoding="async" width="760" height="522" />
              <span class="absolute top-[10px] left-[10px] w-4 h-4 border-t border-l border-green" aria-hidden="true" />
              <span class="absolute bottom-[10px] right-[10px] w-4 h-4 border-b border-r border-green" aria-hidden="true" />
            </MediaFrame>
            <div v-if="spotThumbs.length" class="grid grid-cols-3 gap-[.6rem] mt-[.65rem]">
              <div v-for="img in spotThumbs" :key="img.src" class="spot-thumb aspect-[4/3] overflow-hidden rounded-sm bg-mantle border border-[color:var(--hair)]">
                <NuxtImg :src="img.src" :alt="img.alt ?? spotlight.title" loading="lazy" decoding="async" width="220" height="165" />
              </div>
            </div>
          </div>

          <div class="flex flex-col">
            <span v-reveal class="kicker"><span class="text-[rgb(var(--green-ink))] font-700">{{ spotlight.title.split(' ')[0] }}</span> {{ spotlight.title.split(' ').slice(1).join(' ') }} · {{ spotlight.year }}</span>
            <KineticText id="spot-h" as="h2" class="font-display [font-optical-sizing:auto] font-[560] text-h2 leading-[1.02] tracking-[-.02em] mt-[.6rem]">
              {{ spotCopy.heading }}
            </KineticText>
            <div v-reveal :style="{ '--rd': '.08s' }">
              <blockquote class="pullquote border-green mt-6">
                {{ spotCopy.pullquote }}
                <cite class="cite-line tracking-[.14em] mt-[.7rem]">{{ spotCopy.pullquoteCite }}</cite>
              </blockquote>
              <!-- Markdown so the set names keep their italic peach emphasis.
                   The scope-carrying wrapper is required: <MDC>'s own root does
                   not inherit this component's data-v attribute, so a
                   `.spot-copy :deep(em)` rule placed directly on it never
                   matches. -->
              <div class="spot-copy">
                <MDC tag="p" class="copy mt-[1.3rem] max-w-[54ch]" :value="spotCopy.body" unwrap="p" />
              </div>
              <div class="flex flex-wrap gap-[.6rem] mt-6" aria-label="Colour palette">
                <span
                  v-for="swatch in spotCopy.palette"
                  :key="swatch.token"
                  class="chip"
                  :style="{ '--c': `var(--${swatch.token})` }"
                >
                  <i class="swatch bg-[rgb(var(--c))]" aria-hidden="true" /> {{ swatch.label }}
                </span>
              </div>
              <SpecList class="mt-[1.6rem]" :rows="spotRows" />
              <div class="mt-[1.6rem]">
                <NuxtLink :to="spotlight.path" class="link-cta">
                  {{ home.spotlight.cta }} <span class="arw" aria-hidden="true">→</span>
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 03 · ABOUT ================= -->
    <section id="about" class="section-y scroll-mt-[calc(var(--nav-h)+14px)]" aria-labelledby="about-h">
      <div class="wrap">
        <SectionMarker v-reveal class="mb-[clamp(2.25rem,4.5vw,3.5rem)]" n="03" :label="home.about.marker" :note="home.about.note" />

        <div class="grid grid-cols-1 gap-[clamp(2rem,4vw,3.25rem)] wide:grid-cols-[1.05fr_.95fr] wide:items-start">
          <div>
            <KineticText id="about-h" as="h2" class="display text-h2">
              {{ home.about.headingBefore }} <em class="italic text-[rgb(var(--peach-ink))]">{{ home.about.headingEm }}</em>{{ home.about.headingAfter }}
            </KineticText>
            <div v-reveal :style="{ '--rd': '.06s' }">
              <!-- The two paragraphs are the markdown body of content/index.md. -->
              <div class="home-copy copy">
                <ContentRenderer :value="home" />
              </div>
              <blockquote class="border-l-2 border-mauve pl-[1.2rem] mt-[1.7rem]">
                <q class="font-display italic font-[420] text-h3 [quotes:none] leading-[1.2] text-text">{{ home.about.quote }}</q>
                <cite class="block not-italic font-mono text-micro tracking-[.06em] text-overlay-1 mt-[.7rem]">{{ home.about.quoteCite }}</cite>
              </blockquote>
              <div class="mt-[1.6rem] flex flex-wrap gap-[.6rem]">
                <a v-for="s in CHIP_SOCIALS" :key="s.key" class="chip" :href="s.url">{{ s.label }}</a>
              </div>
              <div class="mt-8">
                <NuxtLink to="/about" class="link-cta">
                  {{ home.about.cta }} <span class="arw" aria-hidden="true">→</span>
                </NuxtLink>
              </div>
            </div>
          </div>

          <aside v-reveal class="flex flex-col gap-[1.2rem]" :style="{ '--rd': '.1s' }">
            <MediaFrame ratio="4/3">
              <NuxtImg :src="home.about.aside.image" :alt="home.about.aside.alt" loading="lazy" decoding="async" width="520" height="390" />
            </MediaFrame>
            <p class="font-mono text-micro leading-[1.55] text-overlay-1">
              {{ home.about.aside.caption }}
            </p>
            <div class="flex flex-wrap gap-[.5rem]" aria-label="Stack &amp; interests">
              <span v-for="chip in home.about.aside.chips" :key="chip" class="chip">{{ chip }}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <!-- ================= 04 · NOTES ================= -->
    <!-- Hidden entirely with zero published posts, not hardcoded (raz-je5). -->
    <section v-if="notes.length" id="notes" class="section-y scroll-mt-[calc(var(--nav-h)+14px)]" aria-labelledby="notes-h">
      <div class="wrap">
        <SectionMarker v-reveal class="mb-[clamp(2.25rem,4.5vw,3.5rem)]" n="04" :label="home.notes.marker" :note="home.notes.note" />

        <div class="mb-[clamp(2rem,4vw,3rem)] max-w-[60ch]">
          <KineticText id="notes-h" as="h2" class="display text-h2">
            {{ home.notes.heading }}
          </KineticText>
        </div>

        <div class="border-t border-[color:var(--hair)]">
          <NoteListRow
            v-for="(n, i) in notes"
            :key="n.path"
            v-reveal
            :style="{ '--rd': `${i * 0.06}s` }"
            as="h3"
            :to="n.path"
            :title="n.title"
            :description="n.description"
            :date="n.date"
            :tags="n.tags"
          />
        </div>

        <div v-reveal class="mt-8">
          <NuxtLink to="/blog" class="link-cta">
            {{ home.notes.cta }} <span class="arw" aria-hidden="true">→</span>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Home-only composition + effects (page-scoped, minimal). Shared atoms
   (secmark/btn/chip/eyebrow/display/lead/wrap/kicker/copy/pullquote/cite-line/
   swatch) come from UnoCSS shortcuts; the work cards, spec table, media frames
   and note rows are now the shared UI-kit components. What stays below can't be
   expressed as utilities: @keyframes, :deep() into slotted NuxtImg <img>, and
   :deep() into markdown rendered from content/index.md. */

/* hero flourishes (bespoke - deliberately kept out of the kit) */
.wordmark .cursor {
  display: inline-block; width: .14em; height: .92em; margin-left: .14ch;
  background: rgb(var(--mauve)); border-radius: 1px;
  animation: caret 1.05s steps(1) infinite;
}
@keyframes caret { 50% { opacity: 0; } }
.tagline .amp { font-style: italic; font-weight: 420; color: rgb(var(--peach)); padding-inline: .06em; }
.pulse {
  width: 8px; height: 8px; border-radius: 50%; background: rgb(var(--green));
  box-shadow: 0 0 0 0 rgb(var(--green) / .6); animation: pulse 2.6s var(--ease) infinite;
}
@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgb(var(--green) / .5); }
  70% { box-shadow: 0 0 0 9px rgb(var(--green) / 0); }
  100% { box-shadow: 0 0 0 0 rgb(var(--green) / 0); }
}

/* About prose, rendered from the markdown body. The wrapper carries `.copy`
   so size/colour/leading inherit; only the per-paragraph rhythm, measure and
   <strong> treatment need restating, matching the markup this replaced. */
.home-copy :deep(p) { margin-top: 1.1rem; max-width: 52ch; }
.home-copy :deep(strong) { color: rgb(var(--text)); font-weight: 700; }

/* Spotlight paragraph comes from project frontmatter as markdown. */
.spot-copy :deep(em) { font-style: italic; color: rgb(var(--peach-ink)); }

/* spotlight thumbnails - :deep into the slotted NuxtImg <img> for cover-crop +
   the self-hover zoom/saturate (per-thumb :hover, not group-hover, so it can't
   ride MediaFrame's group-driven zoom). */
.spot-thumb :deep(img) { width: 100%; height: 100%; object-fit: cover; filter: saturate(.95); transition: transform .5s var(--ease-out), filter .4s var(--ease); }
.spot-thumb:hover :deep(img) { transform: scale(1.06); filter: saturate(1.08); }
</style>
