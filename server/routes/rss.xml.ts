// RSS 2.0 feed of published notes, newest first (raz-5c6). Mirrors
// sitemap.xml.ts's shape (a Nitro server route querying content directly);
// prerendered explicitly via nitro.prerender.routes in nuxt.config.ts since
// nothing links to it for the crawler to discover.
const SITE = 'https://raz.wtf'

function escapeXml(value: string): string {
  return value.replace(/[<>&'"]/g, (char) => {
    switch (char) {
      case '<': return '&lt;'
      case '>': return '&gt;'
      case '&': return '&amp;'
      case '\'': return '&apos;'
      default: return '&quot;'
    }
  })
}

export default defineEventHandler(async (event) => {
  const posts = await queryCollection(event, 'posts')
    .where('draft', '=', false)
    .order('date', 'DESC')
    .all()

  const items = posts.map((post) => {
    const link = `${SITE}${post.path}`
    return [
      '    <item>',
      `      <title>${escapeXml(post.title)}</title>`,
      `      <link>${link}</link>`,
      `      <guid isPermaLink="true">${link}</guid>`,
      post.description ? `      <description>${escapeXml(post.description)}</description>` : '',
      `      <pubDate>${new Date(post.date).toUTCString()}</pubDate>`,
      '    </item>',
    ].filter(Boolean).join('\n')
  }).join('\n')

  const lastBuildDate = posts[0] ? new Date(posts[0].date).toUTCString() : new Date().toUTCString()

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    '  <channel>',
    '    <title>raz.wtf · Notes</title>',
    `    <link>${SITE}/blog</link>`,
    '    <description>Notes &amp; experiments: a blog, but not a blog.</description>',
    '    <language>en-us</language>',
    `    <lastBuildDate>${lastBuildDate}</lastBuildDate>`,
    `    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />`,
    items,
    '  </channel>',
    '</rss>',
  ].filter(Boolean).join('\n')

  // Content-type is applied via nitro routeRules in nuxt.config (see there).
  return xml
})
