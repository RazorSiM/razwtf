<script lang="ts" setup>
// Global chrome. Header/footer/scroll-top are small, focused components;
// theme cycling lives in useFlavor(); the document itself scrolls (sticky nav),
// so there's no inner scroll container or width hacks anymore.
// LightBox is self-contained - it reads the shared lightbox state internally.
</script>

<template>
  <div class="flex min-h-[100svh] flex-col bg-crust font-mono text-text">
    <a
      href="#main"
      class="absolute left-3 top-[-4rem] z-100 border border-surface-1/90 rounded bg-base px-[.9rem] py-[.55rem] text-sm text-text transition-all duration-200 ease focus:top-3"
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
