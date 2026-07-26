<script lang="ts" setup>
definePageMeta({ layout: 'default' })

interface TocLink {
  id: string
  text: string
  depth: number
  children?: TocLink[]
}

const route = useRoute()

// Resolve one note by its route path.
const { data: page } = await useAsyncData(`post-${route.path}`, () =>
  queryCollection('posts').path(route.path).first())

// Shared furniture labels + author identity (content/site.yml).
const { data: site } = await useAsyncData('site-chrome-post', () =>
  queryCollection('site').first())

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Note not found', fatal: true })

// Related notes: all published posts minus the current one, ranked by shared-tag
// count (desc) then date (desc). When nothing shares a tag every score is 0 and
// the sort collapses to date-desc - i.e. the 3 most recent. Take 3.
const { data: allPosts } = await useAsyncData(`post-related-${route.path}`, () =>
  queryCollection('posts').all())

const related = computed(() => {
  const currentTags = new Set(page.value?.tags ?? [])
  return (allPosts.value ?? [])
    .filter(p => !p.draft && p.path !== route.path)
    .map(p => ({
      post: p,
      shared: (p.tags ?? []).filter(t => currentTags.has(t)).length,
    }))
    .sort((a, b) => b.shared - a.shared || +new Date(b.post.date) - +new Date(a.post.date))
    .slice(0, 3)
    .map(s => s.post)
})

// TOC rail (h2/h3) straight from the parsed body; guard for undefined/empty.
const tocLinks = computed<TocLink[]>(() => {
  const links = (page.value?.body as { toc?: { links?: TocLink[] } })?.toc?.links
  return Array.isArray(links) ? links : []
})

// Breadcrumb leaf + a stable ISO date for the <time datetime> attribute
// (UTC-normalised so server and client agree - no hydration mismatch).
const slug = computed(() => route.path.split('/').filter(Boolean).pop() ?? '')
const isoDate = computed(() => {
  const d = new Date(page.value!.date)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
})

// Reading estimate from the rendered body - only surfaced when the body has
// real text and the estimate is a sane, finite number of minutes (≥ 1).
const readMinutes = computed(() => {
  const text = extractText(page.value?.body).trim()
  if (!text)
    return null
  const mins = readingTime(text)
  return Number.isFinite(mins) && mins >= 1 ? mins : null
})

// Small accent sets that cycle across tag chips / related cards. Section
// numbers stay mauve; these are local flavour only.
const TAG_ACCENTS = ['mauve', 'blue', 'peach', 'green']
const CARD_ACCENTS = ['green', 'peach', 'blue']

// Reading-progress + TOC scrollspy - client-only, cleaned up on unmount by
// useEventListener, and progress is skipped under prefers-reduced-motion.
const progress = ref(0)
const activeId = ref<string | null>(null)

onMounted(() => {
  if (!import.meta.client)
    return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function onScroll() {
    if (!reduce) {
      const doc = document.documentElement
      const max = (doc.scrollHeight - doc.clientHeight) || 1
      progress.value = Math.min(100, Math.max(0, (window.scrollY / max) * 100))
    }
    // scrollspy - last heading whose top has crossed the reading line
    const linePos = window.innerHeight * 0.28
    let current: string | null = null
    for (const link of tocLinks.value) {
      const el = document.getElementById(link.id)
      if (el && el.getBoundingClientRect().top - linePos <= 0)
        current = link.id
    }
    activeId.value = current
  }

  onScroll()
  useEventListener('scroll', onScroll, { passive: true })
  useEventListener('resize', onScroll, { passive: true })
})

useSeoMeta({
  title: () => `${page.value?.title} · raz.wtf`,
  description: () => page.value?.description ?? '',
})
</script>

