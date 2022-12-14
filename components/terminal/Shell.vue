<script lang="ts" setup>
defineProps(['title'])
</script>

<template>
  <div class="rounded-xl">
    <div
      class="flex items-center justify-between h-8 bg-mantle rounded-t-xl"
    >
      <div class="mx-3 font-bold">
        {{ title }}
      </div>
      <div class="flex items-center justify-center px-2">
        <div
          class="w-4 h-4 mx-1 border-4 border-solid rounded-full border-teal"
        />
        <div
          class="w-4 h-4 mx-1 border-4 border-solid rounded-full border-pink"
        />
        <div
          class="w-4 h-4 mx-1 border-4 border-solid rounded-full border-mauve"
        />
      </div>
    </div>
    <div class="px-3 py-3 md:px-6 md:py-6 bg-base rounded-b-xl">
      <slot />
    </div>
  </div>
</template>
