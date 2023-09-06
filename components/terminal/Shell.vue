<script lang="ts" setup>
defineProps(['title'])
</script>

<template>
  <div class="rounded-xl">
    <div
      class="h-8 flex items-center justify-between rounded-t-xl bg-mantle"
    >
      <div class="mx-3 font-bold">
        {{ title }}
      </div>
      <div class="flex items-center justify-center px-2">
        <div
          class="mx-1 h-4 w-4 border-4 border-teal rounded-full border-solid"
        />
        <div
          class="mx-1 h-4 w-4 border-4 border-pink rounded-full border-solid"
        />
        <div
          class="mx-1 h-4 w-4 border-4 border-mauve rounded-full border-solid"
        />
      </div>
    </div>
    <div class="rounded-b-xl bg-base px-3 py-3 md:px-6 md:py-6">
      <slot />
    </div>
  </div>
</template>