<template>
  <div v-if="page">
    <!-- reading-progress line (fixed, terminal-flavoured mauve→lavender fill) -->
    <div class="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent pointer-events-none" aria-hidden="true">
      <div class="h-full w-0 bg-gradient-to-r from-mauve to-lavender" :style="{ width: `${progress}%` }" />
    </div>

    <article class="pt-[clamp(2.5rem,6vw,4.5rem)]">
      <!-- Responsive grid: TOC rail + prose on lg, single column when there's no TOC. -->
      <div
        class="wrap grid grid-cols-1 gap-[clamp(2rem,5vw,3rem)] lg:items-start lg:gap-[clamp(2rem,4vw,3.25rem)]"
        :class="tocLinks.length ? 'lg:grid-cols-[190px_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(0,1fr)]'"
      >
        <!-- ---- TOC rail (source-first so it precedes prose on mobile) ---- -->
        <aside v-if="tocLinks.length" v-reveal class="toc" :aria-label="site?.post.tocHeading">
          <p class="font-mono text-micro tracking-[.22em] uppercase text-overlay-1 font-600 mb-4">
            {{ site?.post.tocHeading }}
          </p>
          <nav>
            <ol class="list-none flex flex-col gap-[.15rem]">
              <li v-for="(link, i) in tocLinks" :key="link.id">
                <a
                  :href="`#${link.id}`"
                  :class="{ 'is-active': activeId === link.id }"
                  :aria-current="activeId === link.id ? 'true' : undefined"
                >
                  <span class="n">{{ String(i + 1).padStart(2, '0') }}</span>
                  {{ link.text }}
                </a>
              </li>
            </ol>
          </nav>
        </aside>

        <!-- ---- article body ---- -->
        <div class="article-body">
          <header class="mb-[clamp(2.4rem,5vw,3.4rem)]">
            <div v-reveal>
              <div class="flex flex-wrap items-center justify-between gap-4 mb-[clamp(1.6rem,4vw,2.4rem)]">
                <BackLink to="/blog" :label="site?.post.backLabel ?? ''" />
                <TerminalPath prompt="raz@wtf" :segments="[{ label: '~/notes', to: '/blog' }]" :leaf="`${slug}.md`" />
              </div>

              <!-- Tag chips cycle a DIFFERENT accent per tag (--c) - TagList's single
                   `accent` can't reproduce this, so this row stays bespoke inline.
                   Each links to its /blog/tag/[tag] page (raz-paj). -->
              <div v-if="page.tags?.length" class="flex flex-wrap gap-[.55rem]" aria-label="Tags">
                <NuxtLink
                  v-for="(tag, i) in page.tags"
                  :key="tag"
                  :to="`/blog/tag/${slugifyTag(tag)}`"
                  class="chip-link"
                  :style="{ '--c': `var(--${TAG_ACCENTS[i % TAG_ACCENTS.length]})` }"
                >
                  <i class="swatch bg-[rgb(var(--c))]" aria-hidden="true" /> {{ tag }}
                </NuxtLink>
              </div>
            </div>

            <KineticText as="h1" :balanced="false" class="font-display [font-optical-sizing:auto] font-[580] text-h1 leading-[1.02] tracking-[-.022em] text-balance mt-[1.1rem] max-w-[16ch] text-text">
              {{ page.title }}
            </KineticText>

            <div v-reveal :style="{ '--rd': '.06s' }">
              <p v-if="page.description" class="font-display [font-optical-sizing:auto] font-[380] text-lead leading-[1.42] text-subtext-1 mt-[1.2rem] max-w-[54ch]">
                {{ page.description }}
              </p>

              <!-- Dot-separated byline (bespoke, not a kit component) -->
              <div class="flex flex-wrap items-center gap-[.55rem_.85rem] mt-[1.6rem] pt-[1.4rem] border-t border-[color:var(--hair)] font-mono text-cap tracking-[.02em] text-subtext-0">
                <span>{{ site?.post.bylinePrefix }} <b class="text-text font-600">{{ site?.author.name }}</b></span>
                <span class="dotsep" aria-hidden="true" />
                <time :datetime="isoDate" class="tabular-nums">{{ formatDate(new Date(page.date)) }}</time>
                <template v-if="readMinutes">
                  <span class="dotsep" aria-hidden="true" />
                  <span>{{ readMinutes }} {{ site?.post.readSuffix }}</span>
                </template>
              </div>
            </div>
          </header>

          <div class="prose">
            <ContentRenderer :value="page" />
          </div>

          <!-- ---- author bio ---- -->
          <section v-reveal class="flex items-start gap-[clamp(1rem,3vw,1.6rem)] mt-[clamp(2.5rem,5vw,3.5rem)] pt-[clamp(2rem,4vw,2.6rem)] pb-[clamp(2rem,4vw,2.6rem)] border-t border-[color:var(--hair)]" :aria-label="site?.post.bioLabel">
            <div class="flex-none grid place-items-center w-[60px] h-[60px] rounded-md border border-[color:var(--hair-strong)] bg-base font-display italic font-600 text-[1.9rem] text-mauve" aria-hidden="true">
              {{ site?.author.monogram }}
            </div>
            <div>
              <p class="font-mono font-700 text-text tracking-[-.01em]">
                {{ site?.author.name }}
              </p>
              <p class="copy max-w-[56ch] mt-2">
                {{ site?.author.bio }}
              </p>
              <div class="flex flex-wrap gap-2 mt-[1.1rem]">
                <a v-for="s in CHIP_SOCIALS" :key="s.key" class="chip" :href="s.url">{{ s.label }}</a>
              </div>
            </div>
          </section>
        </div>
      </div>

      <!-- ================= RELATED ================= -->
      <section v-if="related.length" class="section-y border-t border-[color:var(--hair)]" aria-labelledby="related-h">
        <div class="wrap">
          <!-- Kept inline (not <SectionMarker>) so #related-h stays on the label
               for the section's aria-labelledby. -->
          <div v-reveal class="secmark mb-[clamp(2.25rem,4.5vw,3.5rem)]">
            <span class="secmark-n">→</span>
            <span id="related-h" class="secmark-label">{{ site?.post.relatedLabel }}</span>
            <span class="secmark-rule" aria-hidden="true" />
            <span class="secmark-note">{{ site?.post.relatedNote }}</span>
          </div>

          <div class="grid grid-cols-1 gap-[clamp(1.1rem,2vw,1.5rem)] foot:grid-cols-3">
            <NuxtLink
              v-for="(p, i) in related"
              :key="p.path"
              v-reveal
              class="card--note"
              :to="p.path"
              :style="{ '--accent': `var(--${CARD_ACCENTS[i % CARD_ACCENTS.length]})`, '--rd': `${i * 0.06}s` }"
            >
              <span class="card__accentbar" aria-hidden="true" />
              <div class="card__body">
                <span class="card__kicker">
                  <span class="sw" aria-hidden="true" />
                  {{ formatDate(new Date(p.date), 'yyyy · MM') }}<template v-if="p.tags?.length"> · {{ p.tags.map(t => `#${t}`).join(' ') }}</template>
                </span>
                <h3 class="card__title">
                  {{ p.title }}
                </h3>
                <p v-if="p.description" class="card__desc">
                  {{ p.description }}
                </p>
                <div class="card__foot">
                  <span>note</span>
                  <span class="card__go" aria-hidden="true">read →</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </section>
    </article>
  </div>
