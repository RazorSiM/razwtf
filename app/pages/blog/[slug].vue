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
const { data: page } = await useAsyncData(`post-${route.path}`, () => queryCollection('posts').path(route.path).first())

// Shared furniture labels + author identity (content/site.yml).
const { data: site } = await useAsyncData('site-chrome-post', () => queryCollection('site').first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Note not found', fatal: true })

// Related notes: all published posts minus the current one, ranked by shared-tag
// count (desc) then date (desc). When nothing shares a tag every score is 0 and
// the sort collapses to date-desc - i.e. the 3 most recent. Take 3.
const { data: allPosts } = await useAsyncData(`post-related-${route.path}`, () => queryCollection('posts').all())

const related = computed(() => {
  const currentTags = new Set(page.value?.tags ?? [])
  return (allPosts.value ?? [])
    .filter((p) => !p.draft && p.path !== route.path)
    .map((p) => ({
      post: p,
      shared: (p.tags ?? []).filter((t) => currentTags.has(t)).length,
    }))
    .toSorted((a, b) => b.shared - a.shared || +new Date(b.post.date) - +new Date(a.post.date))
    .slice(0, 3)
    .map((s) => s.post)
})

// TOC rail (h2/h3) straight from the parsed body; guard for undefined/empty.
const tocLinks = computed<TocLink[]>(() => {
  const links = (page.value?.body as { toc?: { links?: TocLink[] } })?.toc?.links
  return Array.isArray(links) ? links : []
})

// Breadcrumb leaf + a stable ISO date for the <time datetime> attribute
// (UTC-normalised so server and client agree - no hydration mismatch).
const slug = computed(() => route.path.split('/').findLast(Boolean) ?? '')
const isoDate = computed(() => {
  const d = new Date(page.value!.date)
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`
})

// Reading estimate from the rendered body - only surfaced when the body has
// real text and the estimate is a sane, finite number of minutes (≥ 1).
const readMinutes = computed(() => {
  const text = extractText(page.value?.body).trim()
  if (!text) return null
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
  if (!import.meta.client) return

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  function onScroll() {
    if (!reduce) {
      const doc = document.documentElement
      const max = doc.scrollHeight - doc.clientHeight || 1
      progress.value = Math.min(100, Math.max(0, (window.scrollY / max) * 100))
    }
    // scrollspy - last heading whose top has crossed the reading line
    const linePos = window.innerHeight * 0.28
    let current: string | null = null
    for (const link of tocLinks.value) {
      const el = document.getElementById(link.id)
      if (el && el.getBoundingClientRect().top - linePos <= 0) current = link.id
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
    <div class="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent" aria-hidden="true">
      <div class="from-mauve to-lavender h-full w-0 bg-gradient-to-r" :style="{ width: `${progress}%` }" />
    </div>

    <article class="pt-[clamp(2.5rem,6vw,4.5rem)]">
      <!-- Responsive grid: TOC rail + prose on lg, single column when there's no TOC. -->
      <div
        class="wrap grid grid-cols-1 gap-[clamp(2rem,5vw,3rem)] lg:items-start lg:gap-[clamp(2rem,4vw,3.25rem)]"
        :class="tocLinks.length ? 'lg:grid-cols-[190px_minmax(0,1fr)]' : 'lg:grid-cols-[minmax(0,1fr)]'"
      >
        <!-- ---- TOC rail (source-first so it precedes prose on mobile) ---- -->
        <aside v-if="tocLinks.length" v-reveal class="toc" :aria-label="site?.post.tocHeading">
          <p class="text-micro text-overlay-1 font-600 mb-4 font-mono tracking-[.22em] uppercase">
            {{ site?.post.tocHeading }}
          </p>
          <nav>
            <ol class="flex list-none flex-col gap-[.15rem]">
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
              <div class="mb-[clamp(1.6rem,4vw,2.4rem)] flex flex-wrap items-center justify-between gap-4">
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

            <KineticText
              as="h1"
              :balanced="false"
              class="font-display text-h1 text-text mt-[1.1rem] max-w-[16ch] leading-[1.02] font-[580] tracking-[-.022em] text-balance [font-optical-sizing:auto]"
            >
              {{ page.title }}
            </KineticText>

            <div v-reveal :style="{ '--rd': '.06s' }">
              <p
                v-if="page.description"
                class="font-display text-lead text-subtext-1 mt-[1.2rem] max-w-[54ch] leading-[1.42] font-[380] [font-optical-sizing:auto]"
              >
                {{ page.description }}
              </p>

              <!-- Dot-separated byline (bespoke, not a kit component) -->
              <div
                class="text-cap text-subtext-0 mt-[1.6rem] flex flex-wrap items-center gap-[.55rem_.85rem] border-t border-[color:var(--hair)] pt-[1.4rem] font-mono tracking-[.02em]"
              >
                <span
                  >{{ site?.post.bylinePrefix }} <b class="text-text font-600">{{ site?.author.name }}</b></span
                >
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
          <section
            v-reveal
            class="mt-[clamp(2.5rem,5vw,3.5rem)] flex items-start gap-[clamp(1rem,3vw,1.6rem)] border-t border-[color:var(--hair)] pt-[clamp(2rem,4vw,2.6rem)] pb-[clamp(2rem,4vw,2.6rem)]"
            :aria-label="site?.post.bioLabel"
          >
            <div
              class="bg-base font-display font-600 text-mauve grid h-[60px] w-[60px] flex-none place-items-center rounded-md border border-[color:var(--hair-strong)] text-[1.9rem] italic"
              aria-hidden="true"
            >
              {{ site?.author.monogram }}
            </div>
            <div>
              <p class="font-700 text-text font-mono tracking-[-.01em]">
                {{ site?.author.name }}
              </p>
              <p class="copy mt-2 max-w-[56ch]">
                {{ site?.author.bio }}
              </p>
              <div class="mt-[1.1rem] flex flex-wrap gap-2">
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

          <div class="foot:grid-cols-3 grid grid-cols-1 gap-[clamp(1.1rem,2vw,1.5rem)]">
            <NuxtLink
              v-for="(p, i) in related"
              :key="p.path"
              v-reveal
              class="group bg-base relative block overflow-hidden rounded-md border border-[color:var(--hair)] [transition:border-color_.4s_var(--ease),translate_.4s_var(--ease-out)] hover:-translate-y-[4px] hover:border-[color:rgb(var(--accent)/0.8)] motion-reduce:hover:translate-y-0"
              :to="p.path"
              :style="{ '--accent': `var(--${CARD_ACCENTS[i % CARD_ACCENTS.length]})`, '--rd': `${i * 0.06}s` }"
            >
              <!-- Accent bar wiping in from the left along the top edge. -->
              <span
                class="pointer-events-none absolute inset-x-0 top-0 z-2 h-[3px] origin-left scale-x-0 bg-[rgb(var(--accent))] transition-transform duration-500 ease-out group-hover:scale-x-100"
                aria-hidden="true"
              />
              <div class="flex min-h-full flex-col gap-[.7rem] p-[clamp(1.25rem,2.6vw,1.7rem)]">
                <span
                  class="text-micro text-subtext-0 inline-flex flex-wrap items-center gap-[.6em] font-mono tracking-[.1em]"
                >
                  <span class="swatch shrink-0 bg-[rgb(var(--accent))]" aria-hidden="true" />
                  {{ formatDate(new Date(p.date), 'yyyy · MM')
                  }}<template v-if="p.tags?.length"> · {{ p.tags.map((t) => `#${t}`).join(' ') }}</template>
                </span>
                <h3
                  class="font-display text-h3 text-text ease leading-[1.06] font-[560] tracking-[-.015em] transition-colors duration-300 [font-optical-sizing:auto] group-hover:text-[rgb(var(--accent))]"
                >
                  {{ p.title }}
                </h3>
                <p v-if="p.description" class="text-body text-subtext-1 leading-[1.6]">
                  {{ p.description }}
                </p>
                <!-- overlay-2, not overlay-1: at this size on bg-base overlay-1 is
                     4.27:1 (below AA). Same reasoning as WorkCard's meta row. -->
                <div
                  class="text-micro text-overlay-2 mt-auto flex items-center justify-between gap-4 pt-[.4rem] font-mono tracking-[.14em] uppercase"
                >
                  <span>note</span>
                  <span
                    class="text-subtext-0 [transition:translate_.3s_var(--ease-out),color_.3s_var(--ease)] group-hover:translate-x-[4px] group-hover:text-[rgb(var(--accent))] motion-reduce:group-hover:translate-x-0"
                    aria-hidden="true"
                    >read →</span
                  >
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
  border: 1px solid var(--hair);
  border-radius: var(--radius-md);
  background: rgb(var(--base) / 0.55);
  padding: 1.1rem 1.15rem;
}
@media (min-width: 1024px) {
  .toc {
    position: sticky;
    top: calc(var(--nav-h) + 24px);
    border: 0;
    background: none;
    padding: 0;
    border-left: 1px solid var(--hair);
    padding-left: 1.15rem;
  }
}
.toc a {
  display: flex;
  gap: 0.7em;
  align-items: baseline;
  font-family: var(--font-mono);
  font-size: var(--fs-sm);
  line-height: 1.4;
  color: rgb(var(--subtext0));
  padding: 0.4rem 0 0.4rem 0.55rem;
  border-left: 2px solid transparent;
  margin-left: -2px;
  transition:
    color 0.25s var(--ease),
    border-color 0.25s var(--ease);
}
/* --overlay1 (not overlay0): the counter was the one muted micro-label a step
   too dim (3.45:1 on the dark base - below AA); overlay1 matches every other
   muted label and clears 4.5:1 on mocha. */
.toc a .n {
  color: rgb(var(--overlay1));
  font-variant-numeric: tabular-nums;
  flex: none;
}
.toc a:hover {
  color: rgb(var(--text));
}
.toc a.is-active {
  color: rgb(var(--text));
  border-left-color: rgb(var(--mauve));
}
.toc a.is-active .n {
  color: rgb(var(--mauve));
}

/* ---------- prose tuning (:deep into ContentRenderer output) ---------- */
/* ContentRenderer wraps the body in an inner element, so the opening paragraph
   is `.prose > * > p:first-child`. Using :first-child (not :first-of-type)
   means the standfirst + drop-cap only fire when the body genuinely opens with
   a paragraph - never on a later <p> after a heading/blockquote/callout. */
.article-body :deep(.prose) {
  max-width: 68ch;
}
.article-body :deep(.prose h2) {
  scroll-margin-top: calc(var(--nav-h) + 24px);
}
.article-body :deep(.prose > * > p:first-child) {
  font-size: var(--fs-lead);
  color: rgb(var(--text));
  line-height: 1.6;
}
.article-body :deep(.prose > * > p:first-child::first-letter) {
  font-family: var(--font-display);
  font-weight: 600;
  color: rgb(var(--mauve));
  font-size: 3.1em;
  line-height: 0.78;
  float: left;
  padding: 0.05em 0.12em 0 0;
  margin-top: 0.02em;
}
.article-body :deep(.prose em) {
  color: rgb(var(--peach-ink));
}
</style>
