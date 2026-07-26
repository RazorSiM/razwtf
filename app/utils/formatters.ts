import { format } from 'date-fns'

// Content dates are stored as midnight-UTC ISO strings. Normalise to the UTC
// calendar date before formatting so the server (UTC) and the client (any
// timezone) render the SAME day - otherwise the displayed day can shift and
// Vue reports a hydration mismatch.
export function formatDate(date: Date | number | string, formatStr: string = 'MMMM d, yyyy'): string {
  const d = new Date(date)
  const stable = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
  return format(stable, formatStr)
}

// Recursively collect visible text from a Nuxt Content body AST (or any nested
// node / array / string), so reading time can be estimated without a remark
// plugin. Defensive about node shape: text nodes carry { type:'text', value },
// element nodes nest under `children`, the root nests its nodes under `value`.
export function extractText(node: unknown): string {
  if (node == null)
    return ''
  if (typeof node === 'string')
    return node
  if (Array.isArray(node))
    return node.map(extractText).join(' ')
  if (typeof node === 'object') {
    const n = node as Record<string, unknown>
    if (n.type === 'text' && typeof n.value === 'string')
      return n.value
    return extractText(n.children ?? n.value)
  }
  return ''
}

// Rough reading time in minutes from a plaintext string (~200 wpm, min 1).
export function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
