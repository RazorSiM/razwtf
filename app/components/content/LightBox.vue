<script lang="ts" setup>
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogRoot,
  DialogTitle,
  VisuallyHidden,
} from 'reka-ui'

// Self-contained: reads the shared lightbox state internally.
const { state, closeLightbox, nextImage, prevImage } = injectLightbox()

const current = computed(() => state.items[state.index])
const total = computed(() => state.items.length)
const hasMultiple = computed(() => total.value > 1)

// Esc + focus trap come from Reka Dialog; we only wire arrow-key navigation.
onKeyStroke('ArrowLeft', (e) => {
  if (state.open && hasMultiple.value) {
    e.preventDefault()
    prevImage()
  }
})
onKeyStroke('ArrowRight', (e) => {
  if (state.open && hasMultiple.value) {
    e.preventDefault()
    nextImage()
  }
})

function onOpenChange(value: boolean) {
  if (!value) closeLightbox()
}
</script>

<template>
  <DialogRoot :open="state.open" @update:open="onOpenChange">
    <DialogPortal>
      <DialogOverlay class="lb-overlay" />
      <DialogContent
        class="fixed inset-0 z-201 grid place-items-center p-[clamp(1rem,4vw,3rem)] outline-none"
        @click.self="closeLightbox"
      >
        <VisuallyHidden>
          <DialogTitle>Image viewer</DialogTitle>
          <DialogDescription>Full-size project image with previous / next navigation.</DialogDescription>
        </VisuallyHidden>

        <div v-if="current" class="lb__stage relative flex w-full max-w-[min(1100px,100%)] flex-col items-center gap-4">
          <DialogClose
            class="lb__close text-text hover:border-red hover:text-red absolute top-[clamp(-3.2rem,-6vw,-2.6rem)] right-0 grid h-[2.6rem] w-[2.6rem] cursor-pointer place-items-center rounded border border-[color:var(--hair-strong)] bg-[rgb(var(--base)/.82)] font-mono text-[1rem]"
            aria-label="Close viewer"
          >
            ✕
          </DialogClose>

          <button
            v-if="hasMultiple"
            type="button"
            class="lb__btn lb__prev text-text hover:border-green hover:text-green absolute top-1/2 left-[clamp(-1.4rem,-2vw,-.5rem)] grid h-[2.9rem] w-[2.9rem] [transform:translateY(-50%)] cursor-pointer place-items-center rounded-full border border-[color:var(--hair-strong)] bg-[rgb(var(--base)/.82)] text-[1.1rem] active:[transform:translateY(-50%)_scale(.94)]"
            aria-label="Previous image"
            @click="prevImage"
          >
            ←
          </button>

          <img
            class="bg-mantle h-auto max-h-[80vh] w-auto max-w-full rounded-md border border-[color:var(--hair-strong)]"
            :src="current.src"
            :alt="current.alt ?? ''"
          />

          <button
            v-if="hasMultiple"
            type="button"
            class="lb__btn lb__next text-text hover:border-green hover:text-green absolute top-1/2 right-[clamp(-1.4rem,-2vw,-.5rem)] grid h-[2.9rem] w-[2.9rem] [transform:translateY(-50%)] cursor-pointer place-items-center rounded-full border border-[color:var(--hair-strong)] bg-[rgb(var(--base)/.82)] text-[1.1rem] active:[transform:translateY(-50%)_scale(.94)]"
            aria-label="Next image"
            @click="nextImage"
          >
            →
          </button>

          <div class="text-micro flex w-full items-center justify-between gap-4 font-mono tracking-[.1em]">
            <span class="text-subtext-1 uppercase">{{ current.caption || current.alt }}</span>
            <span class="text-overlay-1 tabular-nums">{{ state.index + 1 }} / {{ total }}</span>
          </div>
        </div>
      </DialogContent>
    </DialogPortal>
  </DialogRoot>
</template>

<style scoped>
/* Ported from design-mockups/e-project.html (.lb*). Reka splits the single
   mockup overlay into DialogOverlay (backdrop) + DialogContent (centering).
   Kept scoped (utilities cannot express these): the backdrop + stage entrance
   animations reference the scoped @keyframes below (Vue hashes their names, so
   a utility `animate-*` would reference an unhashed name and never match); the
   glyph buttons' transitions run per-property durations (.2s transform vs .3s
   the rest); and the ≤560px positioning overrides beat the inline clamps via
   the [data-v] specificity boost. */
.lb-overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgb(var(--crust) / 0.93);
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  animation: lb-fade 0.25s var(--ease) both;
}

.lb__stage {
  animation: lb-rise 0.35s var(--ease-out) both;
}

.lb__btn {
  transition:
    border-color 0.3s var(--ease),
    color 0.3s var(--ease),
    background 0.3s var(--ease),
    transform 0.2s var(--ease);
}
.lb__close {
  transition:
    border-color 0.3s var(--ease),
    color 0.3s var(--ease);
}

@keyframes lb-fade {
  from {
    opacity: 0;
  }
}

@keyframes lb-rise {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
}

@media (max-width: 560px) {
  .lb__prev {
    left: 0.3rem;
  }
  .lb__next {
    right: 0.3rem;
  }
  .lb__btn {
    width: 2.4rem;
    height: 2.4rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .lb-overlay,
  .lb__stage {
    animation: none;
  }
  .lb__btn,
  .lb__close {
    transition: none;
  }
}
</style>
