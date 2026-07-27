// usePretext - SSR-safe bridge to @chenglou/pretext (raz-lx4).
//
// pretext is a *measurement* engine: it measures text with the browser font
// engine via canvas, so it can only run on the CLIENT after fonts load. This
// composable owns that lifecycle - lazy client-only module load, a shared
// font-readiness gate, and the two geometry queries the kinetic type system
// needs: a balanced wrap width and the natural (single-line) width for
// fill-to-width display type. On the server everything degrades to no-ops so
// callers render plain, complete text and enhance after hydration.

type Pretext = typeof import('@chenglou/pretext')

let ptPromise: Promise<Pretext> | null = null
let fontsPromise: Promise<void> | null = null

/** Lazy-load the pretext module once, client-only. Resolves null on the server. */
export function loadPretext(): Promise<Pretext | null> {
  if (!import.meta.client)
    return Promise.resolve(null)
  ptPromise ??= import('@chenglou/pretext')
  return ptPromise
}

/**
 * Resolve once the given font faces are actually loaded, so canvas measurement
 * matches rendered metrics. Measuring before this yields fallback-font numbers.
 */
export function fontsReady(faces: string[] = ['600 100px Fraunces', 'italic 460 100px Fraunces']): Promise<void> {
  if (!import.meta.client || !document.fonts?.load)
    return Promise.resolve()
  fontsPromise ??= (async () => {
    try {
      await Promise.all(faces.map(f => document.fonts.load(f)))
      await document.fonts.ready
    }
    catch {}
  })()
  return fontsPromise
}

/** Build a canvas `font` shorthand synced to an element's computed style. */
export function fontStringOf(el: HTMLElement): string {
  const cs = getComputedStyle(el)
  const style = cs.fontStyle && cs.fontStyle !== 'normal' ? `${cs.fontStyle} ` : ''
  return `${style}${cs.fontWeight} ${Number.parseFloat(cs.fontSize)}px ${cs.fontFamily}`
}

export interface PretextTools {
  loadPretext: typeof loadPretext
  fontsReady: typeof fontsReady
  fontStringOf: typeof fontStringOf
  /**
   * Tightest width that still yields the natural line count at `containerW`, so
   * lines break evenly (no long-then-orphan). Returns `containerW` when the text
   * fits on one line or balancing is disabled.
   */
  balancedWidth: (pt: Pretext, text: string, font: string, containerW: number) => number
  /** Width of the text forced onto a single line - drives fill-to-width scaling. */
  naturalWidth: (pt: Pretext, text: string, font: string) => number
}

export function usePretext(): PretextTools {
  function balancedWidth(pt: Pretext, text: string, font: string, containerW: number): number {
    const prepared = pt.prepareWithSegments(text, font)
    const target = pt.measureLineStats(prepared, containerW).lineCount
    if (target <= 1)
      return containerW
    let lo = 0
    let hi = containerW
    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2
      if (pt.measureLineStats(prepared, mid).lineCount <= target)
        hi = mid
      else lo = mid
    }
    // nudge past the boundary so the last fitting width isn't a hair short
    return Math.ceil(hi + 0.5)
  }

  function naturalWidth(pt: Pretext, text: string, font: string): number {
    return pt.measureNaturalWidth(pt.prepareWithSegments(text, font))
  }

  return { loadPretext, fontsReady, fontStringOf, balancedWidth, naturalWidth }
}
