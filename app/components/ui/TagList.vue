<script setup lang="ts">
// Wrapping row of tags, unified across pages.
//  - variant 'inline' : mauve "#tag" text items (blog index, home notes).
//  - variant 'chip'   : chip-shortcut pills (project case study). When `accent`
//    is given, the FIRST chip carries an accent swatch; `accent` is a
//    Catppuccin token name (e.g. 'green', 'mauve') resolved to var(--<accent>).
interface Props {
  tags: string[]
  variant?: 'inline' | 'chip'
  accent?: string
}

const { tags, variant = 'inline', accent } = defineProps<Props>()
</script>

<template>
  <ul
    :class="
      variant === 'chip' ? 'flex list-none flex-wrap gap-[.55rem]' : 'text-mauve flex list-none flex-wrap gap-[.7em]'
    "
  >
    <template v-if="variant === 'chip'">
      <li v-for="(tag, i) in tags" :key="tag">
        <span v-if="i === 0 && accent" class="chip" :style="{ '--accent': `var(--${accent})` }">
          <i class="swatch bg-[rgb(var(--accent))]" aria-hidden="true" /> {{ tag }}
        </span>
        <span v-else class="chip">{{ tag }}</span>
      </li>
    </template>
    <template v-else>
      <li v-for="tag in tags" :key="tag">#{{ tag }}</li>
    </template>
  </ul>
</template>
