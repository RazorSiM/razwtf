// Deterministic tag -> route-slug mapping, shared between the app (tag chip
// links, the /blog/tag/[tag] page) and the build-time route enumerator
// (scripts/content-tags.ts, consumed by nuxt.config.ts). Kept dependency-free
// - no nuxt/content or auto-import reliance - so a plain Node script can
// import it too.
export function slugifyTag(tag: string): string {
  return tag
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
