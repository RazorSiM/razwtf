---
title: 'Vue Starter'
tags: ['Vue', 'Vite', 'Typescript', 'TanStack', 'UnoCSS', 'Testing', 'Cloudflare', 'Web Development']
date: 2026-07-27
hero: /vue-starter.webp
heroCaption: 'Homepage · the template rendering its own README'
type: 'Vue starter template'
description: A comprehensive Vite + Vue 3 template that wires one demo resource through every library in the stack.
excerpt: A comprehensive Vite + Vue 3 template that wires one demo resource through every library in the stack.
head:
  meta:
    - name: 'twitter:title'
      content: 'Raz.WTF - Vue Starter'
    - name: 'twitter:description'
      content: 'A comprehensive Vite + Vue 3 template that wires one demo resource through every library in the stack.'
    - name: 'twitter:image'
      content: '/vue-starter.webp'
    - name: 'twitter:image:alt'
      content: 'Vue Starter Hero'
    - property: 'og:title'
      content: 'Raz.WTF - Vue Starter'
    - property: 'og:description'
      content: 'A comprehensive Vite + Vue 3 template that wires one demo resource through every library in the stack.'
    - property: 'og:image'
      content: '/vue-starter.webp'
    - property: 'og:image:alt'
      content: 'Vue Starter Hero'
    - property: 'og:url'
      content: 'https://raz.wtf/projects/vue-starter'
accent: blue
year: 2026
role: 'Template'
kicker: 'Starter · 2026 · Vue · Vite'
order: 4
tech:
  ['Vue 3', 'Vite 8', 'Typescript 6', 'TanStack', 'zod 4', 'MSW 2', 'Reka UI', 'UnoCSS', 'oxc', 'Cloudflare Workers']
links:
  - label: 'GitHub repo'
    url: 'https://github.com/RazorSiM/vue-starter'
  - label: 'Live deploy'
    url: 'https://vue-starter.raz.wtf'
---

This is my personal take on a Vite + Vue 3 template. If you want to try it:

```bash
npx degit RazorSiM/vue-starter
pnpm install
```

It wants **Node 26** and **pnpm 11**. There's a [live deploy](https://vue-starter.raz.wtf) if you'd
rather click through it before cloning anything.

## Why

I've been using Vue since forever and I find booring to always start a new project from scratch.
This template is my starting point for every new project or proof of concept.

Version 4 changed what it is. The old one was deliberately minimal, with Vue Router, Pinia and
VueUse and little else, which meant every project I started grew the same four or five decisions
from zero. So the template makes them once: how server state gets fetched and cached, how forms
validate, where the types come from, what the API looks like before there is an API. All of it hangs
off a single demo resource and gets verified end to end, so nothing in here is a snippet I never
ran.

The **layouting** system is still the one genuinely opinionated bit, and it still has no dependency
behind it.

## What's included

### Features

