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
      class="fixed inset-0 z-50 flex items-center justify-center h-screen bg-overlay-0/60 backdrop-blur overflow-hidden"
      @click="closeIfShown"
    >
      <div class="relative h-screen w-screen mx-auto overflow-x-hidden scrollbar scrollbar-track-color-base scrollbar-thumb-color-flamingo scrollbar-rounded scrollbar-w-1 flex items-center justify-center">
        <button
          v-if="showClose"
          aria-label="close"
          class="absolute top-0 right-0 p-4 mx-10 my-2 text-xl leading-5 transition duration-100 text-blue hover:text-sky focus:outline-none"
          @click="closeIfShown"
        >
          <div class="i-carbon-close-filled" />
        </button>
        <img class="cursor-pointer h-auto w-screen object-cover" :src="image" alt="lightbox" :width="800" :height="500">
      </div>
    </div>
  </Transition>
</template>
