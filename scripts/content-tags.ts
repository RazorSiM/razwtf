// Build-time helper for nuxt.config.ts: enumerate `/blog/tag/<slug>` routes so
// `nitro.prerender.routes` can list them explicitly (see raz-paj). This runs
// at nuxt.config.ts *eval* time - before Nuxt has bootstrapped, so @nuxt/content
// hasn't parsed anything into its build database yet. Reading the frontmatter
// straight off disk keeps this synchronous and dependency-free (no `yaml`
// package is hoisted to the root node_modules under this pnpm setup).
import { readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

import { slugifyTag } from '../app/utils/tags'

const BLOG_DIR = fileURLToPath(new URL('../content/blog', import.meta.url))

interface FrontMatter {
  tags: string[]
  draft: boolean
}

function parseFrontMatter(raw: string): FrontMatter {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const fm = match?.[1] ?? ''

  const draft = /^draft:\s*true\s*$/m.test(fm)

  const tagsMatch = fm.match(/^tags:\s*\[([^\]]*)\]/m)
  const tags = tagsMatch
    ? (tagsMatch[1] ?? '')
        .split(',')
        .map((t) => t.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean)
    : []

  return { tags, draft }
}

/**
 * Every `/blog/tag/<slug>` route used by at least one published (non-draft)
 * post - used to seed `nitro.prerender.routes` so `nuxt generate` emits tag
 * pages even though nothing in the initially-crawled route set links to them
 * before the blog pages themselves are rendered.
 */
export function getBlogTagRoutes(): string[] {
  let files: string[]
  try {
    files = readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))
  } catch {
    return []
  }

  const slugs = new Set<string>()
  for (const file of files) {
    const raw = readFileSync(`${BLOG_DIR}/${file}`, 'utf8')
    const { tags, draft } = parseFrontMatter(raw)
    if (draft) continue
    for (const tag of tags) slugs.add(slugifyTag(tag))
  }

  return [...slugs].sort().map((slug) => `/blog/tag/${slug}`)
}
