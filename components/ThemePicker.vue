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
    <ListboxButton aria-label="Theme Picker" class="bg-surface-0 rounded-full h-8 w-8 flex items-center justify-center ring-1 ring-transparent focus:outline-none active:( ring-1 ring-accent ) hover:( bg-surface-1 shadow-md ) transition shadow">
      <div class="i-carbon-color-palette" />
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
        class="
          flex flex-col absolute rounded-md mt-1 right-0 shadow-lg bg-overlay-0 max-h-300px overflow-y-auto z-1 shadow"
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
            class=" px-3 py-2 transition flex justify-between items-center leading-none capitalize hover:(bg-overlay-1)"
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
