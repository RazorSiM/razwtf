# raz.wtf

Personal site of Raz (Simone Colabufalo): a keyboard-design and web-development
portfolio at [raz.wtf](https://raz.wtf).

Statically generated, content-driven, and themed in four Catppuccin flavours.
Every visitor-facing string lives in `content/`, not in a `.vue` template.

For how it is put together and why, read [ARCHITECTURE.md](./ARCHITECTURE.md).

## Stack

| Piece                                                    | What it does here                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| [Nuxt 4](https://nuxt.com)                               | app framework, `app/` directory layout, prerendered to static HTML |
| [@nuxt/content 3](https://content.nuxt.com)              | typed collections with zod schemas, WASM SQLite in the browser     |
| [UnoCSS](https://unocss.dev) (`presetWind4`)             | the design system, expressed as theme tokens plus named shortcuts  |
| [Reka UI](https://reka-ui.com)                           | accessible dialog primitives (mobile menu, lightbox)               |
| [motion-v](https://motion.dev)                           | scroll reveals and route choreography                              |
| [@chenglou/pretext](https://github.com/chenglou/pretext) | kinetic type: fill-to-width headings, per-word cascade             |
| `@nuxt/image`, `@nuxt/fonts`, `@vueuse/nuxt`             | images, Fraunces provisioning, composables                         |

Type is Victor Mono (self-hosted, the dominant voice) and Fraunces (display
headings). Colour is Catppuccin in latte, frappe, macchiato and mocha.

## Requirements

This repo is developed on NixOS with [devenv](https://devenv.sh), which pins
**Node 26** and **pnpm 11.9**. `.envrc` loads it through direnv, so an
interactive shell in this directory already has both; scripted runs should be
explicit:

```bash
devenv shell -- pnpm install
devenv shell -- pnpm dev        # or: devenv up
```

Without Nix, use Node 24 or newer and pnpm 11, and drop the `devenv shell --`
prefix from every command below. Do not use corepack; devenv provides pnpm
directly.

### Why the Node floor is a hard requirement

It is not a preference, and it is worth understanding before you try to build
on an older runtime.

`@nuxt/content` keeps parsed markdown in a SQLite database that it builds
during `nuxt generate`, so the build needs a SQLite driver. There are two:

- **`better-sqlite3`**, a native C++ addon that has to be compiled against the
  exact Node ABI it will run under.
- **`node:sqlite`**, built into Node itself, nothing to compile.

This project uses the second, via `content.experimental.sqliteConnector:
'native'` in `nuxt.config.ts`, because the native addon kept failing under
NixOS during the prerender step with `Module did not self-register` (an ABI
mismatch between the Node that compiled it and the Node that loaded it), which
turned every content page into a 500.

The consequence: because the driver is a Node built-in, **the Node version
decides whether the build works at all**. `node:sqlite` is a recent addition
(currently "release candidate" in Node's own stability index) and older
releases either lack it or hide it behind `--experimental-sqlite`. That is also
why the Cloudflare Pages project pins `NODE_VERSION`, since its default build
image is older than this needs. See [Deploy](#deploy).

## Commands

| Command                       | Does                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `pnpm dev`                    | dev server on http://localhost:3000                                                 |
| `pnpm generate`               | static build to `.output/public` (Cloudflare writes `dist`; see Deploy)             |
| `pnpm build`                  | server build, for a Node host                                                       |
| `pnpm preview`                | serve the last build                                                                |
| `pnpm lint` / `pnpm lint:fix` | `oxlint` (JS/TS + SFC `<script>`) then `vize lint` (Vue templates, a11y, `<style>`) |
| `pnpm fmt` / `pnpm fmt:check` | `oxfmt` - formats TS, Vue, Markdown, YAML, JSON and CSS                             |
| `pnpm typecheck`              | `vue-tsc` via `nuxt typecheck`; the build does **not** check types                  |

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
    *.vue          one-off page furniture (HeroAsciiLogo, KineticText, RouteWipe,
                   ProjectGallery)
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
the work grid and the homepage. Put its images in a folder under `public/` and
reference them from the site root; existing sets use a short name that does not
have to match the slug (`swg-retroguardia.md` uses `/retroguardia/`). Required
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

[raz.wtf](https://raz.wtf) is served by **Cloudflare Pages**, from the
git-connected project `razwtf`. Pushing to `main` builds and deploys
production; any other branch gets a preview build and its own URL. There is
nothing to run by hand.

These live in the Cloudflare dashboard, not in this repo, under **Workers &
Pages → razwtf → Settings**:

| Setting           | Value               | Where                                              |
| ----------------- | ------------------- | -------------------------------------------------- |
| Build command     | `pnpm run generate` | Build configuration                                |
| Output directory  | `dist`              | Build configuration                                |
| Production branch | `main`              | Build configuration                                |
| `NODE_VERSION`    | `26`                | Environment variables (production **and** preview) |
| `PNPM_VERSION`    | `11.9.0`            | Environment variables (production **and** preview) |

Both are pinned because the v3 build image defaults to **Node 22.16.0 and pnpm
10.11.1** ([Cloudflare's build image
reference](https://developers.cloudflare.com/pages/configuration/build-image/#supported-languages-and-tools)),
neither of which matches what this project is developed against.

`NODE_VERSION` is the one that matters: Node 22 predates unflagged
`node:sqlite`, which the content build depends on (see
[Why the Node floor is a hard requirement](#why-the-node-floor-is-a-hard-requirement)).

`PNPM_VERSION` is a reproducibility pin, matching `packageManager` in
`package.json`. It is **not** known to be required: `pnpm-lock.yaml` is
`lockfileVersion: '9.0'`, which pnpm 10 reads without trouble. The real risk of
falling back to pnpm 10 is `pnpm-workspace.yaml`, which uses pnpm 11 settings
(`shellEmulator`, `allowBuilds`); an older pnpm ignoring `allowBuilds` would try
to compile `better-sqlite3` again. Neither default has been tested on Pages,
because both variables were set before the first build ever ran.

Set them per environment. A variable added only to production does not apply to
preview builds, so branch previews would fail on their own.

The Node version is _also_ pinned in-repo by `.node-version`, which Cloudflare
reads as an alternative to `NODE_VERSION` (`.nvmrc` works too). That keeps the
requirement visible to anyone reading the repo instead of living only in a
dashboard. pnpm has no equivalent file, so `PNPM_VERSION` has to stay a
dashboard variable. Note Cloudflare does **not** read `package.json` `engines`,
and does not infer pnpm from the lockfile, so neither of those is an option.

**The output directory is not a typo.** Nitro detects the Pages environment and
switches presets by itself, so the same `pnpm run generate` writes `dist` there
and `.output/public` locally. That preset is also what turns the nitro
`routeRules` into real files: the `gmk-retroguardia` 301 becomes a `_redirects`
entry, and the feed content types become `_headers`. A plain local static build
emits neither, and degrades the redirect to a meta-refresh stub.

The artifact is a pure static bundle. No database and no Node runtime at serve
time: content ships to the browser as a WASM SQLite database, which is why no
D1 binding is needed despite what the Nuxt Content Cloudflare guide says. That
is explained in [ARCHITECTURE.md](./ARCHITECTURE.md#no-d1-despite-what-the-content-docs-say).

DNS lives in the same Cloudflare account: `raz.wtf` and `www.raz.wtf` are
CNAMEs to `razwtf.pages.dev`, attached to the project as custom domains.

## Issue tracking

Work is tracked in [beads](https://github.com/steveyegge/beads) with the `raz`
prefix, in a local `.beads/` workspace. `bd ready` lists what is workable;
`raz-72a` is the decisions anchor for the rebuild.
