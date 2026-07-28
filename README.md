# raz.wtf

Personal site of Raz (Simone Colabufalo): a keyboard-design and web-development
portfolio at [raz.wtf](https://raz.wtf).

Statically generated, content-driven, and themed in four Catppuccin flavours.
Every visitor-facing string lives in `content/`, not in a `.vue` template.

## Stack

| Piece                                                    | What it does here                                                  |
| -------------------------------------------------------- | ------------------------------------------------------------------ |
| [Nuxt 4](https://nuxt.com)                               | app framework, `app/` directory layout, prerendered to static HTML |
| [@nuxt/content 3](https://content.nuxt.com)              | typed collections with zod schemas, WASM SQLite in the browser     |
| [UnoCSS](https://unocss.dev) (`presetWind4`)             | the design system, expressed as theme tokens plus named shortcuts  |
| [Reka UI](https://reka-ui.com)                           | accessible dialog primitives (mobile menu, lightbox)               |
| [motion-v](https://motion.dev)                           | scroll reveals and route choreography                              |
| [@chenglou/pretext](https://github.com/chenglou/pretext) | kinetic type: fill-to-width headings, per-word cascade             |

Type is Victor Mono (self-hosted, the dominant voice) and Fraunces (display
headings). Colour is Catppuccin in latte, frappe, macchiato and mocha.

## Getting started

Developed on NixOS with [devenv](https://devenv.sh), which pins **Node 26** and
**pnpm 11.9**. `.envrc` loads it through direnv, so an interactive shell in this
directory already has both; scripted runs should be explicit:

```bash
devenv shell -- pnpm install
devenv shell -- pnpm dev        # or: devenv up
```

Without Nix, use Node 26 and pnpm 11, and drop the `devenv shell --` prefix. The
Node floor is not a preference: the content build reads its SQLite database
through Node's built-in `node:sqlite`, so an older runtime fails outright. See
[ARCHITECTURE.md#build-and-deploy](./ARCHITECTURE.md#build-and-deploy). Do not
use corepack; devenv provides pnpm directly.

## Commands

| Command                       | Does                                                                                |
| ----------------------------- | ----------------------------------------------------------------------------------- |
| `pnpm dev`                    | dev server on http://localhost:3000                                                 |
| `pnpm generate`               | static build to `.output/public` (Cloudflare writes `dist`)                         |
| `pnpm build`                  | server build, for a Node host                                                       |
| `pnpm preview`                | serve the last build                                                                |
| `pnpm lint` / `pnpm lint:fix` | `oxlint` (JS/TS + SFC `<script>`) then `vize lint` (Vue templates, a11y, `<style>`) |
| `pnpm lint:strict`            | same as `pnpm lint` but fails on warnings too; what pre-push runs                   |
| `pnpm fmt` / `pnpm fmt:check` | `oxfmt` formats TS, Vue, Markdown, YAML, JSON and CSS                               |
| `pnpm typecheck`              | `vue-tsc` via `nuxt typecheck`; the build does **not** check types                  |

`nuxt prepare` runs on install. Git hooks come from `lefthook.yml`, installed by
the same `pnpm install`.

## Adding content

A well-formed markdown file is a finished page, with no code change. Copy
`docs/templates/project.md` to `content/projects/<slug>.md` for a case study, or
`docs/templates/post.md` to `content/blog/<slug>.md` for a note; drop
`content/<slug>.md` at the content root for a standalone page. Chrome copy lives
in `content/site.yml`. The field tables are in
[ARCHITECTURE.md#the-frontmatter-contract](./ARCHITECTURE.md#the-frontmatter-contract).

## Deploy

Served by **Cloudflare Pages** from the git-connected project `razwtf`. Pushing
to `main` builds and deploys production; any other branch gets a preview build
and its own URL. There is nothing to run by hand. The dashboard settings and why
each one is pinned are in
[ARCHITECTURE.md#build-and-deploy](./ARCHITECTURE.md#build-and-deploy).

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) how the site is put together and why,
  including the frontmatter contract, theming, the build, and the gotchas that
  each cost a session.
- [AGENTS.md](./AGENTS.md) instructions for coding agents; `CLAUDE.md` is a
  symlink to it.
- `docs/templates/` copy-paste frontmatter for new content.