</template>

<style scoped>
/* Only CSS that utilities can't express survives here (aggressive-inline pass):
   the sticky/scrollspy TOC rail, :deep() prose tuning inside ContentRenderer's
   generated DOM, and the related card's coordinated parent-hover (border /
   accentbar / title / arrow all driven by :hover on the card and threaded
   through a per-instance --accent). Everything else is inlined UnoCSS. All
   rgba(var(--token), A) written as rgb(var(--token) / A). */

/* ---------- table of contents (sticky rail on desktop, box on mobile) ---------- */
.toc {
  border: 1px solid var(--hair); border-radius: var(--radius-md);
  background: rgb(var(--base) / .55); padding: 1.1rem 1.15rem;
}
@media (min-width: 1024px) {
  .toc {
    position: sticky; top: calc(var(--nav-h) + 24px);
    border: 0; background: none; padding: 0;
    border-left: 1px solid var(--hair); padding-left: 1.15rem;
  }
}
.toc a {
  display: flex; gap: .7em; align-items: baseline;
  font-family: var(--font-mono); font-size: var(--fs-sm); line-height: 1.4;
  color: rgb(var(--subtext0)); padding: .4rem 0 .4rem .55rem;
  border-left: 2px solid transparent; margin-left: -2px;
  transition: color .25s var(--ease), border-color .25s var(--ease);
}
/* --overlay1 (not overlay0): the counter was the one muted micro-label a step
   too dim (3.45:1 on the dark base - below AA); overlay1 matches every other
   muted label and clears 4.5:1 on mocha. */
