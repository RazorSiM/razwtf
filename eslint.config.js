import antfu from '@antfu/eslint-config'

export default antfu(
  {
    vue: true,
    typescript: true,
    unocss: true,
    // Both are local-only working directories kept out of the repo via
    // .git/info/exclude, so linting them only ever produces noise: `.beads`
    // is the issue tracker's own database, `design-mockups` is the frozen
    // design spec and is not maintained as source.
    ignores: ['.beads/**', 'design-mockups/**'],
  },
  {
    files: ['pnpm-workspace.yaml'],
    rules: {
      // The rule wants `trustPolicy: no-downgrade`, which this dependency tree
      // cannot satisfy: nuxt 4.5 pulls semver@6.3.1 transitively (via
      // @nuxt/vite-builder -> @vitejs/plugin-vue-jsx -> @babel/core), and that
      // version has no provenance attestation where an earlier one did, so pnpm
      // rejects it as a trust downgrade. Rebuilding the lockfile from a fresh
      // resolution reproduces it, so it is the graph and not a stale lockfile.
      // Revisit when nuxt's chain stops depending on semver 6.
      // `shellEmulator: true`, the other setting the rule wants, IS set.
      'pnpm/yaml-enforce-settings': 'off',
    },
  },
)
