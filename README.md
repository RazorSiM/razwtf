# raz.wtf

[![raz.wtf](https://img.shields.io/website?url=https%3A%2F%2Fraz.wtf&up_message=live&down_message=down&label=raz.wtf&labelColor=1e1e2e&color=a6e3a1)](https://raz.wtf)
[![build](https://img.shields.io/github/actions/workflow/status/RazorSiM/razwtf/ci.yml?branch=main&label=build&labelColor=1e1e2e&color=a6e3a1)](https://github.com/RazorSiM/razwtf/actions/workflows/ci.yml)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare_Workers-assets--only-F38020?logo=cloudflare&logoColor=white&labelColor=1e1e2e)](https://developers.cloudflare.com/workers/static-assets/)
[![last commit](https://img.shields.io/github/last-commit/RazorSiM/razwtf?labelColor=1e1e2e&color=89b4fa)](https://github.com/RazorSiM/razwtf/commits/main)
[![commit activity](https://img.shields.io/github/commit-activity/m/RazorSiM/razwtf?labelColor=1e1e2e&color=f9e2af)](https://github.com/RazorSiM/razwtf/graphs/commit-activity)

[![Nuxt](https://img.shields.io/github/package-json/dependency-version/RazorSiM/razwtf/dev/nuxt?logo=nuxt&logoColor=white&label=Nuxt&color=00DC82&labelColor=1e1e2e)](https://nuxt.com)
[![Content](https://img.shields.io/github/package-json/dependency-version/RazorSiM/razwtf/dev/@nuxt%2Fcontent?logo=nuxt&logoColor=white&label=Content&color=94e2d5&labelColor=1e1e2e)](https://content.nuxt.com)
[![UnoCSS](https://img.shields.io/github/package-json/dependency-version/RazorSiM/razwtf/dev/@unocss%2Fnuxt?logo=unocss&logoColor=white&label=UnoCSS&color=cba6f7&labelColor=1e1e2e)](https://unocss.dev)
[![Node](https://img.shields.io/badge/Node-26-5FA04E?logo=nodedotjs&logoColor=white&labelColor=1e1e2e)](./.node-version)
[![pnpm](https://img.shields.io/badge/pnpm-11.9-F69220?logo=pnpm&logoColor=white&labelColor=1e1e2e)](https://pnpm.io)

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
| `pnpm generate`               | static build to `dist`, 154 routes                                                  |
| `pnpm build`                  | server build, for a Node host (`--preset node-server`)                              |
| `pnpm preview`                | serve the last build                                                                |
| `pnpm cf:preview`             | build, then `wrangler versions upload` for a throwaway preview URL                  |
| `pnpm cf:deploy`              | build, then `wrangler deploy` to production, bypassing CI                           |
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

Served by **Cloudflare Workers** as the Worker `razwtf`, which carries the built
site as
[static assets](https://developers.cloudflare.com/workers/static-assets/) and no
Worker code of its own. Pushing to `main` builds and deploys production through
[`.github/workflows/ci.yml`](./.github/workflows/ci.yml); a pull request gets its
own preview URL, commented on the PR. There is nothing to run by hand.

Unlike the Pages project this replaced, the configuration is all in the repo and
reviewable: [`wrangler.jsonc`](./wrangler.jsonc) for what Cloudflare serves and
the workflow for when. Every option in both is commented with what breaks without
it. The only things outside are two repository secrets,
`CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`.

`pnpm cf:deploy` and `pnpm cf:preview` reach Cloudflare from a laptop when CI is
not an option, and both need a `wrangler login` first. Why the migration off Pages
needed a change to `nuxt.config.ts` at all is in
[ARCHITECTURE.md#build-and-deploy](./ARCHITECTURE.md#build-and-deploy).

## Docs

- [ARCHITECTURE.md](./ARCHITECTURE.md) how the site is put together and why,
  including the frontmatter contract, theming, the build, and the gotchas that
  each cost a session.
- [AGENTS.md](./AGENTS.md) instructions for coding agents; `CLAUDE.md` is a
  symlink to it.
- `docs/templates/` copy-paste frontmatter for new content.
