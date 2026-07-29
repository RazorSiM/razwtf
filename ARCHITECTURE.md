# Architecture

How raz.wtf is built, and the reasoning behind the parts that are not obvious
from reading the code. Setup and commands are in [README.md](./README.md);
working instructions for coding agents are in [AGENTS.md](./AGENTS.md).

- [Shape of the site](#shape-of-the-site)
- [Directory conventions](#directory-conventions)
- [Content collections and routing](#content-collections-and-routing)
- [The frontmatter contract](#the-frontmatter-contract)
- [Copy lives in content, not in templates](#copy-lives-in-content-not-in-templates)
- [Theming: four flavours](#theming-four-flavours)
- [Contrast rules](#contrast-rules)
- [Styling system](#styling-system)
- [The reading measure](#the-reading-measure)
- [Motion](#motion)
- [SEO and metadata](#seo-and-metadata)
- [Blog machinery](#blog-machinery)
- [Build and deploy](#build-and-deploy)
- [Gotchas](#gotchas)

## Shape of the site

A static site. `nuxt generate` prerenders every route to HTML in `dist`, ships
the content database as WASM SQLite for client-side navigation and search, and
needs no server at runtime.

Three ideas carry most of the design:

1. **Content owns the words, Vue owns the layout.** Which sections exist, their
   order and their styling live in `.vue` files. The strings live in `content/`,
   validated by zod. This is deliberately not a page builder: each schema
   describes the copy for a fixed set of sections, so the fields stay typed and
   the layout stays designed.
2. **The design system is UnoCSS shortcuts.** Named shortcuts in
   `uno.config.ts` (`eyebrow`, `secmark`, `btn-primary`, `kicker`, `chip`) are
   the vocabulary. Hand-written CSS is reserved for what utilities genuinely
   cannot reach.
3. **Four flavours, resolved before first paint.** Colour is a set of CSS custom
   properties swapped by one attribute on `<html>`, so there is no theme flash
   and no duplicated stylesheet.

## Directory conventions

`app/` is the Nuxt 4 app directory. Within it:

| Directory             | Holds                                                                               | Naming                                                                                                    |
| --------------------- | ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `components/ui/`      | design-system primitives reused across pages                                        | **bare-named** (`<WorkCard>`, `<TagList>`, `<SectionMarker>`) via `pathPrefix: false` in `nuxt.config.ts` |
| `components/layout/`  | header, footer, scroll-to-top                                                       | prefixed (`<LayoutAppHeader>`)                                                                            |
| `components/content/` | MDC block components and Prose overrides, callable from markdown                    | prefixed in Vue, kebab-case in markdown (`::img-lightbox`)                                                |
| `composables/`        | shared reactive state and behaviour                                                 | `useX()`                                                                                                  |
| `utils/`              | pure helpers, no reactivity                                                         | plain functions                                                                                           |
| `plugins/`            | flavour sync, the `v-reveal` scroll-reveal directive                                | `.client.ts` where client-only                                                                            |
| `assets/css/`         | `main.css` (tokens, base, prose, motion) importing `themes.css` (the four palettes) |                                                                                                           |

Root-level: `content.config.ts` is the frontmatter contract, `uno.config.ts` is
the design tokens, `scripts/` holds build-time helpers that run during config
evaluation, and `server/routes/` holds the two generated feeds.

Only `components/ui/` is bare-named. Adding a bare-named component elsewhere
breaks the convention that tells you, from a template, whether you are looking
at a primitive or at page-specific chrome.

## Content collections and routing

Each singleton page owns its own richly-typed collection rather than sharing one
catch-all `pages` collection. That way the homepage schema can require
`hero.eyebrow` without every other page inheriting the field.

| Collection             | Source                                     | Route                    | Rendered by                     |
| ---------------------- | ------------------------------------------ | ------------------------ | ------------------------------- |
| `home`                 | `content/index.md`                         | `/`                      | `app/pages/index.vue`           |
| `about`                | `content/about.md`                         | `/about`                 | `app/pages/about.vue`           |
| `projectsIndex`        | `content/projects/index.md`                | `/projects`              | `app/pages/projects/index.vue`  |
| `projects`             | `content/projects/*.md` (minus `index.md`) | `/projects/<slug>`       | `app/pages/projects/[slug].vue` |
| `blogIndex`            | `content/blog.md`                          | `/blog`                  | `app/pages/blog/index.vue`      |
| `posts`                | `content/blog/**/*.md`                     | `/blog/<slug>`           | `app/pages/blog/[slug].vue`     |
| (derived from `posts`) | frontmatter `tags`                         | `/blog/tag/<tag>`        | `app/pages/blog/tag/[tag].vue`  |
| `site`                 | `content/site.yml`                         | none (`data` collection) | global chrome                   |
| `pages`                | any other `content/*.md`                   | `/<slug>`                | `app/pages/[...slug].vue`       |

Two consequences worth remembering:

- The notes index is `content/blog.md`, at the content root, not
  `content/blog/index.md`. If it sat inside `blog/`, the `posts` glob would try
  to parse it as a post and fail its schema.
- `app/pages/about.vue` takes precedence over the `[...slug].vue` catch-all, so
  `about.md` gets the editorial masthead rather than a bare reading column.
- Authoring templates live in `docs/templates/`, deliberately outside
  `content/`. A template inside `content/projects/` would be matched by the
  glob and fail validation on its placeholder values.

## The frontmatter contract

Defined in `content.config.ts`. zod validates at build time, so a malformed file
fails the build instead of rendering a half-empty page. Copy-paste starting
points: `docs/templates/project.md`, `docs/templates/post.md`.

### Projects

| Field                              | Required | Purpose                                                                                                          |
| ---------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------------- |
| `title`                            | yes      | h1, card title, `<title>`                                                                                        |
| `description`                      | yes      | lead paragraph, meta description, card excerpt fallback                                                          |
| `date`                             | yes      | ordering fallback and `<lastmod>`                                                                                |
| `hero` (or `cover` / `image`)      | no       | hero render and card image                                                                                       |
| `heroCaption`                      | no       | caption under the hero; falls back to the title                                                                  |
| `type`                             | no       | hero metabar label ("SWG keycap set", "Vue template")                                                            |
| `year`, `role`, `collab`, `kicker` | no       | card and metabar editorial bits                                                                                  |
| `tags`, `tech`                     | no       | tag chips; `tech` doubles as the Details stack line                                                              |
| `accent`                           | no       | per-project signature colour, one of the nine Catppuccin accent names                                            |
| `featured`                         | no       | large card in the work grid (default `false`)                                                                    |
| `spotlight`                        | no       | drives homepage section 02 (default `false`)                                                                     |
| `spotlightCopy`                    | no       | that section's heading, pullquote, body, palette chips, extra spec rows                                          |
| `order`                            | no       | homepage ordering, lower first; falls back to `date`                                                             |
| `gallery`                          | no       | ordered groups of `{ description, images[] }`, rendered as the labelled gallery, all images sharing one lightbox |
| `links`, `url`                     | no       | outbound links (repo, IC thread, Discord)                                                                        |
| `head`                             | no       | raw `<head>` passthrough for bespoke OG or Twitter tags                                                          |

Body convention: **do not start the markdown with an `# H1`.** The page template
renders the title from frontmatter, so a leading H1 in the body produces two.

`spotlightCopy` lives on the project rather than on the homepage on purpose:
moving `spotlight: true` to another project would otherwise leave the previous
set's prose stranded on the homepage. One caveat is recorded in
[Gotchas](#gotchas): the spotlight section markup is still partly bespoke.

### Posts

| Field         | Required | Purpose                                                                    |
| ------------- | -------- | -------------------------------------------------------------------------- |
| `title`       | yes      | h1, card title                                                             |
| `date`        | yes      | byline, ordering, RSS `pubDate`                                            |
| `description` | no       | standfirst and meta description                                            |
| `tags`        | no       | accent-cycled chips, and the tag pages they generate                       |
| `draft`       | no       | `true` hides it everywhere including RSS and the sitemap (default `false`) |
| `cover`       | no       | list and article image                                                     |

The article template reads `body.toc.links` for its sticky table of contents and
falls back to a single-column layout when a post has no headings.

## Copy lives in content, not in templates

`content/site.yml` (the `site` collection) holds the strings that are not part of
any one page: author identity for bylines, the footer including its vim-style
status line, the labels on post and case-study furniture, and the error page.

Two patterns show up in these schemas and look odd until you know why:

- **Split fields** such as `nameBefore` / `nameEm` / `nameAfter`. A single
  string could not carry the italic mauve `<em>` treatment through
  `KineticText`, which splits per word for animation. Splitting the copy in
  frontmatter keeps the typography without putting markup in a data field.
- **`requiresPosts`** on footer links. The Notes link is data, but its
  visibility depends on whether any post is published, so the flag travels with
  the link instead of being hardcoded in the footer component.

## Theming: four flavours

Every colour is a **space-separated `R G B` triple** in
`app/assets/css/themes.css`:

```css
:root[data-flavor='mocha'] {
  --mauve: 203 166 247;
}
```

That format composes with modern alpha syntax, `rgb(var(--mauve) / .5)`, which
is what makes UnoCSS opacity modifiers work (`text-mauve/28`, `bg-crust/72`).

The pipeline:

1. A blocking script in `nuxt.config.ts` `app.head` runs before first paint. It
   reads `localStorage.flavor` (or resolves `auto` against
   `prefers-color-scheme`), sets `<html data-flavor="…">`, and adds
   `class="js"`. No flash, and the canvas logo does not mismatch on hydration.
2. `useFlavor()` owns the preference as `useState`, so SSR and client agree.
   `FLAVOR_CYCLE` is `auto → latte → frappe → macchiato → mocha`.
3. `plugins/flavor.client.ts` adopts the persisted value on startup and keeps
   the attribute in sync afterwards.
4. `uno.config.ts` maps each token to `rgb(var(--token))`.

The `<alpha-value>` placeholder from wind3 must **not** appear in those colour
definitions. `presetWind4` does opacity through `color-mix()` and never
substitutes the placeholder, which yields invalid CSS and makes every colour
utility silently fall back to the inherited colour.

## Contrast rules

Non-obvious and easy to regress, so it is written down.

**The page background in the light flavour is `--crust`, not `--base`.** Accent
text has to clear 4.5:1 against crust. That is why `themes.css` defines "ink"
variants used for accent-coloured _text_:

```css
--peach-ink: var(--peach); /* dark flavours: same colour */
```

with darker overrides in the latte block and in the
`prefers-color-scheme: light` fallback. Swatch dots and borders keep the true
bright accent; only text routes through `-ink`.

**The code surface is pinned dark in all four flavours.** Highlighting uses one
theme, `catppuccin-mocha`, whose tokens are tuned for a dark background and
would wash out on a near-white one. `--code-bg`, `--code-bar`, `--code-fg`,
`--code-muted` and `--code-hair` are therefore fixed values in `main.css :root`,
consumed by `.prose pre`, `ProsePre.vue` and inline `.prose code`. Inline code is
peach on that constant dark chip for the same reason.

Those pinned values are Mocha's own: `--code-bg` is its `editor.background`
(`#1e1e2e`) and `--code-fg` its `editor.foreground` (`#cdd6f4`), so the
highlighter and the surface under it are one palette. Keep them in sync if the
theme changes.

Following the flavour instead would mean shipping all four Catppuccin themes.
Shiki supports that via a theme object, but Content keys the variants off classes
on `<html>` (`html.dark`) while this site uses `data-flavor`, so it would need
its own CSS wiring, the code surface tokens would have to become flavour-aware
again, and `catppuccin-latte`'s comment token is only 3.49:1 on its own base, so
it would still need a contrast override. Tracked, not done.

**Accepted tradeoff (Raz's call).** Muted mono micro-labels, the
`overlay-1` / `subtext-0` kickers, eyebrows, nav items, status line, section
markers and the table-of-contents counter, sit at 3.9-4.4:1 in the two light
flavours. Latte's muted ramp is compressed after being darkened for AA, so no
muted grey clears 4.5:1 on its crust background. These elements are decorative
and are intentionally left as they are. Only functional contrast was fixed: code
surfaces, and the latte accent CTA and badge, which take white text and a hover
that darkens rather than lightening to lavender.

**Verification gotcha.** `getComputedStyle` serializes these colours as
`oklab(…)`, so JavaScript contrast probes misparse them and report nonsense
ratios. Trust the token maths, or measure from a screenshot.

## Styling system

`uno.config.ts` holds the design tokens and the shortcut vocabulary:

- **Type scale.** `--fs-*` custom properties in `main.css`, mirrored as UnoCSS
  text sizes (`text-micro` through `text-mark`). Each entry must be a
  `{ fontSize, lineHeight }` object: a bare string makes wind4 emit an
  undefined `var(--text-*-fontSize)` and headings collapse to 16px.
- **Shortcuts** are the design system. Prefer extending them over adding
  bespoke classes, and keep per-instance colour inline (accent swatches, a
  card's `--c`).
- **Breakpoints** carry semantic names from the mockups: `dots`, `foot`, `caps`,
  `nav`, `wide` (900px), `spot`. `wide` was originally called `grid`, which
  collided with the `grid-*` utilities and silently wrapped every `grid-cols-…`
  in a min-width media query. Do not name a breakpoint after a utility prefix.

**UnoCSS is the default; scoped CSS needs a reason.** Hover choreography is not
one of them: a root `group` plus `group-hover:` covers coordinated parent-hover
across descendants, and `after:absolute after:inset-0` covers a stretched link,
so cards carry no scoped CSS at all. The reasons that do qualify, and where they
are used:

| Reason                                                | Where                                                      |
| ----------------------------------------------------- | ---------------------------------------------------------- |
| `@keyframes`                                          | `main.css`, the hero caret and status pulse in `index.vue` |
| `:deep()` into markdown rendered by `ContentRenderer` | `.prose` in `main.css`, `blog/[slug].vue`, `index.vue`     |
| `:deep()` into an `<img>` slotted in by a caller      | `MediaFrame.vue`                                           |
| Sticky/scrollspy rail geometry                        | the TOC in `blog/[slug].vue`                               |
| `@font-face`, design tokens, base/reset rules         | `main.css`                                                 |

Two wind4 behaviours that will silently break animation if you assume otherwise:

- **`-translate-y-*` and `scale-x-*` compile to the standalone `translate` and
  `scale` properties, not to `transform`.** A transition naming `transform`
  therefore never fires for them, and the change snaps instead of easing. Name
  `translate` / `scale`, or use `transition-transform`, which wind4 expands to
  cover all four (`transform, translate, scale, rotate`).
- **Never point a theme entry at a CSS variable of the same name.**
  `theme.ease.out = 'var(--ease-out)'` made wind4 emit `--ease-out:
var(--ease-out)`, a custom-property cycle that resolves to nothing. Any
  `transition:` _shorthand_ containing it then becomes invalid at computed-value
  time and silently reverts to `all 0s`, which had killed the image zoom and
  every card hover transition site-wide. `theme.ease` now holds literal
  cubic-beziers, duplicated in `main.css` for hand-written CSS.

Hand CSS in `main.css` is limited to what utilities cannot express: `@font-face`,
tokens, the reset-adjacent base rules, keyframes and motion states, and `.prose`,
where the markup comes from rendered markdown and cannot be given classes.

Two behaviours of shortcuts that have bitten before:

- UnoCSS drops a bare `group` marker from inside a shortcut. Put `group` on the
  element itself (see `BackLink.vue`).
- `display` includes `font-optical-sizing: auto`. Fraunces headings look subtly
  wrong without it.

## The reading measure

Reading views use a centred breakout grid rather than one flat max-width. Text
sits at a comfortable line length while media, code, tables and callouts break
out to a wider frame:

```
--measure: 68ch        /* the text column, about 691px */
--measure-wide: 900px  /* the frame media breaks out to */
```

The grid lives on `.prose > div`, not on `.prose`. `@nuxt/content` wraps all
rendered output in a single `<div>`, so that wrapper is the real flow container:
`.prose > *` only ever sees the wrapper and never the content. The same applies
to vertical rhythm, which is why the spacing rules are `.prose > div > * `. Any
rule written against `.prose > *` will appear to do nothing.

`figure`, `pre`, `table`, `hr`, `.callout`, `.figbox`, `img` and anything marked
`.wide` span the full frame; everything else stays in the text column. On mobile
the breakout collapses to 100% with no overflow.

## Motion

- **Scroll reveals.** Add `data-reveal` to an element; `plugins/reveal.ts`
  observes it and springs it in with motion-v on intersect. Stagger siblings
  with `style="--rd:.08s"`. `motion-v` is imported dynamically and is not a
  direct dependency of the reveal path; without JS or with reduced motion
  preferred, elements resolve to their visible state immediately.
- **Kinetic type.** `KineticText.vue` uses `@chenglou/pretext` to fill a
  heading to its column width and cascade it per word. It is lazy: the import,
  split and measure all happen behind the component's own IntersectionObserver,
  so below-the-fold headings do no work until they approach the viewport.
  Reduced motion gets `layout` mode, which scales without splitting.
- **No layout shift.** The hero wordmark is pre-sized in CSS
  (`#hero-title { font-size: min(24.3vw, calc(var(--maxw) * 0.243)) }`) with the
  same width ratio the JavaScript will compute, so the correction that lands
  after fonts load shifts nothing. Changing the wordmark text means recomputing
  that ratio; the JS still fits it exactly either way.
- **Route choreography.** `RouteWipe.vue`, mounted in `app.vue`, owns the
  visible transition for full-motion users. The opacity-only `.page-*`
  transition in `main.css` is the reduced-motion and no-JS fallback.
- `will-change` on animated words is set inline for the duration of a cascade
  and cleared afterwards, rather than living in CSS, so the page does not retain
  a promoted layer per word.

A global `prefers-reduced-motion` block neutralises animations and transitions
and forces revealed elements visible.

## SEO and metadata

`app/app.vue` `useSeoMeta` is the **single source** for site-wide meta:
description, Twitter card, OG tags, and a canonical plus `og:url` computed from
the current route. Two rules learned the hard way:

- Do not add an `app.head.meta` array in `nuxt.config.ts`. It emits OG tags as
  `name=` (the protocol needs `property=`) and duplicates whatever `app.vue`
  already declares.
- OG and Twitter images must be absolute. Crawlers reject relative paths. Pages
  that take an image from frontmatter absolutise it before handing it to
  `useSeoMeta`.

Per-page overrides call `useSeoMeta` in the page component. `projects/[slug].vue`
additionally applies frontmatter `head` via `useHead(() => page.value?.head ?? {})`;
note that `useContentHead` is not auto-imported in this setup. `useSeoMeta` runs
after `useHead`, so it wins the meta dedupe for image tags.

Generated at build time: `server/routes/sitemap.xml.ts` (singletons, projects,
non-draft posts, tag pages, with `lastmod` from `date`),
`server/routes/rss.xml.ts`, and `public/robots.txt`. Favicons and
`site.webmanifest` are checked into `public/`.

## Blog machinery

The blog is fully built but currently has no posts, and hides itself
accordingly.

- `useHasPublishedPosts()` (`composables/useBlogVisibility.ts`) counts
  non-draft posts with `.count()`, keeping the payload to a single integer. The
  nav link, footer link and homepage Notes section all key off it.
- Tag pages are prerendered. `scripts/content-tags.ts` reads post frontmatter
  during config evaluation and feeds `nitro.prerender.routes`, because nothing
  the crawler reaches links to a tag page before the page that links it has
  itself been rendered. A new tag therefore requires a rebuild.
- Search is `useSearchCollection('posts')` from `@nuxt/content`, client-side,
  wired into `SearchField.vue` on the blog index.
- Related posts are ranked by shared tags, with a recency fallback.

## Build and deploy

```bash
devenv shell -- pnpm generate    # -> dist, 154 routes
```

The output directory used to be preset-dependent, and that was a trap the
Workers migration walked into. Nitro picks a preset from the environment when
none is given: locally it found nothing and used `static`, writing
`.output/public`, while Cloudflare Pages set `CF_PAGES` in the build environment,
std-env reported the provider, and nitro switched to `cloudflare_pages_static`
and wrote `dist` plus `_headers` and `_redirects`. One build command, two
different outputs, and nobody had to configure the difference.

Workers Builds sets no `CF_PAGES`. Left implicit, the production build would
quietly have taken the local path: output back to `.output/public` where
`assets.directory` is not looking, no `_headers` at all (so the feed content
types and every `immutable` cache rule gone), and the retroguardia 301 degraded
into a meta-refresh stub. So `nitro.preset` is now pinned in `nuxt.config.ts`,
and `pnpm build` carries `--preset node-server` to keep the Node-host build it
advertises. The preset name still says Pages because nitro has no separate
preset for Workers static assets; the output it produces is exactly what Workers
wants, which is a directory of plain files plus `_headers` and `_redirects` and
no `_worker.js`.

Four things make the static build work, all of which look removable and are
not:

1. **`content.experimental.sqliteConnector: 'native'`.** Node's built-in
   `node:sqlite` replaces the native `better-sqlite3` addon, which rendered fine
   in a Node server build but failed during prerender on NixOS ("Module did not
   self-register") and turned every content page into a 500. That failure no
   longer reproduces: checked on 2026-07-28, better-sqlite3 12.11.1 builds and
   loads cleanly under Node 26. The setting stays because taking a native addon
   out of the build entirely is worth more than the flag costs, not because the
   old crash is still waiting.
2. **Reka dialogs are wrapped in `<ClientOnly>`.** `DialogRoot` crashes static
   prerender ("Cannot read `ce` of null"). Both the header's mobile menu, which
   also has a static hamburger fallback, and the lightbox in
   `layouts/default.vue` are wrapped.
3. **`nitro.prerender.routes`** lists what the crawler cannot discover:
   `/sitemap.xml`, `/rss.xml`, the legacy `/projects/gmk-retroguardia` redirect,
   and every tag page.
4. **`nitro.prerender.autoSubfolderIndex: false`**, from Nuxt's Cloudflare
   deployment guide. It emits `about.html` instead of `about/index.html`, which
   is what Cloudflare's route matching expects. Without it every extension-less
   path answers with a 308 to its trailing-slash form, which both wastes a hop
   and desyncs the canonical URL: `app.vue` derives canonical and `og:url` from
   `route.path` (`/about`) while the served URL would be `/about/`. On Workers
   this pairs with `assets.html_handling`, which is why `wrangler.jsonc` sets
   that to `auto-trailing-slash` explicitly even though it is the default.
   The tradeoff is that a naive local static server (`python -m http.server`)
   will 404 on `/about`, since it only resolves directories; use a server that
   tries `.html` when verifying a local build by hand, or `wrangler dev`, which
   resolves it the way production does.

### Why the Node version decides whether the build works

Worth understanding before trying to build on an older runtime, because the
failure is total rather than a warning.

`@nuxt/content` keeps parsed markdown in a SQLite database that it builds during
`nuxt generate`, so the build needs a SQLite driver. There are two:

- **`better-sqlite3`**, a native C++ addon that has to be compiled against the
  exact Node ABI it will run under. The historical `Module did not self-register`
  failure above was that ABI going wrong: a mismatch between the Node that
  compiled the addon and the Node that loaded it.
- **`node:sqlite`**, built into Node itself, nothing to compile. This is what
  `sqliteConnector: 'native'` selects.

Because the driver is a Node built-in, **the Node version decides whether the
build works at all**. `node:sqlite` is a recent
addition, currently "release candidate" in Node's own stability index, and older
releases either lack it or hide it behind `--experimental-sqlite`. That is why
the Node version is pinned in three places: `.node-version` in the repo,
`languages.javascript.package = pkgs.nodejs_26` in `devenv.nix`, and
`NODE_VERSION` in Workers Builds.

### Cloudflare Workers configuration

[raz.wtf](https://raz.wtf) is served by the Worker `razwtf`, an assets-only
Worker: `wrangler.jsonc` declares no `main`, so no Worker code runs and
Cloudflare serves `dist` from its edge cache. Pushing to `main` builds and
deploys production through GitHub Actions; a pull request gets its own preview
URL. Nothing is run by hand.

Most of it is in `wrangler.jsonc`, where each option is commented with what
breaks without it. The parts worth knowing away from the file:

| Option                      | Value                    | Why                                                                                               |
| --------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------- |
| `assets.directory`          | `./dist`                 | Where the pinned nitro preset writes. This is the Workers replacement for Pages' output directory |
| `assets.not_found_handling` | `404-page`               | Pages inferred a custom 404 from the presence of `404.html`; Workers requires saying so           |
| `assets.html_handling`      | `auto-trailing-slash`    | The default, and the half of the pair that `autoSubfolderIndex: false` depends on                 |
| `routes`                    | `raz.wtf`, `www.raz.wtf` | Custom Domains, so Cloudflare owns the DNS records and the certificates                           |
| `workers_dev`               | `false`                  | There is a real domain, so `razwtf.0xraz.workers.dev` has no reason to answer                     |
| `preview_urls`              | `true`                   | Load-bearing next to `workers_dev: false`; see below                                              |

`preview_urls` is the one that bites. Since wrangler 4.44 it defaults to
matching `workers_dev`, so turning the workers.dev route off silently takes every
branch preview with it. Set explicitly, previews keep their own
`<version>-razwtf.0xraz.workers.dev` hostnames, which is what replaces the
preview deployment Pages gave each branch for free.

### CI, and why it is a workflow rather than Workers Builds

Cloudflare offers Workers Builds, which is the direct replacement for Pages' own
git integration and would have kept the build configuration in a dashboard the
way the Pages settings were. `.github/workflows/ci.yml` was chosen over it for
two reasons. The configuration is in the repo, reviewable in a diff instead of
recalled from a settings page, which was the single thing most worth fixing about
the Pages arrangement. And the checks become real gates: `pnpm typecheck`,
`pnpm lint:strict` and `pnpm fmt:check` run as a `check` job that both other jobs
depend on, so a deploy cannot happen past a failing one. Workers Builds runs a
build command and a deploy command, with no notion of a check that blocks.

Three jobs, and one of the last two runs per event:

| Job       | When              | Does                                                                             |
| --------- | ----------------- | -------------------------------------------------------------------------------- |
| `check`   | every push and PR | the three pre-push commands, in the same order                                   |
| `deploy`  | push to `main`    | `pnpm generate`, then `wrangler deploy` to promote and attach the Custom Domains |
| `preview` | pull request      | `pnpm generate`, then `wrangler versions upload`, and comments the URL on the PR |

`preview` is what replaces the per-branch preview deployment Pages created for
free, and it works because `preview_urls: true` is set in `wrangler.jsonc`. It is
skipped for pull requests from forks, since repository secrets are not available
to those and the job would fail rather than usefully.

Two repository secrets, both under **Settings → Secrets and variables →
Actions**:

| Secret                  | Why                                                                     |
| ----------------------- | ----------------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | an API token with the **Edit Cloudflare Workers** template              |
| `CLOUDFLARE_ACCOUNT_ID` | not a credential, kept out of the repo anyway since this repo is public |

The deploy runs `pnpm exec wrangler`, not `cloudflare/wrangler-action`, so CI
uses the exact wrangler in `pnpm-lock.yaml` and no third-party action sits in the
path of the API token.

Nothing pins Node or pnpm in the workflow itself. `actions/setup-node` reads
`node-version-file: .node-version`, which is the same `26` devenv pins, and
`pnpm/action-setup` takes its version from `packageManager` in `package.json`
with no version input. So the workflow has no version numbers to drift from the
repo's, which is the whole point; Node 26 is load-bearing rather than a
preference, for the `node:sqlite` reason above.

`packageManager` being the only pnpm pin was verified on Pages preview deployment
`fa62533e` (2026-07-28), the last build there with no `PNPM_VERSION` set:

```
Detected the following tools from environment: nodejs@26.5.0, pnpm@11.9.0
Preparing pnpm@11.9.0 for immediate activation...
Done in 16.9s using pnpm v11.9.0
```

That was Cloudflare's build image resolving tools from the repo, and it no longer
applies to how this deploys; it is kept because it establishes that
`packageManager` alone is enough for a CI runner to land on pnpm 11.9.0, which is
what `pnpm/action-setup` now relies on. It is not pnpm's own
`manage-package-manager-versions` handoff doing that work.

That handoff is a second and independent net, and it does work: locally a
`pnpm-10.34.5` binary run in this repo fetched 11.9.0 into
`~/.local/share/pnpm/.tools/pnpm/11.9.0` and reported itself as 11.9.0, while the
same binary with `manage-package-manager-versions=false` reported 10.34.5. It
downloaded rather than reusing the pnpm 11 already on `PATH`.

If either mechanism ever stops applying, the install fails loudly rather than
silently. The lockfile is not a constraint either way: `pnpm-lock.yaml` is
`lockfileVersion: '9.0'`, which pnpm 10 also reads. Neither Cloudflare's build
image nor `pnpm/action-setup` reads `package.json` `engines`, and neither infers
pnpm from the lockfile, so `packageManager` is the only way to keep this pin in
the repo.

One consequence to know if the handoff does fail. `pnpm-workspace.yaml` declares
its build allowlist as `allowBuilds`, which is pnpm 11 spelling; the pnpm 10
equivalent is `onlyBuiltDependencies`, and carrying both invites the two lists to
drift, so only `allowBuilds` is kept. A pnpm 10 fallback therefore recognises no
allowlist at all, and since pnpm 10 blocks build scripts by default, everything
`allowBuilds` permits (`sharp`, `esbuild`, `@parcel/watcher`, `vue-demi`,
`workerd`) would be skipped, which breaks the build visibly rather than subtly.
Nothing there is a correctness trap; the allowlist exists to keep install
scripts, which are arbitrary code execution, down to the ones this project
actually needs.

DNS lives in the same Cloudflare account, and the Worker's Custom Domains own it.
Both `raz.wtf` and `www.raz.wtf` are now proxied `AAAA 100::` placeholder records
that Cloudflare manages, the same shape as `vue-starter.raz.wtf`, so there is
nothing to maintain in the DNS dashboard.

Getting there took three steps per hostname rather than two, and the middle one
is the one to know about:

1. Remove the custom domain from the Pages project.
2. **Delete the CNAME to `razwtf.pages.dev` by hand.** Pages leaves it behind.
3. Attach the hostname to the Worker, which creates the placeholder record.

Skipping step 2 does not produce a warning, it produces a refusal:

```
100117: Hostname 'raz.wtf' already has externally managed DNS records
(A, CNAME, etc). Delete them first or try a different hostname.
```

Worth knowing because the obvious mental model is wrong twice over. A hostname
cannot belong to a Pages project and a Worker at once, so it reads like a
handover; in fact Cloudflare refuses on the DNS record rather than on the
ownership, and detaching from Pages does not clear that record. Verified by doing
`www.raz.wtf` first as a canary: after a successful detach the CNAME was still
present and had to be deleted before the attach would go through.

No certificate gap, in the end. Both hostnames answered 200 with a valid chain on
the first request after attaching, because the zone's Universal SSL already
covered them. A Custom Domain does provision its own certificate, so that is a
property of these two names already being in this zone rather than a general
guarantee.

### No D1, despite what the Content docs say

[Nuxt Content's Cloudflare Pages guide](https://content.nuxt.com/docs/deploy/cloudflare-pages)
states that a D1 database bound as `DB` is **required**. That applies to the
SSR path (`nuxt build --preset=cloudflare_pages`), where `queryCollection` runs
at request time inside a Worker that cannot open a local SQLite file.

This site takes the static path, so it needs no database and no binding. Every
query runs at build time through `node:sqlite`, and the browser gets its own
copy: `__nuxt_content/<collection>/sql_dump.txt` per collection plus
`_nuxt/sqlite3.*.wasm`. The static build emits no `_worker.js` and no
`functions/`, so there is nothing at runtime that could hold a binding, and the
two server routes are prerendered into plain files rather than staying as
handlers. Verified on a real Pages deployment and again under `wrangler dev`
after the move: the dumps and the WASM are served (the latter as
`application/wasm`, which matters for `instantiateStreaming`), and client-side
navigation instantiates and queries the database with no console errors.

Moving this site to SSR would make D1 mandatory and that guide's quick setup
would apply verbatim.

Every build and every `pnpm dev` now prints this, and it can be ignored:

```
[@nuxt/content] WARN Deploying to Cloudflare requires using D1 database,
switching to D1 database with binding DB.
```

It appeared the moment `nitro.preset` was pinned, because @nuxt/content chooses
its own internal preset from `nuxt.options.nitro.preset` and anything matching
`cloudflare` takes the Cloudflare branch. All that branch does here is rewrite
`runtimeConfig.content.database` to `{ type: 'd1', bindingName: 'DB' }`, and
runtime config is read by a running server, of which this deploy has none. The
build-time queries still go through `node:sqlite` and the browser still gets the
dumps. Pages builds printed the same line for the same reason; pinning the preset
only made it visible locally too. Checked against a dev server on the pinned
preset: content pages render and `/projects` still lists every case study.

`routeRules` declare the feed content types and the
`gmk-retroguardia → swg-retroguardia` 301, and they need a host-aware preset to
become anything real. Under the plain `static` preset the redirect degrades to a
meta-refresh stub (`projects/gmk-retroguardia/index.html` with an
`http-equiv="refresh"`) and no `_headers` is emitted at all. The pinned preset
emits both files, so the redirect is a genuine 301 and the feed content types are
served as declared. Both stubs still ship, and the `_redirects` rule wins because
Cloudflare evaluates redirects before it looks for a matching asset.

Content types are set through `routeRules` rather than `setResponseHeader`
because `h3` auto-imports a version in this dependency tree that mismatches the
one nitro uses, and throws at runtime.

#### The `_redirects` line that blocks the deploy

Nitro ends every `_redirects` it writes with a catch-all that only Pages
understands:

```
/projects/gmk-retroguardia	/projects/swg-retroguardia	301
/* /404.html 404
```

That second line is how Pages was told to serve a custom 404. Workers accepts
only 200, 301, 302, 303, 307 and 308 in a `_redirects` rule, and it does not
shrug the line off. The upload is refused:

```
✘ [ERROR] A request to the Cloudflare API (/accounts/.../workers/scripts/razwtf) failed.
  Invalid _redirects configuration:
  Line 2: Valid status codes are 200, 301, 302 (default), 303, 307, or 308.
  Got 404. [code: 100324]
```

So the line has to go before the file is uploaded, which is what the
`nitro:init` hook in `nuxt.config.ts` and `scripts/cf-redirects.ts` do.
`assets.not_found_handling: "404-page"` serves `404.html` in its place, and the
resulting `_redirects` carries the retroguardia 301 alone.

**`wrangler dev` will not catch this, and believing it cost a deploy here.** The
local runtime parses the same file and is more lenient than the API: it logs the
rule as invalid, skips it, and serves the whole site correctly, 404 page
included.

```
[wrangler:warn] Found 1 invalid redirect rule:
▶︎ Valid status codes are 200, 301, 302 (default), 303, 307, or 308. Got 404.
    at dist/_redirects:2 | /* /404.html 404
```

Read as a warning that could be left alone, which is how it reads, that is a
green local test and a deploy that fails on the real thing. Treat a `_redirects`
warning from `wrangler dev` as an error.

The reason to strip rather than translate is worth keeping in view, because the
failure mode this _could_ have had is the worst available. Redirects are followed
whether or not an asset matches, so a `/*` rule that survived as the default 302
would send every request on the site to `/404.html`. Rejecting the upload is the
safe end of that spectrum.

## Linting and formatting

Three Rust tools replaced ESLint and `@antfu/eslint-config`:

| Tool        | Owns                                                                   | Config             |
| ----------- | ---------------------------------------------------------------------- | ------------------ |
| `oxfmt`     | formatting: TS, Vue (template _and_ script), Markdown, YAML, JSON, CSS | `.oxfmtrc.json`    |
| `oxlint`    | linting: JS/TS and SFC `<script>` blocks                               | `.oxlintrc.json`   |
| `vize lint` | linting: Vue templates, a11y, SFC `<style>`, SSR                       | `vize.config.json` |

**Why two linters.** Oxlint ships 46 `vue/*` rules and every one of them is a
`<script>` rule; it has no Vue template parser, and the upstream position is
that `eslint-plugin-vue` is not a compatibility target
([oxc#15761](https://github.com/oxc-project/oxc/issues/15761)). Vize (Patina) is
the template half. There is an `oxlint-plugin-vize` bridge that folds both into
one command, but it anchors every diagnostic to `2:2` - the start of the
extracted script program - with the true location buried in the message text,
so editor squiggles and `--fix` land on the wrong line. Two commands, correct
ranges.

**Why rules are disabled.** The `nuxt` preset reports 225 diagnostics here.
Everything actionable was fixed; what stays off in `vize.config.json` is either
inapplicable to a prerendered content site or fights a deliberate choice.

Do not count on `vize lint --fix` for any of it. Only 18 of the 238 rules claim
to be fixable, and against vize 0.291 roughly a third of those actually emit
edits: `vue/v-bind-style`, `vue/v-on-style` and `vue/no-multi-spaces` apply,
while `vue/prefer-props-shorthand`, `vue/html-self-closing`, `vue/html-quotes`,
`vue/attribute-hyphenation`, `vue/no-boolean-attr-value`, `vue/v-slot-style` and
`a11y/no-redundant-roles` are all marked fixable and do nothing. Check before
assuming a rule will fix itself.

- `vue/no-inline-style` (31) - `:style="{ '--accent': accent }"` _is_ the
  per-card accent mechanism. See [styling system](#styling-system).
- `vue/warn-custom-directive` (44) - `v-reveal` is a real directive, registered
  in `app/plugins/reveal.ts`.
- `vue/multi-word-component-names` (5, as errors) - `Callout`/`Info`/`Note`/
  `Tip`/`Warning` names are dictated by their MDC usage (`::note`).
- `vue/no-unsafe-url` (18) - the rule guards against `javascript:` URLs arriving
  from untrusted input. Every flagged binding reads a zod-validated frontmatter
  field or `site.yml`, so the "input" is a file in this repo.
- `vue/no-root-v-if` (7) - the page roots guard on `page`, which `useAsyncData`
  resolves before render and prerendering makes certain. Restructuring seven
  roots would put the page transition and RouteWipe choreography at risk for a
  condition that cannot be false.
- `vue/use-unique-element-ids` (9) - the static IDs all sit on singleton page
  sections (`hero-title`, `notes-h`), and the rule cannot know a page renders
  once. Components that _can_ repeat already take the id as a prop (SearchField's
  `ariaControls`).
- `vue/v-on-handler-style` (8) - wants a named method instead of an inline
  statement. For one-liners like `@click="model = ''"` the indirection costs more
  than it explains.
- `css/prefer-nested-selectors` (66) - a nesting convention the `<style>` blocks
  consistently do not follow.
- `css/prefer-logical-properties` (7) - no RTL locale is planned; the site ships
  English and Italian only.
- `css/prefer-slotted` (1) - MediaFrame's `:deep(img)` is correct and documented.
  `::v-slotted()` matches only direct slot children and could break it.
- `css/no-hardcoded-values` (8) - two are outright false positives (`transparent`
  on a text-stroke, a `3.1em` relative drop cap); the rest need a design call
  rather than a lint fix. See the two open items below.

Every `css/*` diagnostic reports at the `<style scoped>` line rather than the
offending declaration, so acting on one means grepping for it by hand.

**Two open items this surfaced,** both deliberately left alone:

1. `ProjectGallery.vue` and `ImgLightbox.vue` set `font-size: 0.8rem`, which is
   off the `--fs-*` scale - it lands between `--fs-cap` (0.76rem) and `--fs-sm`
   (0.86rem). Snapping it either way is a visible type change, so it wants an eye
   rather than a codemod.
2. The layer scale is split between raw `z-index` in scoped CSS (200, 300) and
   UnoCSS utilities in class attributes (`z-40`, `z-50`, `z-[60]`, `z-100`,
   `z-201`). The two halves are coupled - `LightBox` puts its content on `z-201`,
   exactly one above its own `z-index: 200` overlay - so tokenising only the CSS
   half splits the pair and makes the ordering harder to follow, not easier. A
   real layer scale has to cover both halves at once.

**What was lost with ESLint**, with no oxlint equivalent: `regexp` (60 rules),
`e18e`, `antfu`, `command`, the `pnpm` workspace rules, jsonc/yaml key sorting,
and linting of fenced code inside Markdown. Oxlint's `jsPlugins` can load ESLint
plugins directly if any of these turn out to be missed.

`sortTailwindcss` in `.oxfmtrc.json` stands in for the `unocss/order` rules.
It reorders class attributes but not the generated CSS: verified against a
build, where the only difference was the order of custom properties inside a
single `:root` block, with an identical declaration set.

## Gotchas

Failures that already cost a session each.

1. **Restart the dev server** after adding a component under
   `app/components/content/`, or after editing `content.config.ts`. SSR resolves
   the new MDC component while the client renders `::note` as a raw `<note>`.
2. **`nuxt generate` clobbers `.nuxt` dev types**, producing phantom
   "Cannot find name `defineNuxtConfig` / `queryCollection`" errors in the
   editor. `nuxt prepare` restores them.
3. **`@nuxt/image`: pass `width` and `height`, never `sizes`.** In 2.0 a `sizes`
   prop generated a 1-2px srcset (`s_2x2`) and broke every card image.
4. **Never use `:is` with a string component name** for auto-registered Nuxt
   components. `<component :is="'NuxtLink'">` renders an inert `<nuxtlink>`
   element with no href. Use `resolveComponent('NuxtLink')`. This silently
   killed the wordmark link.
5. **`.prose > *` selectors do nothing.** See
   [the reading measure](#the-reading-measure).
6. **The homepage spotlight section is partly bespoke.** `app/pages/index.vue`
   hardcodes case-study specifics for the current spotlight project (heading,
   pullquote, palette chips). Moving `spotlight: true` elsewhere means rewriting
   that block, not just editing frontmatter.
7. **Lazy images render blank in instant full-page screenshots.** Force eager
   loading when verifying visually.
8. **Contrast-check any new highlight theme against the pinned surface**, not
   against a flavour. This is how the previous theme (dracula) shipped a comment
   token at 3.49:1 on `#1e1e2e`; `catppuccin-mocha`'s is 5.81:1.
9. **In `server/routes/`, import `queryCollection` from `@nuxt/content/server`**
   rather than relying on the auto-import. `.nuxt/types/nitro-routes.d.ts`
   imports every server route to build the route-type map, which pulls those
   files into the _app_ TypeScript project, where the auto-import resolves to the
   client's 1-argument form. Twenty phantom type errors came from that alone.
10. **`pnpm typecheck` is the only thing that checks types.** `nuxt generate`
    does not typecheck, so a build passing says nothing about types.
11. **Vize config must be `vize.config.json`, not `.ts`.** The docs list
    `vize.config.ts` as a supported filename, but `vize lint` silently ignores
    it and falls back to the default preset - the same settings yielded 22
    diagnostics via `.ts` and 77 via `.json`. Silently, so the only symptom is
    a suspiciously short report.
12. **Do not unpin `nitro.preset`.** It reads like a redundant line that nitro
    would work out on its own, and on Pages it genuinely did. Nothing in the
    Workers build environment tells nitro which preset to use, so removing it
    downgrades the build to plain `static`: the output moves to `.output/public`
    where `assets.directory` is not looking, `_headers` stops being written, and
    the retroguardia 301 becomes a meta-refresh stub. The build stays green
    throughout. See [Build and deploy](#build-and-deploy).
13. **A `_redirects` warning from `wrangler dev` is an error.** The local runtime
    skips rules it cannot parse and serves the site correctly anyway. The deploy
    API refuses the upload for the same file. A green `wrangler dev` therefore
    says nothing about whether `_redirects` will deploy, which is what
    `scripts/cf-redirects.ts` exists to handle. See
    [the `_redirects` line that blocks the deploy](#the-_redirects-line-that-blocks-the-deploy).
