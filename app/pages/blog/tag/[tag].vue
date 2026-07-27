<script lang="ts" setup>
definePageMeta({ layout: 'default' })

const route = useRoute()
const tagSlug = computed(() => String(route.params.tag ?? ''))

const { data: allPosts } = await useAsyncData(`blog-tag-${tagSlug.value}`, () =>
  queryCollection('posts').order('date', 'DESC').all(),
)

// Published posts carrying this tag, each paired with its reading estimate -
// same shape/logic as the blog index (see app/pages/blog/index.vue).
const posts = computed(() =>
  (allPosts.value ?? [])
    .filter((p) => !p.draft && (p.tags ?? []).some((t) => slugifyTag(t) === tagSlug.value))
    .map((p) => {
      const text = extractText(p.body).trim()
      const mins = text ? readingTime(text) : 0
      return { post: p, readMin: Number.isFinite(mins) && mins >= 1 ? mins : null }
    }),
)

if (!posts.value.length) {
  throw createError({ statusCode: 404, statusMessage: 'No notes with this tag', fatal: true })
}

// Canonical (original-case) tag label, taken from whichever post has it.
const tagLabel = computed(() => {
  for (const p of allPosts.value ?? []) {
    const match = (p.tags ?? []).find((t) => slugifyTag(t) === tagSlug.value)
    if (match) return match
  }
  return tagSlug.value
})

// Every other tag in use, for a small cross-navigation row at the foot of the list.
const otherTags = computed(() => {
  const seen = new Map<string, string>()
  for (const p of allPosts.value ?? []) {
    if (p.draft) continue
    for (const t of p.tags ?? []) {
      const slug = slugifyTag(t)
      if (slug !== tagSlug.value && !seen.has(slug)) seen.set(slug, t)
    }
  }
  return [...seen.entries()].map(([slug, label]) => ({ slug, label }))
})

useSeoMeta({
  title: () => `#${tagLabel.value} · Notes · raz.wtf`,
  description: () => `Notes tagged “${tagLabel.value}”.`,
})
</script>

<template>
  <div class="wrap section-y">
    <div v-reveal class="mb-[clamp(1.6rem,3.5vw,2.4rem)] flex flex-wrap items-center justify-between gap-4">
      <BackLink to="/blog" label="All notes" />
      <TerminalPath prompt="raz@wtf" :segments="[{ label: '~/notes', to: '/blog' }]" :leaf="`tag/${tagSlug}`" />
    </div>

    <SectionMarker
      v-reveal
      class="mb-[clamp(2.25rem,4.5vw,3.5rem)]"
      n="→"
      label="Notes"
      :note="`Tagged #${tagLabel}`"
    />

    <div class="mb-[clamp(2rem,4vw,3rem)] max-w-[60ch]">
      <KineticText as="h1" class="display text-h1"> #{{ tagLabel }} </KineticText>
      <p v-reveal class="lead mt-4" :style="{ '--rd': '.12s' }">
        {{ posts.length }} {{ posts.length === 1 ? 'note' : 'notes' }} tagged “{{ tagLabel }}”.
      </p>
    </div>

    <div class="border-t border-[color:var(--hair)]">
      <NoteListRow
        v-for="{ post, readMin } in posts"
        :key="post.path"
        v-reveal
        :to="post.path"
        :title="post.title"
        :description="post.description"
        :date="post.date"
        :tags="post.tags"
        :read-min="readMin ?? undefined"
      />
    </div>

    <div v-if="otherTags.length" v-reveal class="mt-[clamp(2.5rem,5vw,3.5rem)] flex flex-wrap items-center gap-[.7rem]">
      <span class="kicker text-overlay-1">Browse other tags</span>
      <NuxtLink v-for="t in otherTags" :key="t.slug" :to="`/blog/tag/${t.slug}`" class="chip-link">
        #{{ t.label }}
      </NuxtLink>
    </div>
  </div>
</template>
