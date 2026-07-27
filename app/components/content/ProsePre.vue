<script lang="ts" setup>
const props = defineProps({
  code: {
    type: String,
    default: '',
  },
  language: {
    type: String,
    default: null,
  },
  filename: {
    type: String,
    default: null,
  },
  highlights: {
    type: Array as () => number[],
    default: () => [],
  },
  meta: {
    type: String,
    default: null,
  },
  class: {
    type: String,
    default: null,
  },
})

// MDC defaults an unlabelled fenced block to language "text" - treat that as
// "no language" so a bare ``` block renders as a plain token-styled block.
const showLang = computed(() => !!props.language && props.language !== 'text')
const showBar = computed(() => !!props.filename || showLang.value)
</script>

<template>
  <figure v-if="showBar" class="codeblock overflow-hidden rounded-md">
    <figcaption
      class="codeblock__bar text-micro flex items-center justify-between gap-4 px-[.95rem] py-[.55rem] font-mono tracking-[.08em]"
    >
      <span v-if="filename" class="codeblock__name inline-flex items-center gap-[.5em]">{{ filename }}</span>
      <span v-if="showLang" class="codeblock__lang uppercase">{{ language }}</span>
    </figcaption>
    <pre :class="$props.class"><slot /></pre>
  </figure>
  <pre v-else :class="$props.class"><slot /></pre>
</template>

<style scoped>
/* This block renders inside `.prose`, whose descendant rules (`.prose figure`,
   `.prose figcaption`, `.prose pre`) are (0,1,1) - single-class utilities
   (0,1,0) cannot override them, so the properties that must beat `.prose` stay
   scoped (the [data-v] attribute lifts them to (0,2,x)). Everything `.prose`
   leaves untouched is inlined at the call site above. */
/* Fixed dark code surface in every flavour (see --code-* in main.css) so the
   single dark syntax theme stays readable - light-flavour mantle would wash the
   neon tokens out. */
.codeblock {
  margin-block: 1.9em;
  background: rgb(var(--code-bg));
  border: 1px solid var(--code-hair);
}
.codeblock__bar {
  margin: 0;
  text-align: left;
  background: rgb(var(--code-bar));
  border-bottom: 1px solid var(--code-hair);
  color: rgb(var(--code-muted));
}
.codeblock__name {
  color: rgb(var(--code-muted));
}
.codeblock__lang {
  color: rgb(var(--code-muted));
}

.codeblock__name::before {
  content: '';
  width: 8px;
  height: 8px;
  background: rgb(var(--mauve));
  border-radius: 2px;
}

/* strip the .prose pre chrome so it does not double up with the figure */
.codeblock pre {
  margin: 0;
  background: none;
  border: 0;
  border-radius: 0;
}
</style>
