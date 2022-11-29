<script lang="ts" setup>
defineProps(['title'])
</script>

<template>
  <div class="rounded-xl">
    <div
      class="flex items-center justify-between h-8 bg-base1 rounded-t-xl"
    >
      <div class="mx-3 font-bold">
        {{ title }}
      </div>
      <div class="flex items-center justify-center px-2">
        <div
          class="w-4 h-4 mx-1 border-4 border-solid rounded-full border-primary"
        />
        <div
          class="w-4 h-4 mx-1 border-4 border-solid rounded-full border-secondary"
        />
        <div
          class="w-4 h-4 mx-1 border-4 border-solid rounded-full border-tertiary"
        />
      </div>
    </div>
    <div class="px-3 py-3 md:px-6 md:py-6">
      <slot />
    </div>
  </div>
</template>

