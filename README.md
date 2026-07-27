# raz.wtf

Personal site of Raz (Simone Colabufalo): a keyboard-design and web-development
portfolio at [raz.wtf](https://raz.wtf).

Statically generated, content-driven, and themed in four Catppuccin flavours.
Every visitor-facing string lives in `content/`, not in a `.vue` template.

For how it is put together and why, read [ARCHITECTURE.md](./ARCHITECTURE.md).

## Stack

| Piece | What it does here |
| --- | --- |
| [Nuxt 4](https://nuxt.com) | app framework, `app/` directory layout, prerendered to static HTML |
| [@nuxt/content 3](https://content.nuxt.com) | typed collections with zod schemas, WASM SQLite in the browser |
| [UnoCSS](https://unocss.dev) (`presetWind4`) | the design system, expressed as theme tokens plus named shortcuts |
| [Reka UI](https://reka-ui.com) | accessible dialog primitives (mobile menu, lightbox) |
| [motion-v](https://motion.dev) | scroll reveals and route choreography |
| [@chenglou/pretext](https://github.com/chenglou/pretext) | kinetic type: fill-to-width headings, per-word cascade |
| `@nuxt/image`, `@nuxt/fonts`, `@vueuse/nuxt` | images, Fraunces provisioning, composables |

Type is Victor Mono (self-hosted, the dominant voice) and Fraunces (display
headings). Colour is Catppuccin in latte, frappe, macchiato and mocha.

## Requirements

This repo is developed on NixOS with [devenv](https://devenv.sh), which pins
**Node 26** and **pnpm 11.9**. Everything runs inside that shell:

```bash
devenv shell -- pnpm install
devenv shell -- pnpm dev        # or: devenv up
```

Two things to know before working around it:

- Ambient `node` on this machine is v24. Content's SQLite connector is set to
  `native` (`node:sqlite`), so a lower Node breaks `nuxt generate`.
- Do not use corepack. devenv provides pnpm directly.

Without Nix, any Node 26 plus pnpm 11 toolchain works; drop the
`devenv shell --` prefix from every command below.

## Commands

| Command | Does |
| --- | --- |
| `pnpm dev` | dev server on http://localhost:3000 |
| `pnpm generate` | static build to `.output/public` (the deploy artifact) |
| `pnpm build` | server build, for a Node host |
| `pnpm preview` | serve the last build |
| `pnpm lint:check` / `pnpm lint:fix` | ESLint 9 flat config (`@antfu/eslint-config`) |
| `pnpm typecheck` | `vue-tsc` via `nuxt typecheck`; the build does **not** check types |

`nuxt prepare` runs on install. Note that `nuxt generate` overwrites the
generated dev types in `.nuxt`, which makes editors report phantom
"Cannot find name `defineNuxtConfig`" errors; run `devenv shell -- nuxt prepare`
to restore them.

## Layout

```
app/
  pages/           routes; one file per surface (see ARCHITECTURE.md for the map)
  layouts/         default chrome: header, footer, lightbox host
  components/
    ui/            design-system primitives, bare-named (<WorkCard>, <TagList>)
    layout/        header, footer, scroll-to-top
    content/       MDC + Prose components usable from markdown
  composables/     useFlavor, useLightbox, usePretext, blog visibility
  utils/           formatters, socials, tag slugs, kinetic helpers
  assets/css/      main.css (tokens, prose, motion) + themes.css (4 flavours)
  plugins/         flavour sync, scroll-reveal directive
content/           all copy: singleton pages, projects, posts, site.yml chrome
  projects/*.md    case studies
  blog/*.md        notes (empty today, so blog surfaces stay hidden)
  site.yml         global chrome strings
public/            static assets, fonts, favicons, robots.txt
server/routes/     rss.xml, sitemap.xml
scripts/           build-time helpers (tag route enumeration)
docs/templates/    copy-paste frontmatter templates for new content
content.config.ts  collections + zod schemas (the frontmatter contract)
uno.config.ts      theme tokens, shortcuts, breakpoints
```

## Adding content

The point of the rebuild: a well-formed markdown file is a finished page, with
no code change. Full field tables are in
[ARCHITECTURE.md](./ARCHITECTURE.md#the-frontmatter-contract).

**A project.** Copy `docs/templates/project.md` to
`content/projects/<slug>.md`. It publishes at `/projects/<slug>` and appears on
the work grid and the homepage. Put its images under `public/<slug>/`. Required
frontmatter is `title`, `description` and `date`; everything else is optional
and degrades gracefully. `featured: true` gives it the large card,
`spotlight: true` drives homepage section 02.

**A note.** Copy `docs/templates/post.md` to `content/blog/<slug>.md`.
Required frontmatter is `title` and `date`. The blog nav link, the footer link,
the homepage Notes section and the RSS feed all appear automatically once one
non-draft post exists, and disappear again if the folder empties.

**A standalone page.** Drop `content/<slug>.md` at the content root. It gets
`/<slug>` and a reading column via `app/pages/[...slug].vue`.

**Chrome copy** (footer, bylines, section labels, error page) lives in
`content/site.yml`.

Three things that otherwise waste your time:

1. Restart the dev server after adding a component in
   `app/components/content/` or editing `content.config.ts`. HMR serves stale
   MDC resolution and renders `::note` as a raw `<note>` element.
2. Frontmatter is validated by zod. A missing required field fails the build
   rather than rendering an empty page.
3. A brand-new tag needs a rebuild. Tag routes are enumerated from frontmatter
   at config-eval time (`scripts/content-tags.ts`) so they can be prerendered.

## Deploy

The deploy artifact is a pure static bundle, with no database or Node runtime
needed at serve time. Where it lands depends on the nitro preset:

| Building | Output | Extras |
| --- | --- | --- |
| locally (`pnpm generate`) | `.output/public` | none |
| on Cloudflare Pages | `dist` | `_headers` and `_redirects` |

Nitro detects the Pages environment and switches presets on its own, so the
build command stays `pnpm run generate` and only the output directory differs.
That preset is also what turns the nitro `routeRules` into real artifacts: the
`gmk-retroguardia` 301 becomes a `_redirects` entry instead of the meta-refresh
stub the plain static preset emits.

The Cloudflare Pages project is `razwtf` (git-connected, production branch
`main`, build `pnpm run generate`, output `dist`). It needs two environment
variables, and fails without them: `NODE_VERSION` at 24 or higher, because the
default build image ships Node 22 and `node:sqlite` is only stable from 24, and
`PNPM_VERSION` at 11.9.0, because the image's own pnpm cannot read this
lockfile.

The site still runs on Vercel while the cutover happens; see beads `raz-50q.2`,
`raz-50q.3` and `raz-lgx`.

## Issue tracking

Work is tracked in [beads](https://github.com/steveyegge/beads) with the `raz`
prefix, in a local `.beads/` workspace. `bd ready` lists what is workable;
`raz-72a` is the decisions anchor for the rebuild.
