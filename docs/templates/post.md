---
title: The Title of the Note
date: 2026-01-01
description: One sentence. Rendered as the standfirst above the article and used as the meta description.
tags: [Keyboards, Design]
cover: /blog/slug/cover.webp
draft: false
---

## How to use this template

Delete this section once you have copied the file.

Copy to `content/blog/<slug>.md`. The file name is the URL, so
`content/blog/on-keycap-profiles.md` publishes at `/blog/on-keycap-profiles`.

Only `title` and `date` are required. `draft: true` keeps a post out of the
site, RSS and the sitemap. The full field reference is in
[ARCHITECTURE.md](../../ARCHITECTURE.md#the-frontmatter-contract).

Two things happen around the first post:

- Publishing the first non-draft post switches the blog on across the site. The
  nav link, the footer link, the homepage Notes section, RSS and search all
  appear on their own, and emptying the folder hides them again.
- A brand-new tag needs a rebuild. Tag routes are enumerated from frontmatter
  during config evaluation so they can be prerendered.

Start the real body below, at `##`. Never open with an `# H1`: the article
template renders the title from frontmatter. The first paragraph gets the
Fraunces drop cap, so give it a real first line. Every `##` and `###` becomes an
entry in the sticky table of contents, and a post with no headings falls back to
a single-column layout.

## First section

Standard markdown throughout. Inline `code` sits on a fixed dark chip, and
fenced blocks get the labelled chrome with a filename and language:

```ts [utils/example.ts]
export function greet(name: string) {
  return `hello, ${name}`
}
```

### A subsection

Subheadings nest one level in the table of contents.

## Second section

Images break out wider than the text column:

![Alt text that describes the image](/blog/slug/figure.webp)

Callouts are available as `::note`, `::tip`, `::warning` and `::info`:

::tip{title="Worth knowing"}
Short asides live here.
::
