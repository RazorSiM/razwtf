import { getBlogTagRoutes } from './scripts/content-tags'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: ['@unocss/nuxt', '@nuxt/content', '@nuxt/image', '@nuxt/fonts', '@vueuse/nuxt'],

  // UI-kit primitives are bare-named (<WorkCard>, <TagList>, <SectionMarker>…)
  // for ergonomics since they're reused across every page; everything else
  // keeps Nuxt's default directory prefix (<LayoutAppHeader>, etc.).
  components: [{ path: '~/components/ui', pathPrefix: false }, '~/components'],

  // Fraunces is fetched & self-hosted at build (CLS-safe fallback metrics).
  // Victor Mono is declared via @font-face in main.css and is left untouched.
  fonts: {
    families: [
      { name: 'Fraunces', provider: 'google', styles: ['normal', 'italic'], weights: [340, 420, 460, 540, 560, 600] },
    ],
  },

  content: {
    build: {
      markdown: {
        highlight: {
          // Catppuccin Mocha, matching the rest of the site's palette. Its
          // editor.background (#1e1e2e) and editor.foreground (#cdd6f4) are
          // exactly the pinned --code-bg / --code-fg in main.css, so the
          // highlighter and the surface it sits on are one palette.
          // A single theme, deliberately: the code surface stays dark in all
          // four flavours (see ARCHITECTURE.md). This also fixes the comment
          // token, which was 3.49:1 under dracula and is 5.81:1 here.
          theme: 'catppuccin-mocha',
          langs: ['bash', 'css', 'javascript', 'typescript', 'vue', 'markdown'],
        },
      },
    },
    experimental: {
      // Use Node's built-in node:sqlite (Node 22+/26) instead of the native
      // better-sqlite3 addon. The addon renders fine in the node-server build
      // but fails in the `nuxt generate` prerender context on NixOS ("Module
      // did not self-register"), 500-ing every queryCollection page. node:sqlite
      // needs no compiled binary, so prerender + static WASM client both work.
      sqliteConnector: 'native',
    },
  },

  image: {
    quality: 70,
    format: ['webp', 'avif'],
    domains: ['unsplash.com', 'raz.wtf', 'i.imgur.com', 'imgur.com'],
  },

  css: [
    // preset-wind4 ships a built-in reset (enabled via preflights.reset in uno.config.ts),
    // so the standalone @unocss/reset import is no longer needed.
    '~/assets/css/main.css',
  ],

  nitro: {
    // Pinned rather than detected. On Cloudflare Pages this preset was chosen for
    // us: Pages set CF_PAGES in the build environment, std-env reported the
    // provider, and nitro switched from `static` to this by itself. Workers Builds
    // sets no CF_PAGES, so leaving it implicit means a silent downgrade to plain
    // `static`: output moves to .output/public, `_headers` is never written at all
    // (so the feed content types and every immutable cache-control rule vanish),
    // and the retroguardia 301 degrades into a meta-refresh stub.
    //
    // The name is a leftover, not a mistake. nitro has no separate preset for
    // Workers static assets, and this one emits exactly what Workers wants: a
    // directory of plain files plus `_headers` and `_redirects`, and no
    // `_worker.js`. wrangler.jsonc points `assets.directory` at its output.
    preset: 'cloudflare_pages_static',

    // Content-type for the feed set declaratively (works in dev, node-server
    // and the static _headers output) - avoids h3's setResponseHeader, which
    // resolves to a mismatched h3 version in this dep tree and throws.
    routeRules: {
      '/rss.xml': { headers: { 'content-type': 'application/rss+xml; charset=utf-8' } },
      '/sitemap.xml': { headers: { 'content-type': 'application/xml; charset=utf-8' } },
      // GMK Retroguardia was renamed to SWG Retroguardia (OEM change) - forward
      // the old URL permanently so existing links don't 404.
      '/projects/gmk-retroguardia': { redirect: { to: '/projects/swg-retroguardia', statusCode: 301 } },
    },
    prerender: {
      // Emit `about.html` rather than `about/index.html`, per Nuxt's Cloudflare
      // deployment guide: it matches Pages' route matching, which otherwise
      // 308-redirects every extension-less path to its trailing-slash form.
      // That redirect also desynced the canonical URL - app.vue derives it from
      // route.path ("/about") while Pages served "/about/".
      autoSubfolderIndex: false,
      // Tag pages aren't linked from anywhere the crawler reaches before the
      // blog pages that link them are themselves rendered, so they're listed
      // explicitly (raz-paj) - enumerated from content/blog frontmatter at
      // config-eval time, see scripts/content-tags.ts. /rss.xml (raz-5c6) is
      // a plain server route with no page linking to it, so it needs the
      // same treatment.
      routes: ['/sitemap.xml', '/rss.xml', '/projects/gmk-retroguardia', ...getBlogTagRoutes()],
    },
  },

  app: {
    // Fade between routes; pairs with .page-* transitions in main.css.
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      // No-flash flavor init: runs in <head> before first paint, resolves the
      // stored preference (or system for "auto") to a concrete data-flavor, and
      // marks <html class="js"> so JS-gated reveals can activate. Keeps the
      // canvas logo + switcher from mismatching on hydration.
      script: [
        {
          innerHTML:
            ';(function(){try{var d=document.documentElement;d.classList.add("js");var p=localStorage.getItem("flavor")||"auto";var f=p==="auto"?(window.matchMedia("(prefers-color-scheme: light)").matches?"latte":"mocha"):p;d.setAttribute("data-flavor",f);}catch(e){document.documentElement.setAttribute("data-flavor","mocha");}})();',
          tagPosition: 'head',
          tagPriority: 'critical',
        },
      ],
      // NOTE: title here is only the SSR default before Vue hydrates. All
      // social/meta tags (description, OG, Twitter, canonical) are owned by a
      // single source - app.vue's useSeoMeta - so they stay correct per-route
      // and emit OG as `property=` (the previous inline array emitted the OG
      // tags as `name=`, which the OG protocol ignores, and duplicated them).
      title: 'Raz - Simone Colabufalo',
    },
  },

  compatibilityDate: '2025-10-17',
})
