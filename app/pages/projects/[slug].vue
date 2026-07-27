<script lang="ts" setup>
definePageMeta({ layout: 'default' })

const route = useRoute()

// Resolve one project case study by its route path.
const { data: page } = await useAsyncData(`project-${route.path}`, () =>
  queryCollection('projects').path(route.path).first(),
)

// Shared case-study furniture labels (content/site.yml).
const { data: site } = await useAsyncData('site-chrome-project', () => queryCollection('site').first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })

// Previous / next project for the case-study footer nav.
const { data: surround } = await useAsyncData(`project-surround-${route.path}`, () =>
  queryCollectionItemSurroundings('projects', route.path, {
    fields: ['title', 'path', 'hero', 'accent'],
  }),
)

const prev = computed(() => surround.value?.[0] ?? null)
const next = computed(() => surround.value?.[1] ?? null)

// Signature accent → --accent. Section NUMBERS stay mauve (house accent); the
// project accent drives local highlights: eyebrow bar, hero corners/bar,
// gallery hover, tag dot, prev/next hover. Mirrors the home page helper.
function accentVar(p?: { accent?: string } | null) {
  return { '--accent': `var(--${p?.accent ?? 'mauve'})` }
}

// Breadcrumb leaf (~/ work / <slug>).
const slug = computed(() => route.path.split('/').filter(Boolean).pop() ?? '')

// Reading estimate from the rendered body - only surfaced when the body has
// real text and the estimate is a sane, finite number of minutes (≥ 1).
const readMinutes = computed(() => {
  const text = extractText(page.value?.body).trim()
  if (!text) return null
  const mins = readingTime(text)
  return Number.isFinite(mins) && mins >= 1 ? mins : null
})

// The Details block only renders when at least one row (or a link) has data.
const hasDetails = computed(() => {
  const p = page.value
  if (!p) return false
  return Boolean(p.date || p.role || p.type || p.collab || p.tech?.length || p.links?.length)
})

// Spec rows for <SpecList> - the same conditional fields the old <dl> rendered,
// collapsed to a typed array so only present rows appear.
const specRows = computed<{ label: string; value: string }[]>(() => {
  const p = page.value
  if (!p) return []
  const rows: { label: string; value: string }[] = []
  if (p.date) rows.push({ label: 'Released', value: formatDate(new Date(p.date)) })
  if (p.role) rows.push({ label: 'Role', value: p.role })
  if (p.type) rows.push({ label: 'Type', value: p.type })
  if (p.collab) rows.push({ label: 'Collab', value: p.collab })
  if (p.tech?.length) rows.push({ label: 'Stack', value: p.tech.join(' · ') })
  return rows
})

// Apply the per-project frontmatter head (og/twitter meta authored as
// { meta: [...] }), then the canonical title/description so the "- raz.wtf"
// title wins. (@nuxt/content v3 doesn't auto-import useContentHead here, and
// the raw head block is all we need.)
useHead(() => (page.value?.head as Record<string, unknown>) ?? {})
// The frontmatter head authors og/twitter images as site-relative paths; social
// crawlers need absolute URLs, so re-emit them absolute from the hero (this call
// runs after useHead, so it wins the meta dedupe on og:image/twitter:image).
const heroAbs = computed(() => {
  const h = page.value?.hero
  return h ? new URL(h, 'https://raz.wtf').href : undefined
})
useSeoMeta({
  title: () => `${page.value?.title} · raz.wtf`,
  description: () => page.value?.description,
  ogImage: heroAbs,
  twitterImage: heroAbs,
})
</script>

