<script lang=ts setup>
const navOpened = ref(false)
</script>

<template>
  <header class="header w-full">
    <nav
      class="bg-mantle shadow-3xl"
      :class="{ 'rounded-lg': navOpened, 'rounded-full': !navOpened }"
    >
      <div class="mx-auto px-2">
        <div class="relative flex items-center justify-between py-1">
          <div class="inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <HamburgerButton :nav-opened="navOpened" @click="navOpened = !navOpened" />
          </div>
          <div class="w-full flex items-center justify-between">
            <div class="flex items-center justify-self-end gap-5">
              <slot name="leftSide" />
            </div>
            <div class="flex items-center justify-self-end gap-2">
              <slot name="rightSide" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="navOpened" class="block sm:hidden">
        <slot name="hamburgerContent" />
      </div>
    </nav>
  </header>
</template>
