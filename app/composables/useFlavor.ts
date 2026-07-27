// Studio Terminal flavor system - 4 Catppuccin flavors + an "auto" preference
// that follows the OS color scheme. The concrete flavor is reflected on
// <html data-flavor="…">; the pre-paint script in nuxt.config.ts sets it before
// hydration and plugins/flavor.client.ts keeps it in sync afterwards.

export type Flavor = 'latte' | 'frappe' | 'macchiato' | 'mocha'
export type FlavorPref = 'auto' | Flavor

export const FLAVORS = ['latte', 'frappe', 'macchiato', 'mocha'] as const
// Cycle order for the switcher button (auto is reachable and is the default).
export const FLAVOR_CYCLE = ['auto', 'latte', 'frappe', 'macchiato', 'mocha'] as const

export function useFlavor() {
  // Shared, SSR-safe preference. Seeds to 'auto'; the client plugin adopts the
  // persisted value on startup (localStorage key "flavor").
  const preference = useState<FlavorPref>('flavor-pref', () => 'auto')
  const systemLight = useMediaQuery('(prefers-color-scheme: light)')

  const flavor = computed<Flavor>(() =>
    preference.value === 'auto' ? (systemLight.value ? 'latte' : 'mocha') : preference.value,
  )
  const isAuto = computed(() => preference.value === 'auto')

  function setFlavor(pref: FlavorPref) {
    preference.value = pref
    if (import.meta.client) {
      try {
        localStorage.setItem('flavor', pref)
      } catch {}
    }
  }

  function cycle() {
    const i = FLAVOR_CYCLE.indexOf(preference.value)
    setFlavor(FLAVOR_CYCLE[(i + 1) % FLAVOR_CYCLE.length]!)
  }

  return { FLAVORS, FLAVOR_CYCLE, preference, flavor, isAuto, setFlavor, cycle }
}
