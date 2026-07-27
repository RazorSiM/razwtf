<script lang="ts" setup>
definePageMeta({ layout: 'default' })

// The projects listing intro doc; copy in frontmatter, prose in the body.
const { data: page } = await useAsyncData('projects-index', () => queryCollection('projectsIndex').first())

// Full project list; sorted in a computed by order then date DESC (like home).
const { data: projectData } = await useAsyncData('projects-list', () => queryCollection('projects').all())

const list = computed(() =>
  (projectData.value ?? []).toSorted(
    (a, b) => (a.order ?? 99) - (b.order ?? 99) || +new Date(b.date) - +new Date(a.date),
  ),
)

// Featured: explicitly flagged, else the first in order. The rest keep order.
const featured = computed(() => list.value.find((p) => p.featured) ?? list.value[0])
const rest = computed(() => {
  const feat = featured.value
  return feat ? list.value.filter((p) => p.path !== feat.path) : list.value
})

const heading = computed(() => page.value?.heading ?? page.value?.title ?? '')

function accentVar(p?: { accent?: string }) {
  return { '--accent': `var(--${p?.accent ?? 'mauve'})` }
}

useSeoMeta({
  title: () => page.value?.seo?.title ?? page.value?.title,
  description: () => page.value?.seo?.description ?? page.value?.description,
})
</script>

<template>
  <div class="wrap section-y">
    <!-- ================= HEADER ================= -->
    <header class="mb-[clamp(2.5rem,5vw,4rem)] max-w-[var(--maxw-read)]">
      <SectionMarker
        v-reveal
        class="mb-[clamp(1.5rem,3vw,2.25rem)]"
        :n="page?.marker.n ?? ''"
        :label="page?.marker.label ?? ''"
        :note="page?.marker.note ?? ''"
      />

      <div>
        <KineticText as="h1" class="display text-h1">
          {{ heading }}
        </KineticText>
        <!-- No v-else fallback on `page.description`: it is unreachable, since
             this branch only runs when `page` is null, and TypeScript narrows it
             to `never` there. -->
        <div v-if="page" v-reveal class="prose mt-6" :style="{ '--rd': '.06s' }">
          <ContentRenderer :value="page" />
        </div>
      </div>
    </header>

    <!-- ================= FEATURED ================= -->
    <WorkCard v-if="featured" v-reveal featured as="h2" :project="featured" :style="accentVar(featured)" />

    <!-- ================= REST ================= -->
    <div
      v-if="rest.length"
      class="wide:grid-cols-[1fr_1fr] mt-[clamp(1.1rem,2vw,1.6rem)] grid grid-cols-[1fr] gap-[clamp(1.1rem,2vw,1.6rem)]"
    >
      <WorkCard
        v-for="(p, i) in rest"
        :key="p.path"
        v-reveal
        as="h3"
        :project="p"
        :style="{ ...accentVar(p), '--rd': `${i * 0.08}s` }"
      />
    </div>
  </div>
</template>