.toc a .n { color: rgb(var(--overlay1)); font-variant-numeric: tabular-nums; flex: none; }
.toc a:hover { color: rgb(var(--text)); }
.toc a.is-active { color: rgb(var(--text)); border-left-color: rgb(var(--mauve)); }
.toc a.is-active .n { color: rgb(var(--mauve)); }

/* ---------- prose tuning (:deep into ContentRenderer output) ---------- */
/* ContentRenderer wraps the body in an inner element, so the opening paragraph
   is `.prose > * > p:first-child`. Using :first-child (not :first-of-type)
   means the standfirst + drop-cap only fire when the body genuinely opens with
   a paragraph - never on a later <p> after a heading/blockquote/callout. */
.article-body :deep(.prose) { max-width: 68ch; }
.article-body :deep(.prose h2) { scroll-margin-top: calc(var(--nav-h) + 24px); }
.article-body :deep(.prose > * > p:first-child) {
  font-size: var(--fs-lead); color: rgb(var(--text)); line-height: 1.6;
}
.article-body :deep(.prose > * > p:first-child::first-letter) {
  font-family: var(--font-display); font-weight: 600; color: rgb(var(--mauve));
  font-size: 3.1em; line-height: .78; float: left;
  padding: .05em .12em 0 0; margin-top: .02em;
}
.article-body :deep(.prose em) { color: rgb(var(--peach-ink)); }

/* ---------- related posts (coordinated parent-hover, per-instance --accent) ---------- */
.card--note {
  --accent: var(--mauve);
  position: relative; display: block; text-decoration: none;
  background: rgb(var(--base)); border: 1px solid var(--hair);
  border-radius: var(--radius-md); overflow: hidden;
  transition: border-color .4s var(--ease), transform .4s var(--ease-out);
}
.card--note:hover { border-color: rgb(var(--accent) / .8); transform: translateY(-4px); }
.card__accentbar {
  position: absolute; left: 0; right: 0; top: 0; height: 3px; z-index: 2;
  background: rgb(var(--accent)); transform: scaleX(0); transform-origin: left;
  transition: transform .5s var(--ease-out);
}
.card--note:hover .card__accentbar { transform: scaleX(1); }
.card__body { padding: clamp(1.25rem, 2.6vw, 1.7rem); display: flex; flex-direction: column; gap: .7rem; min-height: 100%; }
.card__kicker {
  display: inline-flex; align-items: center; gap: .6em; flex-wrap: wrap;
  font-family: var(--font-mono); font-size: var(--fs-micro); letter-spacing: .1em;
  color: rgb(var(--subtext0));
}
.card__kicker .sw { width: 9px; height: 9px; border-radius: 2px; background: rgb(var(--accent)); flex: none; }
.card__title {
  font-family: var(--font-display); font-optical-sizing: auto; font-weight: 560;
  font-size: var(--fs-h3); letter-spacing: -.015em; line-height: 1.06;
  color: rgb(var(--text)); transition: color .3s var(--ease);
}
.card--note:hover .card__title { color: rgb(var(--accent)); }
.card__desc { font-size: var(--fs-body); color: rgb(var(--subtext1)); line-height: 1.6; }
.card__foot {
  margin-top: auto; padding-top: .4rem; display: flex; align-items: center;
  justify-content: space-between; gap: 1rem; font-family: var(--font-mono);
  font-size: var(--fs-micro); letter-spacing: .14em; text-transform: uppercase;
  color: rgb(var(--overlay1));
}
.card__go { color: rgb(var(--subtext0)); transition: transform .3s var(--ease-out), color .3s var(--ease); }
.card--note:hover .card__go { transform: translateX(4px); color: rgb(var(--accent)); }

@media (prefers-reduced-motion: reduce) {
  .card--note:hover { transform: none; }
}
</style>
