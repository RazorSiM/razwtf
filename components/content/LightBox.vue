<script lang="ts" setup>
interface Props {
  show: boolean
  showClose: boolean
  image: string
}
const props = defineProps<Props>()
const emits = defineEmits(['close'])

const closeIfShown = () => {
  if (props.show)
    emits('close')
}

onKeyStroke('Escape', closeIfShown)
</script>

<template>
  <Transition>
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center h-screen bg-base1/90 overflow-hidden"
      @click="closeIfShown"
    >
      <div class="relative max-h-screen mx-auto overflow-hidden">
        <button
          v-if="showClose"
          aria-label="close"
          class="absolute top-0 right-0 p-4 mx-10 my-2 text-xl leading-5 transition duration-100 text-faccent hover:text-tertiary focus:outline-none"
          @click="closeIfShown"
        >
          <div class="i-carbon-close-filled" />
        </button>
        <img class="cursor-pointer h-screen w-auto" :src="image" alt="lightbox" :width="800" :height="500">
      </div>
    </div>
  </Transition>
</template>
