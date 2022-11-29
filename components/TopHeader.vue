<script lang=ts setup>
const navOpened = ref(false)
</script>

<template>
  <header class="w-full header">
    <nav
      class="shadow-2xl bg-base-1"
      :class="{ 'rounded-lg': navOpened, 'rounded-full': !navOpened }"
    >
      <div class="px-2 mx-auto">
        <div class="relative flex items-center justify-between py-1">
          <div class="inset-y-0 left-0 flex items-center sm:hidden">
            <!-- Mobile menu button -->
            <HamburgerButton :nav-opened="navOpened" @click="navOpened = !navOpened" />
          </div>
          <div class="flex w-full items-center justify-between ">
            <div class="justify-self-end flex items-center gap-5">
              <slot name="leftSide" />
            </div>
            <div class="justify-self-end flex items-center gap-0.5">
              <slot name="rightSide" />
            </div>
          </div>
        </div>
      </div>
      <div v-if="navOpened" class="block sm:hidden ">
        <slot name="hamburgerContent" />
      </div>
    </nav>
  </header>
</template>