<template>
  <div v-if="page" :style="accentVar(page)">
    <!-- ================= PROJECT HERO ================= -->
    <article class="pt-[clamp(2rem,5vw,3.5rem)] pb-0" aria-labelledby="p-title">
      <div class="wrap">
        <div class="mb-[clamp(2rem,5vw,3.25rem)] flex flex-wrap items-center justify-between gap-4">
          <BackLink to="/projects" :label="site?.project.backLabel ?? ''" />
          <!-- Terminal breadcrumb kept bespoke: TerminalPath emits a `:` after the
               prompt (raz@wtf:~/…) and inverts the segment/leaf colours; this page's
               `~/work/<slug>` uses `/` throughout with the leaf brighter than the
               ancestor, so the exact roles are reproduced inline instead. -->
          <span class="text-cap text-overlay-1 font-mono tracking-[.02em]">
            <span class="text-[rgb(var(--accent))]">~/</span>work<span class="text-surface-2">/</span
            ><span class="text-subtext-0">{{ slug }}</span>
          </span>
        </div>

        <span class="eyebrow eyebrow-accent mb-[1.1rem]">{{ site?.project.eyebrow }}</span>

        <KineticText id="p-title" as="h1" class="display text-h1 max-w-[15ch]">
          {{ page.title }}
        </KineticText>

        <p
          v-if="page.description"
          class="text-lead text-subtext-1 mt-[clamp(1.1rem,3vw,1.6rem)] max-w-[54ch] leading-[1.5]"
        >
          {{ page.description }}
        </p>

        <dl
          class="mt-[clamp(1.8rem,4vw,2.5rem)] flex flex-wrap gap-0 border-y border-[color:var(--hair)]"
          aria-label="Project metadata"
        >
          <div v-if="page.date" class="metabar__i flex flex-col gap-[.4rem] py-4 pr-[clamp(1rem,2.4vw,1.6rem)] pl-0">
            <dt class="text-micro text-overlay-1 font-mono tracking-[.2em] uppercase">Released</dt>
            <dd class="text-subtext-1 font-mono text-sm tabular-nums">
              {{ formatDate(new Date(page.date)) }}
            </dd>
          </div>
          <div v-if="readMinutes" class="metabar__i flex flex-col gap-[.4rem] py-4 pr-[clamp(1rem,2.4vw,1.6rem)] pl-0">
            <dt class="text-micro text-overlay-1 font-mono tracking-[.2em] uppercase">Read</dt>
            <dd class="text-subtext-1 font-mono text-sm tabular-nums">{{ readMinutes }} min</dd>
          </div>
          <div v-if="page.role" class="metabar__i flex flex-col gap-[.4rem] py-4 pr-[clamp(1rem,2.4vw,1.6rem)] pl-0">
            <dt class="text-micro text-overlay-1 font-mono tracking-[.2em] uppercase">Role</dt>
            <dd class="text-subtext-1 font-mono text-sm tabular-nums">
              {{ page.role }}
            </dd>
          </div>
          <div v-if="page.type" class="metabar__i flex flex-col gap-[.4rem] py-4 pr-[clamp(1rem,2.4vw,1.6rem)] pl-0">
            <dt class="text-micro text-overlay-1 font-mono tracking-[.2em] uppercase">Type</dt>
            <dd class="text-subtext-1 font-mono text-sm tabular-nums">
              {{ page.type }}
            </dd>
          </div>
        </dl>

        <TagList
          v-if="page.tags?.length"
          class="mt-[clamp(1.4rem,3vw,1.9rem)]"
          :tags="page.tags"
          variant="chip"
          :accent="page.accent ?? 'mauve'"
          aria-label="Tags"
        />

        <figure v-if="page.hero ?? page.cover ?? page.image" v-reveal class="mt-[clamp(2.4rem,5vw,3.5rem)]">
          <span
            class="phero__media bg-mantle relative block overflow-hidden rounded-lg border border-[color:var(--hair)]"
          >
            <NuxtImg
              :src="page.hero ?? page.cover ?? page.image"
              :alt="page.heroCaption ?? page.title"
              :width="1200"
              :height="675"
              decoding="async"
            />
            <span class="corner c-tl" aria-hidden="true" />
            <span class="corner c-br" aria-hidden="true" />
            <span class="absolute right-0 bottom-0 left-0 h-[3px] bg-[rgb(var(--accent))]" aria-hidden="true" />
          </span>
          <figcaption class="text-micro text-overlay-1 mt-[.9rem] font-mono tracking-[.02em]">
            {{ page.heroCaption ?? page.title }}
          </figcaption>
        </figure>
      </div>
    </article>

    <!-- ================= 01 · OVERVIEW ================= -->
    <section class="section-y" :aria-label="site?.project.overview.label">
      <div class="wrap">
        <SectionMarker
          v-reveal
          class="mb-[clamp(2.25rem,4.5vw,3.5rem)]"
          n="01"
          :label="site?.project.overview.label ?? ''"
          :note="site?.project.overview.note"
        />

        <!-- Reading column kept inline (not ProseDocument): this measure sits INSIDE
             the section's .wrap, so ProseDocument's wrap-read px-[var(--pad-x)] would
             double-pad and narrow the 760px prose column. Here it's max-width + auto
             margins only, exactly like the old .read. -->
        <div v-reveal class="mx-auto max-w-[var(--measure-wide)]">
          <div class="prose max-w-none">
            <ContentRenderer :value="page" />
          </div>
        </div>
      </div>
    </section>

    <!-- ================= 02 · GALLERY ================= -->
    <section v-if="page.gallery?.length" class="section-y" :aria-label="site?.project.gallery.label">
      <div class="wrap">
        <SectionMarker
          v-reveal
          class="mb-[clamp(2.25rem,4.5vw,3.5rem)]"
          n="02"
          :label="site?.project.gallery.label ?? ''"
          :note="site?.project.gallery.note"
        />

        <div :style="accentVar(page)">
          <ProjectGallery :groups="page.gallery" />
        </div>
      </div>
    </section>

    <!-- ================= 03 · DETAILS ================= -->
    <section v-if="hasDetails" class="section-y" :aria-label="site?.project.details.label">
      <div class="wrap">
        <SectionMarker
          v-reveal
          class="mb-[clamp(2.25rem,4.5vw,3.5rem)]"
          n="03"
          :label="site?.project.details.label ?? ''"
          :note="site?.project.details.note"
        />

        <div v-reveal class="mx-auto max-w-[var(--measure-wide)]">
          <SpecList :rows="specRows" class="mt-[clamp(1.6rem,3.5vw,2.2rem)]" />

          <div v-if="page.links?.length" class="mt-[clamp(1.8rem,4vw,2.4rem)] flex flex-wrap gap-4">
            <a
              v-for="link in page.links"
              :key="link.url"
              class="btn-ghost"
              :href="link.url"
              target="_blank"
              rel="noopener noreferrer"
            >
              {{ link.label ?? link.url }} <span class="arw" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- ================= PREV / NEXT ================= -->
    <PrevNextNav :prev="prev" :next="next" />
  </div>
