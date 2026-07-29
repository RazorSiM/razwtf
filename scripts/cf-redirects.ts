import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'

/**
 * Status codes Cloudflare Workers accepts in a `_redirects` rule.
 *
 * Pages also understood 404, and that is how nitro's `cloudflare_pages_static`
 * preset expresses "serve the custom 404 page": it ends every `_redirects` it
 * writes with `/* /404.html 404`. Workers does not merely ignore that line, it
 * rejects the whole deploy:
 *
 *     Invalid _redirects configuration:
 *     Line 2: Valid status codes are 200, 301, 302 (default), 303, 307, or 308.
 *     Got 404. [code: 100324]
 *
 * So the line has to go before the file is uploaded. `not_found_handling:
 * "404-page"` in wrangler.jsonc is what serves 404.html in its place.
 *
 * This cannot be caught by testing locally. `wrangler dev` parses the same file
 * and is more forgiving than the API: it logs the line as invalid, skips it, and
 * serves the site correctly. Only a real deploy fails.
 */
const WORKERS_REDIRECT_CODES = new Set([200, 301, 302, 303, 307, 308])

/** Drop `_redirects` rules Cloudflare Workers would reject, in place. */
export async function stripUnsupportedRedirects(outputDir: string): Promise<void> {
  const file = join(outputDir, '_redirects')

  let source: string
  try {
    source = await readFile(file, 'utf8')
  } catch {
    // No `_redirects` at all, which means the preset is not the one we think it
    // is. See gotcha 12; the build is wrong in a bigger way than this can fix.
    return
  }

  const dropped: string[] = []
  const kept = source.split('\n').filter((line) => {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) return true

    // `source destination [code]`, whitespace-separated. nitro writes the
    // retroguardia rule tab-separated and the 404 catch-all space-separated,
    // so split on any run of whitespace rather than on one character.
    const code = trimmed.split(/\s+/)[2]
    if (code === undefined) return true

    const parsed = Number(code)
    if (Number.isInteger(parsed) && !WORKERS_REDIRECT_CODES.has(parsed)) {
      dropped.push(trimmed)
      return false
    }
    return true
  })

  if (dropped.length === 0) return

  // Keep the trailing newline whether or not the dropped rule was the last line.
  const rewritten = kept.join('\n').replace(/\n*$/, '\n')
  await writeFile(file, rewritten, 'utf8')
  for (const rule of dropped) {
    console.info(`[cf-redirects] dropped unsupported rule: ${rule}`)
  }
}
