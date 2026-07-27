<script lang="ts" setup>
// Global chrome. Header/footer/scroll-top are small, focused components;
// theme cycling lives in useFlavor(); the document itself scrolls (sticky nav),
// so there's no inner scroll container or width hacks anymore.
// LightBox is self-contained - it reads the shared lightbox state internally.
</script>

<template>
  <div class="bg-crust text-text flex min-h-[100svh] flex-col font-mono">
    <a
      href="#main"
      class="border-surface-1/90 bg-base text-text ease absolute top-[-4rem] left-3 z-100 rounded border px-[.9rem] py-[.55rem] text-sm transition-all duration-200 focus:top-3"
    >
      Skip to content
    </a>

    <LayoutAppHeader />

    <main id="main" class="flex-1">
      <slot />
    </main>

    <LayoutAppFooter />
    <LayoutScrollTopButton />

    <!-- Client-only: LightBox is a reka Dialog driven entirely by client state
         (opens on image click) and reka's DialogRoot crashes static prerender. -->
    <ClientOnly>
      <LightBox />
    </ClientOnly>
  </div>
</template>
