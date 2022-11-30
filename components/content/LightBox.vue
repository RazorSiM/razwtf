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
  <Transition name="fade">
    <div
      v-if="show"
      class="fixed inset-0 z-50 flex items-center justify-center h-screen bg-base1/90 overflow-hidden"
      @click="closeIfShown"
    >
      <div class="flex w-full shadow-lg">
        <div class="relative max-h-screen mx-auto overflow-auto">
          <button
            v-if="showClose"
            aria-label="close"
            class="absolute top-0 right-0 p-4 mx-10 my-2 text-xl leading-5 transition duration-100 text-faccent hover:text-tertiary focus:outline-none"
            @click="closeIfShown"
          >
            <div class="i-carbon-close-filled" />
          </button>
          <img :src="image" class="w-auto h-full mx-auto">
        </div>
      </div>
    </div>
  </Transition>
</template>

  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.6s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  </style>

