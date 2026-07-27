import { defineConfig, presetIcons, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss'
import { presetScrollbar } from 'unocss-preset-scrollbar'

// Catppuccin token -> theme color. Tokens are SPACE-separated "R G B" triples
// (see app/assets/css/themes.css). presetWind4 does opacity via color-mix and
// does NOT substitute the wind3 `<alpha-value>` placeholder - leaving it in
// produces invalid color-mix() and every color utility silently drops. A bare
// `rgb(var(--x))` is a complete color; wind4's own mechanism handles /alpha
// modifiers (text-mauve, bg-crust/72, border-surface-1/90, …).
function c(v: string) {
  return `rgb(var(--${v}))`
}

// presetWind4 wants each text size as a { fontSize, lineHeight } object, not a
// bare string; a string makes it emit `var(--text-*-fontSize)` without ever
// defining that var, so headings collapse to 16px. lineHeight here is only a
// fallback - per-element `leading-*` still wins via --un-leading.
function fs(v: string, lh: string) {
  return { fontSize: `var(--fs-${v})`, lineHeight: lh }
}

const MONO = '"Victor Mono", ui-monospace, "SFMono-Regular", "Cascadia Code", Menlo, Consolas, monospace'
const DISPLAY = '"Fraunces", Georgia, "Times New Roman", serif'

export default defineConfig({
  transformers: [transformerDirectives(), transformerVariantGroup()],
  presets: [
    presetWind4({
      preflights: {
        reset: true,
      },
    }),
    presetScrollbar(),
    presetIcons({
      scale: 1.2,
    }),
  ],
  rules: [['text-xxs', { 'font-size': '0.6rem' }]],
  theme: {
    font: {
      sans: MONO,
      mono: MONO,
      display: DISPLAY,
      serif: DISPLAY,
    },
    // Fluid type scale - mirrors --fs-* in main.css. Yields text-micro … text-mark.
    text: {
      micro: fs('micro', '1.4'),
      cap: fs('cap', '1.4'),
      sm: fs('sm', '1.5'),
      body: fs('body', '1.55'),
      lead: fs('lead', '1.5'),
      h3: fs('h3', '1.1'),
      h2: fs('h2', '1.05'),
      h1: fs('h1', '1.02'),
      mark: fs('mark', '1'),
    },
    radius: {
      DEFAULT: 'var(--radius)',
      sm: 'var(--radius)',
      md: 'var(--radius-md)',
      lg: 'var(--radius-lg)',
      full: '9999px',
    },
    // LITERALS, not var(--ease*) - presetWind4 emits a CSS variable per theme
    // entry, so `out: 'var(--ease-out)'` emitted `--ease-out: var(--ease-out)`.
    // That self-reference is a custom-property cycle, which makes --ease-out
    // resolve to nothing, which in turn makes every `transition:` SHORTHAND
    // containing it invalid at computed-value time and silently reverts it to
    // `all 0s`. Keep these in sync with the --ease/--ease-out tokens in
    // main.css, which hand-written CSS still reads.
    ease: {
      DEFAULT: 'cubic-bezier(.22, .61, .36, 1)',
      out: 'cubic-bezier(.16, 1, .3, 1)',
    },
    // Keep the common defaults working AND add the mockup's semantic breakpoints.
    breakpoint: {
      xs: '480px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      dots: '560px',
      foot: '720px',
      caps: '760px',
      nav: '820px',
      wide: '900px', // renamed from 'grid' - collided with grid-* utilities (grid:cols-… stole grid-cols-…)
      spot: '920px',
    },
    colors: {
      rosewater: c('rosewater'),
      flamingo: c('flamingo'),
      pink: c('pink'),
      mauve: c('mauve'),
      red: c('red'),
      maroon: c('maroon'),
      peach: c('peach'),
      yellow: c('yellow'),
      green: c('green'),
      teal: c('teal'),
      sky: c('sky'),
      sapphire: c('sapphire'),
      blue: c('blue'),
      lavender: c('lavender'),
      text: c('text'),
      subtext: { 0: c('subtext0'), 1: c('subtext1') },
      overlay: { 0: c('overlay0'), 1: c('overlay1'), 2: c('overlay2') },
      surface: { 0: c('surface0'), 1: c('surface1'), 2: c('surface2') },
      base: c('base'),
      mantle: c('mantle'),
      crust: c('crust'),
    },
    shadow: {
      '3xl': '0 25px 50px -12px rgb(0 0 0 / 50%)',
    },
  },
  shortcuts: [
    // Layout containers ----------------------------------------------------
    ['wrap', 'w-full max-w-[var(--maxw)] mx-auto px-[var(--pad-x)]'],
    ['wrap-read', 'w-full max-w-[calc(var(--measure-wide)_+_2*var(--pad-x))] mx-auto px-[var(--pad-x)]'],
    ['section-y', 'py-[var(--section-y)]'],

    // Eyebrow + section markers -------------------------------------------
    [
      'eyebrow',
      'inline-flex items-center gap-[.7em] font-mono text-micro tracking-[.26em] uppercase text-subtext-0 font-600',
    ],
    ['secmark', 'flex items-baseline gap-[1.1rem] flex-wrap'],
    ['secmark-n', 'font-mono font-600 text-sm tracking-[.12em] text-mauve tabular-nums'],
    ['secmark-label', 'font-mono text-cap tracking-[.22em] uppercase text-subtext-1 font-600'],
    ['secmark-rule', 'flex-1 min-w-[1.5rem] h-px self-center bg-gradient-to-r from-surface-1/90 to-transparent'],
    ['secmark-note', 'font-mono text-micro tracking-[.16em] uppercase text-overlay-1'],

    // Display heading helper ----------------------------------------------
    // font-optical-sizing:auto is required - every bespoke Fraunces heading set
    // it; migrating them onto `display` without it is a subtle glyph regression.
    ['display', 'font-display font-[560] leading-[1.02] tracking-[-.018em] text-balance [font-optical-sizing:auto]'],

    // Buttons --------------------------------------------------------------
    [
      'btn',
      'inline-flex items-center gap-[.6em] font-mono text-cap tracking-[.1em] uppercase font-600 px-[1.35rem] py-[.85rem] rounded transition-all duration-300 ease',
    ],
    ['btn-primary', 'btn bg-mauve text-crust hover:bg-lavender hover:-translate-y-2px'],
    ['btn-ghost', 'btn border border-surface-1/90 text-text hover:border-mauve hover:text-mauve'],

    // Inline CTA link with animated underline -----------------------------
    [
      'link-cta',
      'group relative inline-flex items-baseline gap-[.55em] font-mono text-cap tracking-[.1em] uppercase font-600 text-text pb-[3px]',
    ],

    // Chip -----------------------------------------------------------------
    [
      'chip',
      'inline-flex items-center gap-[.5em] font-mono text-micro tracking-[.12em] uppercase px-[.75rem] py-[.4rem] rounded-full text-subtext-1 border border-surface-1/90 transition-colors duration-300',
    ],

    // Lead paragraph -------------------------------------------------------
    ['lead', 'text-lead text-subtext-1 leading-[1.55] max-w-[52ch]'],

    // Kinetic-type refactor additions (raz-y7w) ---------------------------
    // Semantic atoms extracted from repeated markup across pages. Colour that
    // varies per-instance (accent swatches, per-card --c) stays inline.
    ['kicker', 'inline-flex items-center gap-[.6em] font-mono text-micro tracking-[.16em] uppercase text-subtext-0'],
    ['swatch', 'inline-block w-[9px] h-[9px] rounded-[2px]'],
    ['copy', 'text-body text-subtext-1 leading-[1.65]'],
    ['dotsep', 'inline-block w-[3px] h-[3px] rounded-full bg-overlay-0'],
    ['cite-line', 'block not-italic font-mono text-micro uppercase text-overlay-1'],
    ['pullquote', 'border-l-2 pl-[1.2rem] font-display italic font-[420] text-lead leading-[1.4] text-text'],
    ['status-seg', 'inline-flex items-center gap-[.55em] whitespace-nowrap px-[.85rem] py-[.5rem]'],
    ['link-footer', 'text-body text-subtext-1 transition-colors duration-300 ease hover:text-mauve'],
    ['chip-link', 'chip transition-colors hover:text-text hover:border-mauve/80'],
    // Icon button chrome (header / scroll-top / lightbox). size + shape as modifiers.
    [
      'icon-btn',
      'grid place-items-center border border-surface-1/90 rounded text-text transition-all duration-300 ease hover:border-mauve hover:text-mauve active:scale-[.94]',
    ],
    // Back link with hover-sliding arrow (mono uppercase "← All X").
    // NOTE: `group` is NOT included here - UnoCSS drops the bare `group` marker
    // from inside a shortcut. Add `group` directly on the element (see BackLink).
    [
      'backlink',
      'inline-flex items-center gap-[.55em] font-mono text-micro tracking-[.16em] uppercase text-subtext-0 transition-colors duration-300 ease hover:text-text',
    ],
    // BUG FIX: `arw` is referenced on 4+ CTAs/links but was never defined, so
    // every arrow's hover-slide silently did nothing. Reduced-motion safe.
    [
      'arw',
      'inline-block transition-transform duration-[350ms] ease-out group-hover:translate-x-[4px] motion-reduce:group-hover:translate-x-0',
    ],
  ],
})
