# AGENTS.md

Working instructions for coding agents on raz.wtf. Humans start at
[README.md](./README.md); the reasoning behind the code, and the long form of
everything below, is in [ARCHITECTURE.md](./ARCHITECTURE.md).

## Environment

This repo is developed on NixOS with [devenv](https://devenv.sh), which pins
**Node 26** and **pnpm 11.9**. An interactive shell in this directory already
has both through direnv; a scripted or non-login run does not, so prefix every
command:

```bash
devenv shell -- pnpm install
devenv shell -- pnpm dev
```

Ambient `node` is v24 and will not do: `@nuxt/content` builds its SQLite
database through `node:sqlite`, so the Node version decides whether the build
works at all. Never use corepack; devenv provides pnpm directly.

## Commands

| Command            | Does                                                      |
| ------------------ | --------------------------------------------------------- |
| `pnpm dev`         | dev server on http://localhost:3000                       |
| `pnpm generate`    | static build to `.output/public`, 165 routes              |
| `pnpm typecheck`   | `vue-tsc`; the only thing here that checks types          |
| `pnpm lint`        | `oxlint`, then `vize lint app`                            |
| `pnpm lint:fix`    | same with `--fix`; do not trust it, most vize rules no-op |
| `pnpm lint:strict` | both linters at `--max-warnings 0`                        |
| `pnpm fmt`         | `oxfmt` over TS, Vue, Markdown, YAML, JSON and CSS        |

The full table, including the build variants, is in
[README.md](./README.md#commands).

## Before you finish

Run these three and get them green. `pre-push` runs exactly this set, so a
failure here is a push that cannot happen:

```bash
devenv shell -- pnpm typecheck
devenv shell -- pnpm lint:strict
devenv shell -- pnpm fmt:check
```

`nuxt generate` does not typecheck, so a build that succeeds says nothing about
types. Fix formatting with `pnpm fmt` rather than by hand.

## Conventions

- **Copy belongs in `content/`, not in a `.vue` template.** Which sections exist
  and how they look is Vue's business; the words are markdown or `site.yml`.
  Adding a visitor-facing string to a template is the one change most likely to
  be wrong. Chrome strings (footer, bylines, section labels, error page) live in
  `content/site.yml`.
- **Frontmatter is a zod contract** declared in `content.config.ts`. A malformed
  file fails the build rather than rendering half a page. Start new content from
  `docs/templates/project.md` or `docs/templates/post.md`; those live outside
  `content/` on purpose, because the collection glob would try to validate them.
- **The design system is UnoCSS shortcuts** named in `uno.config.ts` (`eyebrow`,
  `secmark`, `btn-primary`, `kicker`, `chip`). Reach for a shortcut or a theme
  token before writing CSS, and add hand-written CSS only where a utility
  genuinely cannot reach.
- **Only `app/components/ui/` is bare-named** (`<WorkCard>`, `<TagList>`), via
  `pathPrefix: false`. Everything else keeps its directory prefix, which is what
  tells you from a template whether you are looking at a primitive or at
  page-specific furniture.
- **Colour is four Catppuccin flavours** resolved before first paint from one
  attribute on `<html>`. Contrast-check anything new against the pinned surface,
  not against a single flavour; see
  [ARCHITECTURE.md#contrast-rules](./ARCHITECTURE.md#contrast-rules).

## Writing style

Site copy, docs and commit messages avoid em dashes and en dashes completely;
every one was stripped from the repo in `43efee1`. Use a semicolon where one
fits, otherwise a comma, colon, period or parens. Title and feed separators are
`·`.

Avoid the neighbouring tics as well: "it's not X, it's Y" constructions,
appositive fragments after a colon, trailing sentence fragments, and triadic
lists. The existing copy in `content/about.md` is the voice to match: casual,
first person, and occasionally non-native in a way that is deliberate.

Do not invent placeholder content. `content/blog/` is empty because those posts
are unwritten, not because it needs seeding, and the blog surfaces are designed
to stay hidden until a real post exists.

## Gotchas

The ones that have already cost a session each. All eleven are in
[ARCHITECTURE.md#gotchas](./ARCHITECTURE.md#gotchas).

1. **Restart the dev server** after adding a component under
   `app/components/content/` or editing `content.config.ts`. HMR serves stale
   MDC resolution and renders `::note` as a raw `<note>` element.
2. **`nuxt generate` clobbers the dev types in `.nuxt`**, which makes editors
   report phantom "Cannot find name `defineNuxtConfig`" errors. Restore them
   with `devenv shell -- nuxt prepare`.
3. **Never pass a string component name to `:is`** for auto-registered
   components. `<component :is="'NuxtLink'">` renders an inert `<nuxtlink>` with
   no href; use `resolveComponent('NuxtLink')`.
4. **With `@nuxt/image`, pass `width` and `height`, never `sizes`.** In 2.0 a
   `sizes` prop generated a 1 to 2 pixel srcset and broke every card image.
5. **A brand-new tag needs a rebuild.** Tag routes are enumerated from
   frontmatter at config-eval time in `scripts/content-tags.ts` so they can be
   prerendered.
6. **In `server/routes/`, import `queryCollection` from `@nuxt/content/server`**
   rather than relying on the auto-import, which resolves to the client's
   one-argument form and produces twenty phantom type errors.

## Git hooks

Lefthook, configured in `lefthook.yml` and installed by the `prepare` script, so
`pnpm install` is all it takes.

| Hook         | Runs                                                          | Cost |
| ------------ | ------------------------------------------------------------- | ---- |
| `pre-commit` | `oxfmt` on staged files (re-staged), then `oxlint` and `vize` | ~1s  |
| `pre-push`   | `pnpm typecheck`, `pnpm lint:strict`, `pnpm fmt:check`        | ~6s  |

They differ deliberately. Both linters exit 0 on warnings, so pre-commit blocks
only on errors and work-in-progress commits stay cheap, while pre-push adds
`--max-warnings 0` so what leaves the machine is clean. Because pre-commit fixes
and re-stages formatting instead of reporting it, a commit can quietly contain
reformatted files.

The escape hatches are `git commit --no-verify` and `LEFTHOOK=0` in front of any
git command. Neither is a way past a real failure; fix the failure.

## Commits and pull requests

Subject line is an imperative sentence, capitalised, no trailing period:
"Replace ESLint with oxlint, oxfmt and vize". A conventional prefix (`docs:`,
`chore:`, `content:`, `fix:`) goes on changes confined to that single concern.
Work lands on `main` through a pull request, and merging to `main` deploys
production, so treat `main` as live.

## Issue tracking

Work is tracked in [beads](https://github.com/steveyegge/beads) with the `raz`
prefix, in a local `.beads/` workspace that is git-excluded rather than
committed. `bd ready` lists what is workable and `raz-72a` is the decisions
anchor for the Nuxt 4 rebuild. Close issues with a reason, since that reason is
the only record of why.
