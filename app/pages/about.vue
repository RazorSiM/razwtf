<script lang="ts" setup>
definePageMeta({ layout: 'default' })

// Dedicated /about page - takes precedence over the [...slug].vue catch-all.
// Editorial masthead (monogram + name + role + socials) then the Q&A "story"
// rendered from content/about.md via <ContentRenderer>. Every string on the
// page comes from that file's frontmatter or body (raz-edg).
const { data: page } = await useAsyncData('about', () => queryCollection('about').first())
const { data: site } = await useAsyncData('site-chrome-about', () => queryCollection('site').first())

if (!page.value) throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

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
          <span class="bg-mauve h-px w-[26px]" aria-hidden="true" />
          {{ page.eyebrow }}
        </span>

        <!-- masthead: monogram avatar beside the name/role cluster -->
        <div
          class="dots:grid-cols-[auto_1fr] mt-[clamp(1.1rem,3vw,1.6rem)] grid grid-cols-[1fr] items-center gap-[clamp(1rem,3vw,1.6rem)]"
        >
          <div
            class="bg-mantle font-display font-500 text-mauve grid aspect-square w-[clamp(64px,11vw,88px)] place-items-center rounded-md border border-[var(--hair)] text-[clamp(2.1rem,5vw,3rem)] leading-[1] italic select-none [font-optical-sizing:auto]"
            aria-hidden="true"
          >
            {{ site?.author.monogram }}
          </div>
          <div>
            <KineticText
              id="about-title"
              as="h1"
              :balanced="false"
              class="font-display text-[clamp(1.9rem,1.15rem+3vw,3.15rem)] leading-[1.04] font-[560] tracking-[-.018em] text-balance [font-optical-sizing:auto]"
            >
              {{ page.nameBefore }}<em class="font-500 text-mauve italic">{{ page.nameEm }}</em
              >{{ page.nameAfter }}
            </KineticText>
            <p class="text-subtext-0 mt-[.6rem] font-mono text-sm tracking-[.02em]">
              {{ page.roleBefore }}<em class="text-[rgb(var(--peach-ink))] italic">{{ page.roleEm }}</em>
            </p>
          </div>
        </div>

        <p class="text-lead text-subtext-1 mt-[clamp(1.3rem,3vw,1.8rem)] max-w-[56ch] leading-[1.55]">
          {{ page.lead }}
        </p>

        <div class="mt-[clamp(1.4rem,3vw,1.9rem)] flex flex-wrap gap-[.6rem]" :aria-label="page.socialsLabel">
          <a
            v-for="s in ABOUT_SOCIALS"
            :key="s.key"
            class="chip-link"
            :href="s.url"
            :target="isExternal(s.url) ? '_blank' : undefined"
            :rel="isExternal(s.url) ? 'noopener noreferrer' : undefined"
            >{{ s.label }}</a
          >
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
          <div
            class="mt-[clamp(2.5rem,6vw,4rem)] flex flex-wrap items-baseline justify-between gap-[1rem] border-t border-[var(--hair)] pt-[clamp(1.6rem,4vw,2.4rem)]"
          >
            <span class="text-micro text-overlay-1 font-mono tracking-[.16em] uppercase">{{
              page.contact.prompt
            }}</span>
            <a :href="EMAIL_URL" class="link-cta group">
              {{ page.contact.cta }} <span class="arw" aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
