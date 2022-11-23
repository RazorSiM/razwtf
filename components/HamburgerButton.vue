<script lang="ts" setup>
interface Props {
  navOpened: boolean
}
defineProps<Props>()
</script>

<template>
  <button
    class="inline-flex items-center justify-center p-2 transition duration-150 ease-in-out rounded-md text-faccent hover:text-primary focus:outline-none focus:bg-transparent focus:text-accent"
    aria-label="Main menu"
    aria-expanded="false"
  >
    <svg
      v-if="navOpened === false"
      class="block w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>

    <svg
      v-if="navOpened === true"
      class="block w-6 h-6"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  </button>
</template>
