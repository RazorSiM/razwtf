<script lang="ts" setup>
interface Props {
  show: boolean
  showClose: boolean
  image: string
}
const props = defineProps<Props>()
const emits = defineEmits(['close'])

function closeIfShown() {
  if (props.show)
    emits('close')
}

onKeyStroke('Escape', closeIfShown)
</script>

<template>
  <Transition>
    <div
      v-if="show"
      class="fixed inset-0 z-50 h-screen flex items-center justify-center overflow-hidden bg-overlay-0/60 backdrop-blur"
      @click="closeIfShown"
    >
      <div class="relative mx-auto h-screen w-screen flex items-center justify-center overflow-x-hidden scrollbar-thumb-color-flamingo scrollbar-track-color-base scrollbar-w-1 scrollbar scrollbar-rounded">
        <button
          v-if="showClose"
          aria-label="close"
          class="absolute right-0 top-0 mx-10 my-2 p-4 text-xl text-blue leading-5 transition duration-100 hover:text-sky focus:outline-none"
          @click="closeIfShown"
        >
          <div class="i-carbon-close-filled" />
        </button>
        <img class="h-auto w-screen cursor-pointer object-cover" :src="image" alt="lightbox" :width="800" :height="500">
      </div>
    </div>
  </Transition>
</template>
