// Kinetic-type DOM helpers (raz-lx4 / raz-dr2).
//
// Splits a heading into per-word (or per-letter) spans *in place* while
// preserving inline markup (<em>, heading anchor <a>) and whitespace, then
// cascades them in with motion-v. Runs entirely on the client, after
// hydration, by direct DOM mutation - the content is static so Vue never
// re-patches it, and there is no hydration mismatch (SSR ships plain text).

const WORD = 'kt-word'

/** Recursively wrap each word in a span, keeping element nesting + whitespace. */
export function splitWords(root: HTMLElement): HTMLElement[] {
  const spans: HTMLElement[] = []
  walk(root)
  return spans

  function walk(node: Node) {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) replaceText(child as Text, node, false)
      else if (child.nodeType === Node.ELEMENT_NODE) walk(child)
    }
  }

  function replaceText(textNode: Text, parent: Node, byChar: boolean) {
    const value = textNode.nodeValue ?? ''
    if (!value) return
    const frag = document.createDocumentFragment()
    const parts = byChar ? [...value] : value.split(/(\s+)/)
    for (const part of parts) {
      if (part === '') continue
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part))
        continue
      }
      const span = document.createElement('span')
      span.className = WORD
      span.textContent = part
      frag.appendChild(span)
      spans.push(span)
    }
    parent.replaceChild(frag, textNode)
  }
}

/** Same, but one span per grapheme (used for the hero mega-wordmark). */
export function splitLetters(root: HTMLElement): HTMLElement[] {
  const spans: HTMLElement[] = []
  walk(root)
  return spans

  function walk(node: Node) {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const value = (child as Text).nodeValue ?? ''
        if (!value) continue
        const frag = document.createDocumentFragment()
        for (const ch of value) {
          if (/^\s$/.test(ch)) {
            frag.appendChild(document.createTextNode(ch))
            continue
          }
          const span = document.createElement('span')
          span.className = WORD
          span.textContent = ch
          frag.appendChild(span)
          spans.push(span)
        }
        node.replaceChild(frag, child)
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        walk(child)
      }
    }
  }
}

export interface CascadeOptions {
  distance: number
  stagger: number // ms between spans
  stiffness: number
  damping: number
  scale?: number // 0..1 intensity multiplier (dialled down for small type)
}

/** Set spans to their hidden start pose so nothing flashes before the cascade. */
export function primeHidden(spans: HTMLElement[], distance: number, scale = 1): void {
  const d = distance * scale
  for (const s of spans) {
    s.style.opacity = '0'
    s.style.transform = `translateY(${d}px)`
    s.style.willChange = 'transform, opacity'
  }
}

/** Spring each span up into place, staggered in document order. */
export async function cascade(spans: HTMLElement[], opts: CascadeOptions): Promise<void> {
  const { animate } = await import('motion-v')
  const scale = opts.scale ?? 1
  const d = opts.distance * scale
  spans.forEach((s, i) => {
    s.style.opacity = '0'
    s.style.transform = `translateY(${d}px)`
    s.style.willChange = 'transform, opacity'
    const controls = animate(
      s,
      { opacity: [0, 1], transform: [`translateY(${d}px)`, 'translateY(0px)'] },
      { type: 'spring', stiffness: opts.stiffness, damping: opts.damping, delay: (i * opts.stagger * scale) / 1000 },
    )
    // Drop the promoted layer once the span has landed - no permanent will-change.
    controls?.finished?.then(() => (s.style.willChange = '')).catch(() => {})
  })
}

/** Reveal instantly with no motion (reduced-motion / fallback). */
export function showInstant(spans: HTMLElement[]): void {
  for (const s of spans) {
    s.style.opacity = '1'
    s.style.transform = 'none'
    s.style.willChange = ''
  }
}
