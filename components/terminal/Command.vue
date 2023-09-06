<script lang="ts" setup>
defineProps(['command', 'distroIcon', 'distroTitle'])
</script>

<template>
  <div class="my-3">
    <p class="text-left">
      <svg
        class="inline h-4 w-auto fill-current"
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <title>{{ distroTitle }}</title>
        <path :d="distroIcon" />
      </svg>
      <span class="font-bold text-teal"> ~ </span>
      <span class="font-bold text-sapphire">> </span>
      <span class="font-bold font-serif text-teal">{{ command }}</span>
    </p>
  </div>
</template>
