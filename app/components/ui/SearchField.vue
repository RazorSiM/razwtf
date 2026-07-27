<script lang="ts" setup>
// Bare search input - the shared chrome for on-site search (raz-c9o). Dumb/
// presentational: the query lives in the caller via `v-model`; this only owns
// the field's chrome, the clear button and the Escape-to-clear shortcut.
withDefaults(defineProps<{
  placeholder?: string
  /** id of the live region / list this field controls, for screen readers. */
  ariaControls?: string
}>(), {
  placeholder: 'Search…',
})

const model = defineModel<string>({ default: '' })
</script>

<template>
  <div class="group flex items-center gap-[.7em] border border-surface-1/90 rounded-md bg-base/60 px-[1.1rem] py-[.8rem] transition-colors duration-300 ease focus-within:border-mauve">
    <span class="i-carbon-search shrink-0 text-[1.05rem] text-subtext-0" aria-hidden="true" />
    <input
      v-model="model"
      type="search"
      :placeholder="placeholder"
      class="min-w-0 w-full bg-transparent font-mono text-body text-text placeholder:text-overlay-1 focus:outline-none"
      :aria-controls="ariaControls"
      autocomplete="off"
      spellcheck="false"
      @keydown.esc="model = ''"
    >
    <IconButton
      v-if="model"
      icon="i-carbon-close"
      label="Clear search"
      size="w-6 h-6"
      shape="round"
      class="border-0"
      @click="model = ''"
    />
  </div>
</template>
