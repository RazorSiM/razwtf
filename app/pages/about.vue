<script lang="ts" setup>
definePageMeta({ layout: 'default' })

// Dedicated /about page - takes precedence over the [...slug].vue catch-all.
// Editorial masthead (monogram + name + role + socials) then the Q&A "story"
// rendered from content/about.md via <ContentRenderer>. Every string on the
// page comes from that file's frontmatter or body (raz-edg).
const { data: page } = await useAsyncData('about', () =>
  queryCollection('about').first())
const { data: site } = await useAsyncData('site-chrome-about', () =>
  queryCollection('site').first())

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

useSeoMeta({
  title: () => page.value?.seo?.title ?? page.value?.title,
  description: () => page.value?.seo?.description ?? page.value?.description,
})
</script>

<template>
  <div v-if="page">
    <!-- ================= EDITORIAL HEADER ================= -->
    <!-- phero-flavoured top padding (mirrors the case study); no bottom pad so
         the following section-y owns the gap. -->
    <section class="pt-[clamp(2rem,5vw,3.5rem)] pb-0" aria-labelledby="about-title">
      <div class="wrap">
        <!-- eyebrow gains a leading accent bar (base shortcut has none): a real
             decorative <span> replaces the former .eyebrow-bar::before. -->
        <span class="eyebrow">
          <span class="w-[26px] h-px bg-mauve" aria-hidden="true" />
          {{ page.eyebrow }}
        </span>

        <!-- masthead: monogram avatar beside the name/role cluster -->
        <div class="grid grid-cols-[1fr] items-center gap-[clamp(1rem,3vw,1.6rem)] mt-[clamp(1.1rem,3vw,1.6rem)] dots:grid-cols-[auto_1fr]">
          <div
            class="grid place-items-center select-none w-[clamp(64px,11vw,88px)] aspect-square border border-[var(--hair)] rounded-md bg-mantle font-display [font-optical-sizing:auto] italic font-500 leading-[1] text-[clamp(2.1rem,5vw,3rem)] text-mauve"
            aria-hidden="true"
          >
            {{ site?.author.monogram }}
          </div>
          <div>
            <KineticText
              id="about-title"
              as="h1"
              :balanced="false"
              class="font-display font-[560] tracking-[-.018em] text-balance [font-optical-sizing:auto] text-[clamp(1.9rem,1.15rem+3vw,3.15rem)] leading-[1.04]"
            >
              {{ page.nameBefore }}<em class="italic font-500 text-mauve">{{ page.nameEm }}</em>{{ page.nameAfter }}
            </KineticText>
            <p class="mt-[.6rem] font-mono text-sm tracking-[.02em] text-subtext-0">
              {{ page.roleBefore }}<em class="italic text-[rgb(var(--peach-ink))]">{{ page.roleEm }}</em>
            </p>
          </div>
        </div>

        <p class="mt-[clamp(1.3rem,3vw,1.8rem)] max-w-[56ch] text-lead leading-[1.55] text-subtext-1">
          {{ page.lead }}
        </p>

        <div class="flex flex-wrap gap-[.6rem] mt-[clamp(1.4rem,3vw,1.9rem)]" :aria-label="page.socialsLabel">
          <a
            v-for="s in ABOUT_SOCIALS"
            :key="s.key"
            class="chip-link"
            :href="s.url"
            :target="isExternal(s.url) ? '_blank' : undefined"
            :rel="isExternal(s.url) ? 'noopener noreferrer' : undefined"
          >{{ s.label }}</a>
        </div>
      </div>
    </section>

    <!-- ================= 01 · THE STORY ================= -->
    <section class="section-y" :aria-label="page.story.label">
      <div class="wrap">
        <SectionMarker
          v-reveal
          class="mb-[clamp(2.25rem,4.5vw,3.5rem)]"
          :n="page.story.n"
          :label="page.story.label"
          :note="page.story.note"
        />
      </div>

      <!-- Reading column: prose + closing contact reveal together as one unit
           (mirrors the former single-reveal .read). ProseDocument owns the
           centred wrap-read measure; the contact row reuses the same measure. -->
      <div v-reveal>
        <ProseDocument :value="page" />

        <div class="wrap-read">
          <div class="flex items-baseline justify-between gap-[1rem] flex-wrap mt-[clamp(2.5rem,6vw,4rem)] pt-[clamp(1.6rem,4vw,2.4rem)] border-t border-[var(--hair)]">
            <span class="font-mono text-micro tracking-[.16em] uppercase text-overlay-1">{{ page.contact.prompt }}</span>
            <a :href="EMAIL_URL" class="link-cta group">
              {{ page.contact.cta }} <span class="arw" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
