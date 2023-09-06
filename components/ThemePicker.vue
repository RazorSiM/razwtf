<script lang="ts" setup>
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/vue'

interface Props {
  themes: string[]
  themeSelected: string
}
const props = defineProps<Props>()
const emits = defineEmits(['themeSelection'])
const listValue = ref(props.themeSelected)
</script>

<template>
  <Listbox v-model="listValue" as="div" class="relative">
    <ListboxButton aria-label="Theme Picker" class="flex items-center justify-center rounded-full text-2xl shadow transition">
      <div class="i-fluent-emoji-artist-palette" />
    </ListboxButton>
    <transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-out"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <ListboxOptions
        as="div"
        class="absolute right-0 z-1 mt-1 max-h-300px flex flex-col overflow-y-auto rounded-md bg-overlay-0 shadow shadow-lg"
      >
        <ListboxOption
          v-for="theme in themes"
          :key="theme"
          v-slot="{ active, selected }"
          as="template"
          :value="theme"
          :disabled="theme === themeSelected"
          class="cursor-pointer"
          @click="emits('themeSelection', theme)"
        >
          <div
            class="flex items-center justify-between px-3 py-2 leading-none capitalize transition hover:(bg-overlay-1)"
            :class="{ 'bg-overlay-0': active, 'bg-overlay-2': selected }"
          >
            {{ theme.replace("-", " ") }}
            <div v-show="selected" class="i-carbon-checkmark-outline" />
          </div>
        </ListboxOption>
      </ListboxOptions>
    </transition>
  </Listbox>
</template>
