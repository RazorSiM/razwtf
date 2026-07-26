<script lang="ts" setup>
definePageMeta({ layout: 'default' })

// Page copy (content/blog.md) and the post list.
const { data: page } = await useAsyncData('blog-index-copy', () =>
  queryCollection('blogIndex').first())
const { data: allPosts } = await useAsyncData('blog-index', () =>
  queryCollection('posts').order('date', 'DESC').all())

// Published notes, each paired with its reading estimate. Reading time is only
// surfaced when the body has real text and the estimate is a sane, finite
// number of minutes (≥ 1) - otherwise the chip is dropped for that row.
const posts = computed(() =>
  (allPosts.value ?? [])
    .filter(p => !p.draft)
    .map((p) => {
      const text = extractText(p.body).trim()
      const mins = text ? readingTime(text) : 0
      return { post: p, readMin: Number.isFinite(mins) && mins >= 1 ? mins : null }
    }))

// ---- On-site search (raz-c9o) --------------------------------------------
// @nuxt/content's built-in client-side search (useSearchCollection) indexes
// title + description + body via a WASM sqlite FTS index - client-only by
// design, so this never touches the server/prerender build. It does NOT index
// the `tags` array (generateSearchSections only covers title/content), so a
// plain substring check against the already-loaded `posts` fills that gap -
// cheap at this content scale, and keeps "search title/description/tags/body"
// honest without hand-rolling the text-search half too.
const query = ref('')
const { search } = useSearchCollection('posts', { extraFields: ['path'] })

// null = no active query -> show everything unfiltered.
const matchedPaths = ref<Set<string> | null>(null)

watchDebounced(query, async (q) => {
  const term = q.trim()
  if (!term) {
    matchedPaths.value = null
    return
  }

  const tagHits = posts.value
    .filter(({ post }) => (post.tags ?? []).some(t => t.toLowerCase().includes(term.toLowerCase())))
    .map(({ post }) => post.path)

  const textHits = (await search(term)).map(r => r.id.split('#')[0]!)

  matchedPaths.value = new Set([...tagHits, ...textHits])
}, { debounce: 200 })

const visiblePosts = computed(() =>
  matchedPaths.value
    ? posts.value.filter(({ post }) => matchedPaths.value!.has(post.path))
    : posts.value)

useSeoMeta({
  title: () => page.value?.seo?.title ?? page.value?.title,
  description: () => page.value?.seo?.description ?? page.value?.description,
})
</script>

<template>
  <div v-if="page" class="wrap section-y">
    <SectionMarker v-reveal class="mb-[clamp(2.25rem,4.5vw,3.5rem)]" :n="page.marker.n" :label="page.marker.label" :note="page.marker.note" />

    <div class="mb-[clamp(2rem,4vw,3rem)] max-w-[60ch]">
      <KineticText as="h1" class="display text-h1">
        {{ page.heading }}
      </KineticText>
      <p v-reveal class="lead mt-4" :style="{ '--rd': '.12s' }">
        {{ page.lead }}
      </p>
    </div>

    <div v-if="posts.length" v-reveal class="mb-[clamp(1.6rem,3.5vw,2.2rem)]" :style="{ '--rd': '.16s' }">
      <SearchField v-model="query" :placeholder="page.searchPlaceholder" aria-controls="notes-results" />
    </div>

    <div id="notes-results" class="border-t border-[color:var(--hair)]">
      <NoteListRow
        v-for="{ post, readMin } in visiblePosts"
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

    <!-- Announced to assistive tech as results change; visually redundant
         with the rows themselves so it stays visually hidden. -->
    <p class="sr-only" aria-live="polite">
      {{ query.trim() ? `${visiblePosts.length} ${visiblePosts.length === 1 ? 'note' : 'notes'} found` : '' }}
    </p>

    <p v-if="!posts.length" class="mt-8 text-body text-subtext-1">
      {{ page.emptyState }}
    </p>
    <p v-else-if="!visiblePosts.length" class="mt-8 text-body text-subtext-1">
      {{ page.noMatches.replace('{query}', query) }}
    </p>
  </div>
</template>
