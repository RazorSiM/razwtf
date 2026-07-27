// queryCollection is imported EXPLICITLY rather than left to the auto-import:
// see the note in rss.xml.ts. Short version - nitro-routes.d.ts pulls server
// routes into the app TS project, where the auto-import is the client's
// 1-argument form and this file would not type-check.
import { queryCollection } from '@nuxt/content/server'
import { SitemapStream, streamToPromise } from 'sitemap'

import { slugifyTag } from '../../app/utils/tags'

// Normalise a frontmatter `date` (Date | string | undefined) to an ISO string
// for <lastmod>, or undefined when absent.
function toLastmod(date: unknown): string | undefined {
  if (!date) return undefined
  const d = date instanceof Date ? date : new Date(date as string)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString()
}

export default defineEventHandler(async (event) => {
  // Every routable document across the page-type collections. The three
  // singleton pages each own a typed collection, so they are gathered by name
  // rather than from one catch-all `pages` collection.
  const singletons = (
    await Promise.all([
      queryCollection(event, 'home').first(),
      queryCollection(event, 'about').first(),
      queryCollection(event, 'projectsIndex').first(),
    ])
  ).filter(Boolean)
  const projects = await queryCollection(event, 'projects').all()
  const posts = (await queryCollection(event, 'posts').all()).filter((p) => !p.draft)

  const sitemap = new SitemapStream({ hostname: 'https://raz.wtf' })

  // Static content-driven pages (index, about, projects listing) - undated.
  for (const doc of singletons) sitemap.write({ url: doc!.path, changefreq: 'monthly' })

  // Project case studies + blog articles carry a date -> emit <lastmod>.
  for (const doc of projects) sitemap.write({ url: doc.path, changefreq: 'monthly', lastmod: toLastmod(doc.date) })
  for (const post of posts) sitemap.write({ url: post.path, changefreq: 'monthly', lastmod: toLastmod(post.date) })

  // Blog index is a Vue page, not a content document, so add it explicitly.
  // Only when something is published: with an empty blog the nav hides the
  // Notes link (raz-je5), so advertising /blog to crawlers would point them
  // at a page the site itself treats as non-existent.
  if (posts.length) sitemap.write({ url: '/blog', changefreq: 'weekly' })

  // One /blog/tag/<slug> page per distinct tag used by a published post.
  const tagSlugs = new Set<string>()
  for (const post of posts) {
    for (const tag of post.tags ?? []) tagSlugs.add(slugifyTag(tag))
  }
  for (const slug of [...tagSlugs].sort()) sitemap.write({ url: `/blog/tag/${slug}`, changefreq: 'weekly' })

  sitemap.end()
  return streamToPromise(sitemap)
})
