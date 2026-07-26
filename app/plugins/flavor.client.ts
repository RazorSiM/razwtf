// Adopt the persisted flavor preference on startup and keep <html data-flavor>
// in sync with the reactive state. The pre-paint script in nuxt.config.ts has
// already applied the correct attribute, so this never causes a flash.
export default defineNuxtPlugin(() => {
  const { preference, flavor } = useFlavor()

  try {
    const stored = localStorage.getItem('flavor') as FlavorPref | null
    if (stored)
      preference.value = stored
  }
  catch {}

  const apply = () => document.documentElement.setAttribute('data-flavor', flavor.value)
  apply()
  watch(flavor, apply)
})
