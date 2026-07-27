---
title: Project Name
description: One or two sentences. Used as the lead paragraph, the meta description and the card excerpt.
date: 2026-01-01
hero: /project-slug/hero.webp
heroCaption: "Hero render · Project Name · Blender"
type: "SWG keycap set"
year: 2026
role: "Concept · design · 3D render"
kicker: "Featured · SWG · 2026 · Concept · 3D"
tags: [Keycaps, Keyboards, Design]
tech: [Blender, Illustrator]
accent: green
featured: false
spotlight: false
order: 10
links:
  - label: Discord
    url: https://discord.gg/xxxxxxx
  - label: Geekhack IC
    url: https://geekhack.org/index.php?topic=000000
gallery:
  - description: Kits
    images:
      - name: Base
        alt: Project Name base kit
        src: /project-slug/kits/base.webp
  - description: On a board
    images:
      - name: Rama M60
        alt: Project Name on a Rama M60
        src: /project-slug/boards/m60.webp
---

## How to use this template

Delete this section once you have copied the file.

Copy to `content/projects/<slug>.md`. The file name is the URL, so
`content/projects/my-set.md` publishes at `/projects/my-set`. Put its images
under `public/<slug>/` and reference them from the site root.

Only `title`, `description` and `date` are required. Delete any other field you
do not need: each one degrades gracefully rather than leaving a hole in the
page. The full field reference is in
[ARCHITECTURE.md](../../ARCHITECTURE.md#the-frontmatter-contract).

Notes on the fields above:

| Field | Notes |
| --- | --- |
| `type` | metabar label: what kind of thing this is |
| `kicker`, `role`, `year`, `collab` | editorial bits shown on cards without opening the case study |
| `tech` | doubles as the stack line in the Details block |
| `accent` | signature colour, one of `mauve` `lavender` `sky` `green` `peach` `blue` `teal` `pink` `yellow` |
| `featured` | `true` gives it the large card in the work grid |
| `spotlight` | `true` drives homepage section 02, and needs `spotlightCopy` below |
| `order` | lower sorts earlier on the homepage; omit to sort by `date` |
| `gallery` | ordered groups, each with a heading and its images; every image across every group shares one lightbox |

Two optional blocks are left out of the frontmatter above because most projects
do not need them.

**`spotlightCopy`**, required only when `spotlight: true`. It lives on the
project rather than on the homepage so that moving the spotlight elsewhere takes
its prose along. Before switching the spotlight, read
[the gotcha](../../ARCHITECTURE.md#gotchas) about the homepage block still being
partly bespoke.

```yaml
spotlightCopy:
  heading: A line that carries the idea.
  pullquote: The one quotable sentence about this set.
  pullquoteCite: on the design
  body: Markdown, so *emphasis* and [links](https://example.com) work.
  palette:
    - token: green
      label: Accent · bright green
  specs:
    - label: Reference
      value: early digital interfaces
```

**`head`**, a raw `<head>` passthrough for social copy that should differ from
`description`. Site-wide OG and Twitter tags already come from `app.vue`, so add
this only for a bespoke card. Relative image paths are absolutised by the page
template.

```yaml
head:
  meta:
    - property: og:title
      content: Raz.WTF - Project Name
    - property: og:image
      content: /project-slug/hero.webp
```

## About the set

Start the real body here, at `##`. Never open with an `# H1`: the page template
renders the title from frontmatter, and a leading H1 in the body produces two.

Standard markdown throughout: **bold**, *italic*,
[links](https://raz.wtf), lists, tables and fenced code all pick up the site's
prose styling.

## The concept

A full-width image that opens in the shared lightbox on click:

::img-lightbox
---
alt: Describe the image for screen readers
src: /project-slug/palette.webp
---
::

Callouts are available as `::note`, `::tip`, `::warning` and `::info`, each with
an optional title:

::warning{title="This group buy has ended"}
Kept for the archive.
::
