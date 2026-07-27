<script lang="ts" setup>
type CalloutType = 'note' | 'tip' | 'warning' | 'info'

interface Props {
  type?: CalloutType
  title?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'note',
})

// Per-type Catppuccin accent, default heading and default glyph. Each is
// overridable via the matching prop (title / icon).
// "ink" accents so callout titles/icons stay AA-legible on the light (latte)
// base; identical to the plain accent in dark flavours.
const COLOR: Record<CalloutType, string> = {
  note: 'sapphire-ink',
  tip: 'green-ink',
  warning: 'peach-ink',
  info: 'blue-ink',
}
const TITLE: Record<CalloutType, string> = {
  note: 'Note',
  tip: 'Tip',
  warning: 'Heads up',
  info: 'Info',
}
const ICON: Record<CalloutType, string> = {
  note: '✦',
  tip: '✦',
  warning: '!',
  info: 'i',
}

const colorVar = computed(() => `var(--${COLOR[props.type]})`)
const resolvedTitle = computed(() => props.title ?? TITLE[props.type])
const resolvedIcon = computed(() => props.icon ?? ICON[props.type])
</script>

<template>
  <div
    class="callout grid grid-cols-[auto_1fr] items-start gap-x-[1.05rem] gap-y-[.35rem] rounded-md border border-l-3 border-[color:var(--hair)] border-l-[color:rgb(var(--c))] bg-[rgb(var(--c)/.07)] px-[clamp(1.2rem,3vw,1.7rem)] py-[clamp(1.1rem,2.6vw,1.5rem)]"
    role="note"
    :style="{ '--c': colorVar }"
  >
    <span
      class="font-700 row-[1/span_2] grid h-8 w-8 place-items-center rounded-full bg-[rgb(var(--c)/.18)] font-mono text-[1rem] text-[rgb(var(--c))]"
      aria-hidden="true"
      >{{ resolvedIcon }}</span
    >
    <span
      class="text-micro font-700 col-start-2 self-center font-mono tracking-[.2em] text-[rgb(var(--c))] uppercase"
      >{{ resolvedTitle }}</span
    >
    <div class="callout__b text-subtext-1 text-body col-start-2 leading-[1.65]">
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* margin-block must out-specify `.prose > * + *` (both single-class); kept in
   scoped CSS so the [data-v] attribute wins the top-margin tie. */
.callout {
  margin-block: 2em;
}

/* Nested MDC markdown: tame Prose spacing, then tint links + strong. */
.callout__b :deep(p) {
  margin: 0;
}
.callout__b :deep(p + p) {
  margin-top: 0.8em;
}
.callout__b :deep(a) {
  color: rgb(var(--text));
  border-bottom: 0;
  background-image: linear-gradient(rgb(var(--c)), rgb(var(--c)));
  background-size: 100% 1px;
  background-repeat: no-repeat;
  background-position: 0 1.15em;
  transition: color 0.25s var(--ease);
}
.callout__b :deep(a:hover) {
  color: rgb(var(--c));
}
.callout__b :deep(strong) {
  color: rgb(var(--text));
  font-weight: 700;
}
</style>
