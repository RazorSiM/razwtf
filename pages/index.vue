<script lang="ts" setup>
definePageMeta({
  layout: 'default',
})

const { data: projects } = await useAsyncData('projects', () => queryContent('projects').limit(3).find())

const distroIcon = 'M11.390232.60509C10.375655 3.09168 9.764285 4.7185 8.63513 7.13162c.692712.734695 1.542857 1.589214 2.923032 2.553937-1.484256-.610496-2.49621-1.223615-3.25277-1.859475-1.444897 3.015743-3.710204 7.311953-8.30554 15.568513 3.612246-2.08513 6.411955-3.36997 9.020993-3.861516-.111954-.48105-.175802-1.003208-.17143-1.54723l.0035-.115453c.057725-2.314286 1.261224-4.09417 2.68688-3.972595 1.425656.119825 2.53382 2.095627 2.477843 4.409038-.010496.43557-.06035.85452-.146064 1.242857 2.58105.504665 5.351895 1.78688 8.914286 3.844024-.702333-1.29271-1.329447-2.4586-1.928572-3.569387-.943732-.731196-1.926822-1.6828-3.933236-2.71312 1.3793.3586 2.366764.77143 3.136443 1.23411C13.970407 7.010922 13.478862 5.503924 11.390232.60509zM22.897813 21.360193v-.623615h-.233528v-.083965h.561516v.083965h-.2344v.623615h-.093587M23.322886 21.360193v-.70758h.14169l.167056.501166c.015744.04723.027114.082215.03411.10583.007873-.025365.020118-.06385.038485-.113703l.168805-.493294h.126822v.70758h-.090962v-.593003l-.206414.593003h-.083965l-.204665-.602624v.602623h-.090962'

const distroTitle = 'Arch Linux'
const { page } = useContent()
</script>

<template>
  <TerminalShell
    title="Intro"
    distro-title="Arch Linux"
    :distro-icon="distroIcon"
    class="mx-auto overflow-x-hidden shadow-3xl container lg:max-w-6xl"
  >
    <TerminalCommand
      command="./intro.sh"
      :distro-icon="distroIcon"
      :distro-title="distroTitle"
    />
    <div>
      <TerminalAsciiLogo />
      <h2
        class="text-center text-2xl font-normal leading-tight md:text-4xl"
      >
        <em class="font-serif"><span class="text-primary">Web Designer</span> & <span class="text-secondary">Developer</span></em>
      </h2>
    </div>
    <SocialLinks :socials="socials" class="mt-5 w-full justify-center" />
    <TerminalCommand
      command="bat about"
      :distro-icon="distroIcon"
      :distro-title="distroTitle"
    />

    <div class="mx-auto max-w-2xl text-lg">
      <ContentRenderer :key="page._id" :value="page" />
    </div>
  </TerminalShell>
  <div class="mx-auto mt-20 container lg:max-w-6xl">
    <div v-if="projects && projects.length > 0" class="mt-20">
      <GlobSubtitle class="mb-8 flex items-center gap-2">
        Latest Projects <GlobEmoji emoji="i-fluent-emoji-hammer-and-pick" />
      </GlobSubtitle>
      <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ContentCard v-for="project in projects" :key="project._path" :title="project.title ?? ''" :image="project.hero" :excerpt="project.description ?? ''" :url="project._path ?? ''" :date="project.date" :time-to-read="project.readingTime?.text" />
      </div>
      <div class="mt-5 w-full flex justify-end">
        <NuxtLink class="hover:text-accent flex gap-2 text-right text-xl font-serif transition" to="/projects">
          All projects <GlobEmoji emoji="i-fluent-emoji-right-arrow" />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
