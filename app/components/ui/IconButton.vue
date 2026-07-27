<script lang="ts" setup>
// Bordered icon-only button - the shared chrome behind the header menu trigger,
// the scroll-to-top button, and any future icon actions. Dumb/presentational:
// visibility, scroll behaviour, routing and dialog wiring stay with the caller.
//
// `icon` is an UnoCSS presetIcons class (e.g. "i-carbon-arrow-up"); append a
// size utility to match a specific source (e.g. "i-carbon-menu text-[1.35rem]").
// `size` is a width/height utility string. `shape` toggles rounded ↔ pill.
// `floating` layers the fixed bottom-right chrome from ScrollTopButton.
withDefaults(defineProps<{
  icon: string
  label: string
  shape?: 'square' | 'round'
  size?: string
  floating?: boolean
  as?: 'button' | 'a'
}>(), {
  shape: 'square',
  size: 'w-9 h-9',
  floating: false,
  as: 'button',
})

defineEmits<{ (e: 'click', event: MouseEvent): void }>()
</script>

<template>
  <component
    :is="as"
    :type="as === 'button' ? 'button' : undefined"
    :aria-label="label"
    class="icon-btn"
    :class="[
      size,
      shape === 'round' ? 'rounded-full' : '',
      floating
        ? 'fixed bottom-5 right-5 z-40 cursor-pointer bg-base text-subtext-0 shadow-lg hover:-translate-y-2px'
        : '',
    ]"
    @click="$emit('click', $event)"
  >
    <span :class="icon" aria-hidden="true" />
  </component>
</template>
