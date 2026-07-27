import { defineCollection, defineContentConfig, z } from '@nuxt/content'

// A gallery is an ordered list of groups, each with a heading (description)
// and one or more images. Mirrors the shape used in the existing project
// markdown frontmatter.
const gallerySchema = z
  .array(
    z.object({
      description: z.string().optional(),
      images: z.array(
        z.object({
          name: z.string().optional(),
          alt: z.string().optional(),
          src: z.string(),
        }),
      ),
    }),
  )
  .optional()

// Raw <head> passthrough (twitter/og meta) as authored in frontmatter.
// Kept loose so arbitrary SEO tags validate without being enumerated.
const headSchema = z.record(z.string(), z.any()).optional()

export default defineContentConfig({
  collections: {
    // Ad-hoc standalone pages served by app/pages/[...slug].vue: drop a
    // markdown file at the content root and it gets a route and a reading
    // column, no code change. Empty today; the three singleton pages below
    // are excluded because each owns a richly-typed collection instead.
    pages: defineCollection({
      type: 'page',
      source: { include: '*.md', exclude: ['index.md', 'about.md', 'blog.md'] },
      schema: z.object({
        title: z.string().optional(),
        description: z.string().optional(),
      }),
    }),

    // Global chrome shared by every page: the author identity used in bylines,
    // the footer, the labels on post/project furniture, and the error page.
    // A `data` collection rather than a `page` one because none of it is a
    // routable document.
    site: defineCollection({
      type: 'data',
      source: 'site.yml',
      schema: z.object({
        author: z.object({
          name: z.string(),
          // Single letter shown in the square avatar tile.
          monogram: z.string(),
          bio: z.string(),
        }),
        footer: z.object({
          blurb: z.string(),
          elsewhereHeading: z.string(),
          siteHeading: z.string(),
          links: z.array(
            z.object({
              label: z.string(),
              to: z.string(),
              // Notes only appears once a post is published (raz-je5).
              requiresPosts: z.boolean().default(false),
            }),
          ),
          // The vim-style status bar. Decorative, but still words.
          statusLine: z.object({
            mode: z.string(),
            branch: z.string(),
            path: z.string(),
            coords: z.string(),
            flavorLabel: z.string(),
          }),
          colophon: z.object({ left: z.string(), right: z.string() }),
        }),
        post: z.object({
          tocHeading: z.string(),
          backLabel: z.string(),
          bylinePrefix: z.string(),
          readSuffix: z.string(),
          relatedLabel: z.string(),
          relatedNote: z.string(),
          bioLabel: z.string(),
        }),
        project: z.object({
          backLabel: z.string(),
          eyebrow: z.string(),
          overview: z.object({ label: z.string(), note: z.string() }),
          gallery: z.object({ label: z.string(), note: z.string() }),
          details: z.object({ label: z.string(), note: z.string() }),
        }),
        error: z.object({
          kicker: z.string(),
          notFoundHeading: z.string(),
          notFoundDetail: z.string(),
          genericHeading: z.string(),
          genericDetail: z.string(),
          homeCta: z.string(),
          workCta: z.string(),
        }),
      }),
    }),

    // The about page. Body holds the Q&A story; frontmatter holds the
    // editorial masthead and the closing contact row.
    about: defineCollection({
      type: 'page',
      source: 'about.md',
      schema: z.object({
        eyebrow: z.string(),
        // Masthead name, split so the nickname keeps its italic mauve <em>.
        nameBefore: z.string(),
        nameEm: z.string(),
        nameAfter: z.string(),
        roleBefore: z.string(),
        roleEm: z.string(),
        lead: z.string(),
        socialsLabel: z.string(),
        story: z.object({ n: z.string(), label: z.string(), note: z.string() }),
        contact: z.object({ prompt: z.string(), cta: z.string() }),
      }),
    }),

    // The notes index (content/blog.md -> /blog). Sits at the content root
    // rather than in blog/ so the `posts` glob can't try to parse it as a post.
    blogIndex: defineCollection({
      type: 'page',
      source: 'blog.md',
      schema: z.object({
        marker: z.object({ n: z.string(), label: z.string(), note: z.string() }),
        heading: z.string(),
        lead: z.string(),
        searchPlaceholder: z.string(),
        emptyState: z.string(),
        // `{query}` is substituted with what the visitor typed.
        noMatches: z.string(),
      }),
    }),

    // The work listing page. Body is the intro prose.
    projectsIndex: defineCollection({
      type: 'page',
      source: 'projects/index.md',
      schema: z.object({
        marker: z.object({ n: z.string(), label: z.string(), note: z.string() }),
        heading: z.string(),
      }),
    }),

    // The homepage. Every string the visitor reads lives here rather than in
    // app/pages/index.vue: frontmatter carries the short, structured copy
    // (hero lines, capability cards, section headings) and the markdown body
    // carries the one genuinely prose block, the About section, so it can use
    // real links and emphasis.
    //
    // Deliberately NOT a page builder: this schema describes the copy for a
    // fixed set of sections. Which sections exist, their order and their
    // layout stay in index.vue, where they can be typed and styled properly.
    home: defineCollection({
      type: 'page',
      source: 'index.md',
      // `title`, `description` and `seo` come from Content's built-in page
      // schema and are merged in automatically; only the bespoke fields are
      // declared here.
      schema: z.object({
        hero: z.object({
          eyebrow: z.string(),
          // Split so the ampersand can keep its italic peach treatment.
          taglineBefore: z.string(),
          taglineAfter: z.string(),
          lead: z.string(),
          primaryCta: z.object({ label: z.string(), to: z.string() }),
          secondaryCta: z.object({ label: z.string(), to: z.string() }),
          status: z.string(),
        }),
        capabilities: z.array(
          z.object({
            label: z.string(),
            body: z.string(),
          }),
        ),
        work: z.object({
          marker: z.string(),
          note: z.string(),
          heading: z.string(),
          lead: z.string(),
        }),
        spotlight: z.object({
          marker: z.string(),
          note: z.string(),
          cta: z.string(),
        }),
        about: z.object({
          marker: z.string(),
          note: z.string(),
          // Heading is split so the nickname keeps its italic peach <em>
          // treatment inside KineticText's per-word animation.
          headingBefore: z.string(),
          headingEm: z.string(),
          headingAfter: z.string(),
          quote: z.string(),
          quoteCite: z.string(),
          cta: z.string(),
          aside: z.object({
            image: z.string(),
            alt: z.string(),
            caption: z.string(),
            chips: z.array(z.string()),
          }),
        }),
        notes: z.object({
          marker: z.string(),
          note: z.string(),
          heading: z.string(),
          cta: z.string(),
        }),
      }),
    }),

    // Project case studies: content/projects/*.md, excluding the listing page.
    projects: defineCollection({
      type: 'page',
      source: {
        include: 'projects/*.md',
        exclude: ['projects/index.md'],
      },
      schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.coerce.date(),
        // Hero / cover image. `hero` is the field the existing content uses;
        // `cover` and `image` are accepted aliases for future content.
        hero: z.string().optional(),
        cover: z.string().optional(),
        image: z.string().optional(),
        excerpt: z.string().optional(),
        tags: z.array(z.string()).optional(),
        tech: z.array(z.string()).optional(),
        // --- Studio Terminal home/spotlight metadata ---
        // featured: show large in the work grid. spotlight: drive section 02.
        featured: z.boolean().default(false),
        spotlight: z.boolean().default(false),
        // Copy for homepage section 02. It lives on the project rather than on
        // the homepage because it describes *this* set: moving `spotlight: true`
        // to another project would otherwise leave the old set's prose behind.
        spotlightCopy: z
          .object({
            heading: z.string(),
            pullquote: z.string(),
            pullquoteCite: z.string(),
            // Markdown; rendered inline so it can carry emphasis and links.
            body: z.string(),
            palette: z
              .array(
                z.object({
                  // Catppuccin CSS custom-property name, e.g. "green".
                  token: z.string(),
                  label: z.string(),
                }),
              )
              .default([]),
            // Extra spec rows. Year and Role are derived from the fields above.
            specs: z
              .array(
                z.object({
                  label: z.string(),
                  value: z.string(),
                }),
              )
              .default([]),
          })
          .optional(),
        // Per-project signature accent (Catppuccin token name, e.g. "green").
        accent: z.enum(['mauve', 'lavender', 'sky', 'green', 'peach', 'blue', 'teal', 'pink', 'yellow']).optional(),
        // Editorial bits surfaced on cards without opening the case study.
        year: z.union([z.number(), z.string()]).optional(),
        role: z.string().optional(),
        kicker: z.string().optional(),
        collab: z.string().optional(),
        // Case-study detail metadata. `type` feeds the hero metabar ("GMK
        // keycap set", "Vue template"); `heroCaption` is the caption under the
        // hero render (falls back to the title). `tech` (below) doubles as the
        // stack line in the Details block.
        type: z.string().optional(),
        heroCaption: z.string().optional(),
        // Homepage ordering (lower = earlier); falls back to date when unset.
        order: z.number().optional(),
        // External links for the project (repo, IC thread, discord, etc.).
        links: z
          .array(
            z.object({
              label: z.string().optional(),
              url: z.string(),
            }),
          )
          .optional(),
        url: z.string().optional(),
        gallery: gallerySchema,
        head: headSchema,
      }),
    }),

    // Blog posts: content/blog/**. No posts exist yet - the collection is
    // defined so later phases can drop in markdown without config changes.
    // Match only markdown so the `.gitkeep` placeholder (kept to track the
    // empty dir in git) isn't picked up and fails to parse.
    posts: defineCollection({
      type: 'page',
      source: 'blog/**/*.md',
      schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.coerce.date(),
        tags: z.array(z.string()).optional(),
        draft: z.boolean().default(false),
        cover: z.string().optional(),
      }),
    }),
  },
})