</template>

<style scoped>
/* Case-study (hybrid) layout. KEEP-AS-CSS only - everything static was inlined
   as UnoCSS utilities in the template; the project accent (--accent) is set
   inline on the page root via accentVar(page) and inherits into these rules. */

/* Sibling combinator - the divider gutter between metadata cells (a + b can't
   be expressed as a utility). */
.metabar__i + .metabar__i {
  padding-left: clamp(1rem, 2.4vw, 1.6rem);
  border-left: 1px solid var(--hair-soft);
}

/* Content-bearing pseudo-element: the accent tick before the case-study eyebrow
   (first flex child, spaced by the eyebrow shortcut's gap). */
.eyebrow-accent::before {
  content: '';
  width: 26px;
  height: 1px;
  background: rgb(var(--accent));
}

/* Bespoke hero frame chrome (kept per workstream). :deep reaches the NuxtImg-
   generated <img> for the cover crop; the corner brackets are absolutely
   positioned decorations reading the project --accent. */
.phero__media :deep(img) {
  width: 100%;
  height: auto;
  display: block;
  aspect-ratio: 16 / 9;
  object-fit: cover;
}
.phero__media .corner {
  position: absolute;
  width: 22px;
  height: 22px;
  border: 1.5px solid rgb(var(--accent));
  pointer-events: none;
}
.phero__media .c-tl {
  top: 14px;
  left: 14px;
  border-right: 0;
  border-bottom: 0;
}
.phero__media .c-br {
  bottom: 14px;
  right: 14px;
  border-left: 0;
  border-top: 0;
}
</style>