- **[Vue 3](https://vuejs.org)** (3.5), the progressive JavaScript framework;
- **[Vite 8](https://vite.dev)** with the Rolldown bundler and Oxc-powered transforms;
- **[Vue Router 5](https://router.vuejs.org)** with **file-based routing**. Pages live in
  `src/pages/`, per-route metadata is declared with the `definePage()` macro and fully typed routes
  are generated into `src/typed-router.d.ts`. The route-building plugin now ships inside
  `vue-router` itself, so `unplugin-vue-router` is no longer a separate dependency. The file
  conventions:

  | file               | route                                              |
  | ------------------ | -------------------------------------------------- |
  | `index.vue`        | `/`                                                |
  | `layout.vue`       | `/layout`                                          |
  | `[id].vue`         | `/:id`                                             |
  | `[[id]].vue`       | `/:id?` (optional param)                           |
  | `[...path].vue`    | `/:path(.*)` (404 catch-all)                       |
  | `(group)/foo.vue`  | `/foo` (folder stripped from the URL)              |
  | `users.create.vue` | `/users/create` (dot nesting, no nested component) |

- **[TanStack Query 5](https://tanstack.com/query/latest/docs/framework/vue/overview)** for server
  state, so caching, background refetching, loading and error states and cache invalidation after a
  mutation all come from one place;
- **[TanStack Form 1](https://tanstack.com/form/latest/docs/framework/vue/quick-start)** for form
  state and validation, fed directly by a zod schema. zod 4 implements
  [Standard Schema](https://standardschema.dev), so there's no resolver package in between;
- **[TanStack Table 8](https://tanstack.com/table/latest/docs/framework/vue/vue-table)** for
  headless sorting and filtering. You write the markup; it owns the row model;
- **[zod 4](https://zod.dev)**, one schema per resource in `src/schemas/`, used three ways: it
  validates the form, it parses the API response at the network boundary and it infers the
  Typescript types. A field can't drift between the three;
- **[MSW 2](https://mswjs.io)** as the API the demo talks to. Handlers live in
  `src/mocks/handlers.ts` and serve all three environments from one file: the browser via a service
  worker, the unit tests via `setupServer`, and the Playwright run;
- **[Pinia 4](https://pinia.vuejs.org)** for client state, meaning the things Query deliberately
  doesn't own, with no server and no cache and nothing to invalidate. The
  [/demo](https://vue-starter.raz.wtf/demo) page puts the two side by side;
- **[VueUse 14](https://vueuse.org)** for essential composition utilities;
- **[Unhead 3](https://unhead.unjs.io)** for SEO and page metadata;
- **[Reka UI 2](https://reka-ui.com)** for unstyled, accessible primitives. It ships the behaviour
  that's tedious to write and easy to get subtly wrong (roving focus, focus trapping and
  restoration, ARIA wiring, Escape handling) and it ships no CSS at all, so UnoCSS still owns every
  pixel. Four places use it, each one replacing markup that was actively misleading to a screen
  reader:

  | primitive     | where                             | what it replaced                                                              |
  | ------------- | --------------------------------- | ----------------------------------------------------------------------------- |
  | `RadioGroup`  | role field, layout picker         | `aria-pressed` toggles; a one-of-N choice announced as N independent switches |
  | `AlertDialog` | the row remove confirmation       | an immediate, unconfirmed delete                                              |
  | `Tooltip`     | the `src/pages/…` hint in the nav | a `title` attribute, which never opens on keyboard focus                      |
  | `Primitive`   | `Ui/Button`                       | a `tag` prop that was declared and then ignored                               |

  Its parts auto-import through `RekaResolver()`, so an alert dialog costs eight tags and zero
  import lines, and you style it with `data-[state=…]` rather than a bound class expression. It
  deliberately does not replace native elements that were already correct: the name and email fields
  are still `<input>` with `<label for>`. The whole thing costs about 47 KB gzipped across all
  chunks, 37 KB of it on first paint, and the tooltip is the expensive part because it sits in the
  header and pulls popper and focus-management code into every page;

- **[UnoCSS 66](https://unocss.dev)** with [preset-wind4](https://unocss.dev/presets/wind4), the
  Tailwind-v4-aligned engine with oklch colours and a CSS-variable theme. Its reset is built in via
  `preflights.reset`, so there's no separate `@unocss/reset` package. Alongside it,
  [preset-icons](https://unocss.dev/presets/icons) for pure-CSS icons,
  [preset-web-fonts](https://unocss.dev/presets/web-fonts) for Inter and Fira Code, and
  [transformer-variant-group](https://unocss.dev/transformers/variant-group) so you can write
  `dark:(bg-gray-900 text-gray-50)` instead of repeating the variant;
- Icons from **[Lucide](https://lucide.dev)** via `@iconify-json/lucide`, used as plain classes like
  `<div class="i-lucide-house" />`. Only the Lucide collection is installed (574 KB) rather than the
  full `@iconify/json` (439 MB);
- **Multi-layout support**, still the same trick as v1: `src/App.vue` resolves layouts with an
  `import.meta.glob` lookup keyed by `route.meta.layout`, so adding `src/layouts/Foo.vue` is all it
  takes. No extra dependency. The [/layout](https://vue-starter.raz.wtf/layout) page is a live demo
  where you switch layouts and watch the header appear and disappear;
- **Markdown Vue components** via
  [unplugin-vue-markdown](https://github.com/unplugin/unplugin-vue-markdown), which is why the
  README renders as the homepage, with [Shiki](https://shiki.style) doing dual-theme highlighting.
  Three pages come from markdown this way: the homepage from `README.md`,
  [/changelog](https://vue-starter.raz.wtf/changelog) from `CHANGELOG.md`, and
  [/docs](https://vue-starter.raz.wtf/docs) from `docs/reference.md`, the only one of the three that
  doesn't live at the repo root.

### Development experience

- **Typescript 6** with full `.vue` support through `vue-tsc`. `tsconfig.json` is a solution file
  referencing three projects and `pnpm type-check` builds all of them: the app including unit specs,
  the root config files, and the Playwright suite. A project missing from `references` is silently
  skipped by `vue-tsc --build`, which is exactly how the e2e suite went unchecked for a while.
- **[oxlint](https://oxc.rs/docs/guide/usage/linter) and
  [oxfmt](https://oxc.rs/docs/guide/usage/formatter)**, the Rust-based oxc toolchain. This is what
  replaced ESLint and Prettier in v4; neither is installed any more.
- **[Lefthook 2](https://github.com/evilmartians/lefthook)** for git hooks. `pre-commit` lints and
  formats staged files, `pre-push` runs the full lint, format and type-check.
- **[changelogen](https://github.com/unjs/changelogen)** for the version bump, the `CHANGELOG.md`
  entry and the GitHub release, all derived from conventional commits. The
  [/changelog](https://vue-starter.raz.wtf/changelog) page renders that file as-is.
- **[devenv](https://devenv.sh)** for a reproducible Nix shell pinning Node, pnpm and the Playwright
  browsers. Entirely optional; with no Nix installed `pnpm install` works exactly as normal.
- **Auto-imports** for composables and components, the latter with Reka UI's resolver registered so
  its primitives resolve by name too. Both declaration files are committed, so a fresh clone
  type-checks before anything has been run.
- **VS Code integration** with format-on-save and `source.fixAll.oxc`. The ESLint and Prettier
  extensions are listed under `unwantedRecommendations`, since they'd double-format.

### Testing

- **[Vitest](https://vitest.dev)** for unit tests, backed by the same MSW handlers through
  `setupServer` with `onUnhandledRequest: 'error'`, because a request nobody mocked is a bug in the
  test rather than something to quietly let through;
- **[Playwright](https://playwright.dev)** for end-to-end, driving the real service worker in a real
  browser, which is what notices when `public/mockServiceWorker.js` goes missing or stale. Cypress
  is gone as of v4.

## The data layer

[/demo](https://vue-starter.raz.wtf/demo) is one resource, a members list, wired through every data
library in the stack instead of three disconnected toys:

```
src/schemas/member.ts     zod schemas + inferred types      (the contract)
src/mocks/handlers.ts     MSW handlers                      (the API)
src/mocks/db.ts           seeded in-memory data
src/api/members.ts        fetch + zod parse                 (the boundary)
src/composables/          useMembers(): query + mutations   (the state)
src/components/Demo/      form, table, panel                (the UI)
```

Four things worth knowing:

1. **zod parses at the boundary, it doesn't cast.** `src/api/members.ts` runs
   `memberListSchema.parse()` on every response, so a backend that renames a field fails loudly in
   one file rather than surfacing as `undefined` three components away.
2. **Mutations invalidate, they don't patch the cache.** `id`, `commits` and `joinedAt` are the
   server's to assign, so `useMembers()` invalidates the `['members']` key and refetches instead of
   guessing what the server did.
3. **The "simulate a 500" toggle is part of the query key**, not just the fetcher. Flipping it is a
   different resource as far as the cache is concerned, so both results stay cached and toggling
   back is instant.
4. **Components never see a query key or a `fetch`.** `MemberForm` emits a validated value and knows
   nothing about the API, which is why it can be unit-tested without a server at all.

The mock runs in **every** environment, the production build included. `/demo` has no backend, so a
dev-only mock would leave the deployed page showing a permanent error, and `src/main.ts` awaits
`worker.start()` before mounting or the first query would race the worker and get a real 404. That
costs about 158 KB gzipped on first paint, which is the price of a demo that works offline and on a
static host; guarding the call with `import.meta.env.DEV` pays it only in development.

## Linting and formatting

The honest ledger of what is and isn't covered:

| Target                                       | Linted                                                                             | Formatted |
| -------------------------------------------- | ---------------------------------------------------------------------------------- | --------- |
| `.ts` / `.js`                                | eslint core, typescript, unicorn, oxc, import, promise, node, and type-aware rules | yes       |
| `.vue` `<script setup>`                      | full JS/TS rules plus oxlint's native `vue` plugin                                 | yes       |
| `.vue` `<template>`                          | `vize/*` rules via `oxlint-plugin-vize`                                            | yes       |
| `*.spec.ts`                                  | oxlint's native `vitest` plugin                                                    | yes       |
| `e2e/*.spec.ts`                              | oxlint core rules                                                                  | yes       |
| `.md` / `.json` / `.yaml` / `.css` / `.html` | no                                                                                 | yes       |

Vue template linting comes from [Vize](https://github.com/ubugeeei-prod/vize), a Rust Vue toolchain
bridged into oxlint as `vize/*` rules. `eslint-plugin-vue` can't be ported over, since it depends on
`vue-eslint-parser` and its own AST, so this is the route to `v-for` key checks, `v-html` warnings,
unused-component detection and a11y rules without bringing ESLint back.

Three things caught me out wiring it up:

1. **`pnpm lint` runs `oxlint-vize`, not `oxlint`.** Plain `oxlint` silently skips `.vue` files with
   no `<script>` block, and two of this template's components are scriptless, so 25% of them would
   have looked linted while not being linted at all.
2. **`node_modules` must not go into `ignorePatterns`.** The wrapper stages temporary copies of
   scriptless SFCs under `node_modules/.vize/`, and ignoring that path silently disables every
   template rule while still exiting 0.
3. **`settings.vize.preset` has to be `incremental`.** Every other preset gates rules by bundle
   membership and will keep explicitly-listed rules quiet.

Two gaps are still open. `no-unused-vars` is inert inside `<script setup>` because oxlint can't see
template usage ([oxc#15761](https://github.com/oxc-project/oxc/issues/15761)), so `noUnusedLocals`
in `tsconfig.app.json` is what catches it. And there's no UnoCSS class ordering or validation, since
`@unocss/eslint-plugin` wants a Vue template AST; `presetIcons({ warn: true })` at least surfaces
typo'd icon names at build time.

## Deployment

The template deploys itself to **Cloudflare Workers** as static assets, at
[vue-starter.raz.wtf](https://vue-starter.raz.wtf). `wrangler.jsonc` is an assets-only Worker with
no `main`, so no Worker code runs and Cloudflare serves `dist/` straight from its edge. Two details
carry weight:

- **`not_found_handling: "single-page-application"`**, because vue-router runs in history mode and
  `/demo` matches no file on disk. Real files still take precedence, which is what keeps
  `/mockServiceWorker.js` working; falling back to `index.html` there would silently break the demo
  page.
- **Worker rather than Pages.** Pages is in maintenance mode and can't grow server-side code, while
  adding a `main` entry to `wrangler.jsonc` turns this into a full Worker with the same assets in
  front of it. An API route later is then a config change instead of a migration.

It costs nothing, too. Requests to static assets are free and unlimited on both plans, and an
assets-only Worker serves nothing else, so the free plan's 100,000 requests a day applies to Worker
invocations that don't exist here.

CI deploys on every push to `main`, gated behind the job that runs lint, types, unit tests and e2e,
so only a commit that passed everything ever ships. With no Cloudflare token set the deploy job logs
a notice and exits green, so forks don't get a red `main`.

A pull request from a branch of the repo gets its own preview instead. `wrangler versions upload`
uploads a version without promoting it, so production keeps serving whatever the last deploy
shipped, and the resulting URL is commented onto the pull request; the comment is rewritten in place
on each push rather than appended, so a long-lived branch has one comment pointing at its current
head. Forks are skipped, since their runs have no access to secrets and the alternative,
`pull_request_target`, means running fork code with a writable token.

I didn't use Workers Builds, Cloudflare's own git integration, even though it would save the two
secrets. It deploys on every push without waiting for the tests, so a commit that fails them still
goes live. Its build image also ships pnpm 10, which this repo refuses to install with, and fixing
that takes a setting in the Cloudflare dashboard; I'd rather everything about this template be
readable from its files.

## Project setup

```bash
pnpm install        # deps and git hooks (prepare -> lefthook install)
pnpm dev            # dev server on :5173
pnpm build          # vue-tsc --build && vite build
pnpm preview        # preview the production build on :4173
pnpm test           # unit tests (vitest run)
pnpm test:e2e       # playwright
pnpm lint           # oxlint-vize, type-aware
pnpm format         # oxfmt
pnpm check          # lint + format:check + type-check
pnpm changelog      # preview the unreleased changelog, writes nothing
pnpm release        # bump + changelog + tag + GitHub release
pnpm run cf:deploy  # build + wrangler deploy
pnpm run cf:preview # build + wrangler versions upload, production untouched
```

Note the `pnpm run` on those last two. `pnpm deploy` is a built-in pnpm command for workspace
pruning and will quietly not run the script you meant.

The docs got split in half after I wrote this page. The
[README](https://github.com/RazorSiM/vue-starter#readme) is now the tour, and
[/docs](https://vue-starter.raz.wtf/docs) is the long form, with the reasoning behind each choice
and the sharp edges I hit along the way, rendered from `docs/reference.md` by the template itself.
There's also an [AGENTS.md](https://github.com/RazorSiM/vue-starter/blob/main/AGENTS.md)
covering the same ground as instructions, for when a coding agent is the one reading.
