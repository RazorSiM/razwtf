<script lang="ts" setup>
/* ==========================================================================
   Animated ASCII logo (client-only canvas)
   - Ports the EXACT character grid from the real character-grid wordmark and
     renders it on a canvas in the live Catppuccin tier colours, so it re-tints
     with the active flavour.
   - CIRCLE: the wide 25-row grid is centred inside a taller square field of
     procedural static and faded into a circle by a radial alpha mask.
   - IDLE: every glyph twinkles on its own random phase/speed; the bright "raz"
     cells breathe brighter, and a sparse random subset glints with accent tint.
   - SIZE: each cell has a persistent random size (quantised into font buckets).
   - POINTER: cells near the cursor brighten, tint toward the accent, ripple
     outward and glyph-scramble - a soft lens that follows the pointer.
   - REVEAL: a left-to-right scramble-in resolves the grid on load, and vigorous
     pointer movement re-triggers it.
   - REDUCED MOTION: one crisp static draw, no loop, no pointer reaction.
   ========================================================================== */

/* GRID[r] = [chars, tiers]. tiers per cell: 0=base 1=mantle 2=crust 3=text 4=subtext1.
   Faithfully parsed from the real character-grid wordmark; the bright cells (3,4)
   form the "raz" shape floating in a field of near-invisible base-tier static. */
const GRID: [string, string][] = [
  ['aarrzrazzrrzarazrzzarrzzzarrzazrrrazazzrazazazarzaaarzrzarzaaazararraazrzraazzra', '00000000000000000000000000000000000000000000000000000000000000000000000000000000'],
  ['rrzarzzzzzrarrazarzzrzrazzrazrrrzzzzaaaazrrazzrzaaazzaazzrzarrrrzzzazzazzzzarrar', '00000000000000000000000000000000000000000000000000000000000000000000000000000000'],
  ['rrrzazrzrrraraazzzzrzararzarzarzzzzrrarazrzaaazrrrrrrrazzzaaazrarrrrazazrararaar', '00000000000000000000000000000000000000000000000000000000000000000000000000000000'],
  ['azzzazrazazrazrarzzzzazrzrrraarzrzaarrrzrraarazzzzarzraararzzzaarzrzarraraarrrzr', '00000000000000000000000111222222222222222222222222222222222222221000000000000000'],
  ['raazrzararrzaarrzzaaazrrzaaazaazrzzazrzzraraazazrazrzrzrazrrazzazzarrrzaazzrrzzr', '00000000000000000001224443333333333333333333333333333333333333334000000000000000'],
  ['razzrrazazzzzzrrazarzzraazrazrzrrzarrrzrrzzzzzzzzarraarzararaazrrraaaarazarrzrrr', '00000000000000000124333334444444444433333344444444444444443333332000000000000000'],
  ['aarraaazrzrrrrarraarrzzazzzazazaaaarrzrrrrzzrrrazrrzrzzaarzrrzzzzzrrrararzzzzarz', '00000000000000002433334221111111112333333321111111111111143333410000000000000000'],
  ['aazarazarzaazzrarzrzzrarzazazrzaaaararaaaaarzzarzazrraaraaazrzazazrrrrrrzaazzzrr', '00000000000000043333440000000000243333333320000000000012333332000000000000000000'],
  ['azazzazzrarrarazzaazzzazzzraaarazaaararzazrraazzrzzaaazzzzrraarzrazrazarzarzraar', '00000000000000043333100000000012333342333320000000000243333420000000000000000000'],
  ['aazaaraazraraazrraazarzraarzzarrrzzazraararaarzzzraarzzrzrazazaaaraaraaazaazrrra', '00000000000000033332000000001243333212333320000000012333344100000000000000000000'],
  ['raarzrarazzzaarararaaaraarzzzzarzzaarzrrrrrrzzaazrraaaazzazzrzzazrrazaazrzzrrarr', '00000000000000043334100000014333341001333310000000143333210000000000000000000000'],
  ['aazaarazzzazzzrzrazraaazrzzrzzrrarraraaazzazaaaazrazzraarrrarzzazarzaarzzzraaazr', '00000000000000033333410000233334210000111100000014333342000000000000000000000000'],
  ['zrrrrzazzzaazrzazzzaraaarrrraaazaazzrazzararrrarrzarrazazzrrzzrarzzaararaazzzazz', '00000000000000002433334414333321000000000000001233333200000000000000000000000000'],
  ['raaaaararzzarzaazrrrzazrazrzzzraraaazzrraazaaarazzrarrazaarazrzzzrzzzzrzrzrazzzz', '00000000000000000124333333333444444444442210014333344000000000000000000000000000'],
  ['aarararrrrzraaarzzazaaaaaaaazaaaarzzarazaazzzrzrrrrzraazazaazarzzzazaarrzrzazaar', '00000000000000000001243333333333333333333311243333210000000000000000000000000000'],
  ['arzazaazraarazzrzazzzzzzarzrzzaaaaaazraarzrazzrrzrzaazzarzzzzzazrrrrarrzrarzazar', '00000000000000000001233334222222222222222114333341000000000000000000000000000000'],
  ['arrrazaazrrzaazzrzrzzrzzaarraarzaarazzrzrzzzrazarrrrrzraaaaarraaarazrzzazzazzraz', '00000000000000000023333321000000000000001433333200000000000000000000000000000000'],
  ['zarrrrrrarzzrzrraaaazaazrarzzazzzrrzarrazzazaazzrzzaaaaaazarrazarrarrrazarrarzza', '00000000000000001433334100000000000000144333321111111111111111100000000000000000'],
  ['aaarrarzaarrraaaazazzrzaazrrrrrarrararazzraaaarzazrrzzrazarzazzrazzarazzaarrrazz', '00000000000000023333320000000000000001233333444444444444444444442000000000000000'],
  ['aararzaaaarrrzrrzzaarazzazaazrarzrzrzzazazzzzzaarrraazzazaaarzrzazaaazzzzarrzarz', '00000000000000043334100000000000000001333333333333333333333333334000000000000000'],
  ['rzzrzrraaazazrrrzrarzrzrzarzrzrazazaaazrrzrzaazrazzzzrarrrazraaaarrrzzarazraazzr', '00000000000000014211000000000000000000212222222222222222222222221000000000000000'],
  ['zaazzaaarrzzzarzrzrrrzrzzzzzrrrzrzzzrrarazrzzrzzzzarrzazaazrrzzrarrrarrrazzzzzrr', '00000000000000000000000000000000000000000000000000000000000000000000000000000000'],
  ['aarrrazzzarrrrzzzrzraaazrzzzzaazrrazrzrzaaarzarzzzaraaarrzzrzaazrrzzazararaaarrr', '00000000000000000000000000000000000000000000000000000000000000000000000000000000'],
  ['rzrrzraraaaarzarzazrrzrrzazarrrazaararraazrzzrrarazzzzazazaraaazrzzazzzrzrrarraz', '00000000000000000000000000000000000000000000000000000000000000000000000000000000'],
  ['aazazzrzraarzrrrzaarazarzzzzrrzaraararrrazzarazzaarzzraarrzzraazaaarazrrarraaazr', '00000000000000000000000000000000000000000000000000000000000000000000000000000000'],
]

const host = ref<HTMLDivElement | null>(null)
const { flavor } = useFlavor()

// Handles wired up in onMounted; referenced by the flavor watcher + teardown.
let cleanup: (() => void) | null = null
let readColorsHook: (() => void) | null = null
let drawStaticHook: (() => void) | null = null
let reduce = false

onMounted(() => {
  // Both are re-declared with explicitly non-null types after their guards:
  // TypeScript drops flow narrowing inside the nested functions below (measure,
  // draw, the rAF loop), so without this every use reads as possibly-null.
  const hostEl = host.value
  if (!hostEl)
    return
  const el: HTMLElement = hostEl

  const canvas = document.createElement('canvas')
  el.appendChild(canvas)
  const ctx2d = canvas.getContext('2d')
  if (!ctx2d)
    return
  const ctx: CanvasRenderingContext2D = ctx2d

  // Set true by cleanup() so a late-resolving font-load promise can no longer
  // start the rAF loop after the component has already unmounted.
  let disposed = false

  const REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  reduce = REDUCE
  const MONO = '"Victor Mono", ui-monospace, "Cascadia Code", Menlo, monospace'
  const WEIGHT = 600

  const ROWS = GRID.length
  const COLS = GRID[0]![0]!.length

  /* mono advance ratio + line-height factor - used to build a SQUARE field so
     the circular mask reads as a true circle (glyph cells are tall-narrow). */
  ctx.font = `500 100px ${MONO}`
  const ADV = (ctx.measureText('a').width / 100) || 0.6 // ~0.6 for Victor Mono
  const LH = 1.02
  const FROWS = Math.max(ROWS, Math.round(COLS * ADV / LH)) // ≈ square pixel field
  const ROFF = Math.floor((FROWS - ROWS) / 2) // vertical offset of real rows
  const N = FROWS * COLS

  /* flatten to fast typed arrays - real rows centred in a field of static */
  const CHAR: string[] = new Array(N)
  const TIER = new Uint8Array(N)
  const RAND = new Float32Array(N) // per-cell shimmer phase
  const SPD = new Float32Array(N) // per-cell shimmer speed
  const SPARK = new Float32Array(N) // per-cell sparkle roll
  const SCALE = new Float32Array(N) // persistent per-cell size scale
  const BUCKET = new Uint8Array(N) // quantised size bucket
  const REVEALT = new Float32Array(N)
  const REVEAL_MS = 1150
  const NBUCKETS = 10
  const PAD = 'arz01<>{}*+=#/.:'
  function scaleForBucket(b: number) {
    return 0.80 + ((b + 0.5) / NBUCKETS) * 0.42
  }
  ;(function build() {
    let i = 0
    for (let r = 0; r < FROWS; r++) {
      const gr = r - ROFF
      const real = (gr >= 0 && gr < ROWS)
      const chars = real ? GRID[gr]![0]! : null
      const tiers = real ? GRID[gr]![1]! : null
      for (let c = 0; c < COLS; c++) {
        if (real && chars && tiers) {
          CHAR[i] = chars.charAt(c)
          TIER[i] = tiers.charCodeAt(c) - 48
        }
        else {
          CHAR[i] = PAD.charAt((Math.random() * PAD.length) | 0)
          const rr = Math.random()
          TIER[i] = rr < 0.72 ? 0 : (rr < 0.9 ? 1 : 2) // faint background static
        }
        RAND[i] = Math.random()
        SPD[i] = 0.5 + Math.random() * 1.5 // [0.5, 2.0]
        SPARK[i] = Math.random()
        SCALE[i] = 0.80 + Math.random() * 0.42 // [0.80, 1.22]
        let b = ((SCALE[i]! - 0.80) / 0.42 * NBUCKETS) | 0
        if (b < 0)
          b = 0
        if (b > NBUCKETS - 1)
          b = NBUCKETS - 1
        BUCKET[i] = b
        REVEALT[i] = ((c / COLS) * 0.62 + RAND[i]! * 0.38) * REVEAL_MS
        i++
      }
    }
  })()

  const SCR = 'raz01</>{}*+=#'.split('')

  /* ---------- colours (read live from Catppuccin tokens) ---------- */
  const COL: number[][] = [[128, 128, 128], [128, 128, 128], [128, 128, 128], [128, 128, 128], [128, 128, 128]] // [r,g,b] per tier
  const COLSTR = ['', '', '', '', '']
  let ACCENT = [203, 166, 247]
  let ACCENT2 = [180, 190, 254]
  let BRIGHT = [198, 208, 245]
  function triplet(name: string): number[] {
    const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
    // Tokens are now SPACE-separated "R G B" (also tolerate legacy commas).
    const p = v.split(/[\s,]+/).filter(Boolean).map(s => Number.parseInt(s, 10))
    return (p.length === 3 && p.every(n => !Number.isNaN(n))) ? p : [128, 128, 128]
  }
  function readColors() {
    COL[0] = triplet('--base')
    COL[1] = triplet('--mantle')
    COL[2] = triplet('--crust')
    COL[3] = triplet('--text')
    COL[4] = triplet('--subtext1')
    ACCENT = triplet('--mauve')
    ACCENT2 = triplet('--lavender')
    BRIGHT = COL[3]
    for (let t = 0; t < 5; t++)
      COLSTR[t] = `rgb(${COL[t]![0]},${COL[t]![1]},${COL[t]![2]})`
  }
  readColors()
  readColorsHook = readColors

  /* ---------- metrics / sizing ---------- */
  let cellW = 8
  let cellH = 13
  let fontSize = 13
  let dpr = 1
  let cssW = 640
  let cssH = 640
  const FONTS: string[] = new Array(NBUCKETS) // one font string per size bucket
  function measure() {
    dpr = Math.min(window.devicePixelRatio || 1, 2)
    cssW = Math.max(160, el.clientWidth || 640)
    fontSize = cssW / (COLS * ADV)
    cellW = fontSize * ADV
    cellH = fontSize * LH
    cssH = Math.round(cellH * FROWS) // ≈ cssW → square field for the circle
    canvas.width = Math.round(cssW * dpr)
    canvas.height = Math.round(cssH * dpr)
    canvas.style.width = `${cssW}px`
    canvas.style.height = `${cssH}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'center'
    for (let b = 0; b < NBUCKETS; b++)
      FONTS[b] = `${WEIGHT} ${(fontSize * scaleForBucket(b)).toFixed(1)}px ${MONO}`
  }

  /* ---------- pointer ---------- */
  let pcol = -999
  let prow = -999
  let pActive = false
  const R = 7
  /* Movement energy replays the reveal when the pointer is wiggled hard.
     Decay + threshold are evaluated INSIDE the listener using real event time,
     so this is independent of frame rate and pointermove coalescing. */
  let moveE = 0
  let lastPX: number | null = null
  let lastPY: number | null = null
  let lastMT = 0
  let revStart = 0
  let lastRetrigger = -99999
  const MOVE_THRESH = 480
  function tryRetrigger(nowT: number) {
    const revealingNow = (nowT - revStart) < (REVEAL_MS + 80)
    if (!revealingNow && moveE > MOVE_THRESH && (nowT - lastRetrigger) > 1600) {
      revStart = nowT
      lastRetrigger = nowT
      moveE = 0
    }
  }

  function onPointerMove(e: PointerEvent) {
    const rect = canvas.getBoundingClientRect()
    pcol = (e.clientX - rect.left) / cellW
    prow = (e.clientY - rect.top) / cellH
    pActive = true
    const nowT = e.timeStamp || performance.now()
    if (lastPX !== null && lastPY !== null) {
      const dx = e.clientX - lastPX
      const dy = e.clientY - lastPY
      const d = Math.sqrt(dx * dx + dy * dy)
      let dt = nowT - lastMT
      if (dt < 1)
        dt = 1
      moveE *= 0.5 ** (dt / 260) // ~260ms half-life, real-time decay
      moveE += Math.min(d, 160) // clamp (don't drop) so fast wiggles count
      tryRetrigger(nowT)
    }
    lastPX = e.clientX
    lastPY = e.clientY
    lastMT = nowT
  }
  function onPointerEnter(e: PointerEvent) {
    lastPX = e.clientX
    lastPY = e.clientY
    lastMT = e.timeStamp || performance.now()
  }
  function onPointerLeave() {
    pActive = false
    lastPX = null
    lastPY = null
  }

  if (!REDUCE) {
    /* attach for any pointer (mouse OR hybrid/touch) - NOT gated on (pointer:fine) */
    canvas.addEventListener('pointermove', onPointerMove)
    canvas.addEventListener('pointerenter', onPointerEnter)
    canvas.addEventListener('pointerleave', onPointerLeave)
  }

  const TAU = Math.PI * 2
  function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t
  }

  /* ---------- draw one animated frame ---------- */
  let rafId: number | null = null
  let running = false // whether the rAF loop is currently scheduled
  let inView = true // logo intersects the viewport
  let pageVisible = true // tab is foregrounded
  let t0 = performance.now()
  revStart = t0 // reveal clock
  function frame(now: number) {
    const t = (now - t0) / 1000 // continuous seconds clock

    const rev = now - revStart // movement-driven replay is handled in the pointermove listener
    const revealing = rev < REVEAL_MS + 80

    ctx.clearRect(0, 0, cssW, cssH)

    const aMix = 0.5 + 0.5 * Math.sin(t * 0.6) // slide accent hue over time (mauve↔lavender)

    /* circular alpha mask geometry (fades the square field into a circle) */
    const cx = cssW / 2
    const cy = cssH / 2
    const radius = Math.min(cssW, cssH) / 2
    const rOut = radius * 0.99
    const rIn = radius * 0.9
    const rSpan = rOut - rIn

    let lastB = -1
    let i = 0
    for (let r = 0; r < FROWS; r++) {
      const yc = r * cellH + cellH / 2 // cell centre Y
      const dY = yc - cy
      for (let c = 0; c < COLS; c++, i++) {
        const xc = c * cellW + cellW / 2 // cell centre X
        const dX = xc - cx
        const dist = Math.sqrt(dX * dX + dY * dY)
        let mask = (rOut - dist) / rSpan
        if (mask > 1)
          mask = 1
        if (mask <= 0)
          continue // outside the circle - skip

        const tier = TIER[i]!
        let ch = CHAR[i]!
        let glow = 0
        let tint = 0
        let ox = 0
        let oy = 0
        let alpha = 1

        /* per-cell random shimmer - a calm field of independent twinkles */
        const s = 0.5 + 0.5 * Math.sin(t * SPD[i]! + RAND[i]! * TAU)
        if (tier >= 3)
          glow += 0.06 + 0.16 * s // bright wordmark cells breathe
        else
          glow += 0.04 * s // faint field cells twinkle

        /* occasional coloured glints on a sparse random subset */
        if (SPARK[i]! > 0.86) {
          let pulse = Math.sin(t * 0.8 + SPARK[i]! * 57.0)
          pulse = pulse > 0 ? pulse * pulse * pulse * pulse : 0 // brief spikes only
          tint += 0.5 * pulse * ((SPARK[i]! - 0.86) / 0.14)
        }

        /* pointer ripple lens */
        if (pActive) {
          const dxp = (c + 0.5) - pcol
          const dyp = (r + 0.5) - prow
          const pd = Math.sqrt(dxp * dxp + dyp * dyp)
          if (pd < R) {
            let infl = 1 - pd / R
            infl *= infl
            glow += infl * 0.85
            tint += infl * 0.8
            const ang = Math.atan2(dyp, dxp)
            const ripple = Math.sin(pd * 0.9 - t * 7) * infl * cellW * 0.55
            ox = Math.cos(ang) * ripple
            oy = Math.sin(ang) * ripple
            if (infl > 0.5)
              ch = SCR[(Math.floor(t * 18) + i * 7) % SCR.length]!
          }
        }

        /* reveal scramble-in (initial + movement-retriggered) */
        if (revealing) {
          const at = REVEALT[i]!
          if (rev < at) {
            ch = SCR[(Math.floor(rev / 45) + i) % SCR.length]!
            alpha = 0.32
          }
          else {
            const pop = 1 - Math.min(1, (rev - at) / 190)
            glow += pop * 0.7
          }
        }

        if (glow > 1)
          glow = 1
        if (tint > 1)
          tint = 1

        /* colour */
        let col
        if (glow < 0.004 && tint < 0.004) {
          col = COLSTR[tier]! // cached - no allocation for idle field
        }
        else {
          const base = COL[tier]!
          let cr = base[0]!
          let cg = base[1]!
          let cb = base[2]!
          if (tint > 0) {
            const ar = lerp(ACCENT[0]!, ACCENT2[0]!, aMix)
            const ag = lerp(ACCENT[1]!, ACCENT2[1]!, aMix)
            const ab = lerp(ACCENT[2]!, ACCENT2[2]!, aMix)
            cr = lerp(cr, ar, tint)
            cg = lerp(cg, ag, tint)
            cb = lerp(cb, ab, tint)
          }
          if (glow > 0) {
            cr = lerp(cr, BRIGHT[0]!, glow)
            cg = lerp(cg, BRIGHT[1]!, glow)
            cb = lerp(cb, BRIGHT[2]!, glow)
          }
          col = `rgb(${cr | 0},${cg | 0},${cb | 0})`
        }

        const fa = alpha * mask // compose reveal fade with circular mask
        if (BUCKET[i] !== lastB) {
          lastB = BUCKET[i]!
          ctx.font = FONTS[lastB]!
        }
        if (fa !== 1)
          ctx.globalAlpha = fa
        ctx.fillStyle = col
        ctx.fillText(ch, xc + ox, yc + oy)
        if (fa !== 1)
          ctx.globalAlpha = 1
      }
    }

    rafId = running ? requestAnimationFrame(frame) : null
  }

  /* ---------- static crisp draw (reduced motion) ---------- */
  function drawStatic() {
    measure()
    ctx.clearRect(0, 0, cssW, cssH)
    const cx = cssW / 2
    const cy = cssH / 2
    const radius = Math.min(cssW, cssH) / 2
    const rOut = radius * 0.99
    const rIn = radius * 0.9
    const rSpan = rOut - rIn
    let lastB = -1
    let i = 0
    for (let r = 0; r < FROWS; r++) {
      const yc = r * cellH + cellH / 2
      const dY = yc - cy
      for (let c = 0; c < COLS; c++, i++) {
        const xc = c * cellW + cellW / 2
        const dX = xc - cx
        const dist = Math.sqrt(dX * dX + dY * dY)
        let mask = (rOut - dist) / rSpan
        if (mask > 1)
          mask = 1
        if (mask <= 0)
          continue
        if (BUCKET[i] !== lastB) {
          lastB = BUCKET[i]!
          ctx.font = FONTS[lastB]!
        }
        if (mask !== 1)
          ctx.globalAlpha = mask
        ctx.fillStyle = COLSTR[TIER[i]!]!
        ctx.fillText(CHAR[i]!, xc, yc)
        if (mask !== 1)
          ctx.globalAlpha = 1
      }
    }
  }
  drawStaticHook = drawStatic

  /* ---------- boot once Victor Mono is ready (accurate metrics) ---------- */
  function start() {
    if (disposed)
      return
    if (REDUCE) {
      drawStatic()
      return
    }
    measure()
    t0 = performance.now()
    revStart = t0
    lastRetrigger = -99999
    if (inView && pageVisible) {
      running = true
      rafId = requestAnimationFrame(frame)
    }
  }

  function boot() {
    if (document.fonts && document.fonts.load) {
      document.fonts.load('600 100px "Victor Mono"')
        .then(() => document.fonts.ready)
        .catch(() => {})
        .then(start, start)
    }
    else {
      start()
    }
  }
  boot()

  /* ---------- pause when off-screen or backgrounded (main-thread budget) ----
     The idle twinkle is a decorative rAF loop; there's no reason to keep it (or
     the GPU) busy while the logo is scrolled away or the tab is hidden. Gate it
     on viewport intersection + document visibility and only run when both hold.
     t0 is left untouched across pauses, so the continuous clock stays correct
     and the field simply resumes where the wall-clock left it. */
  let io2: IntersectionObserver | null = null
  function pause() {
    running = false
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }
  }
  function resume() {
    if (REDUCE || disposed || running || !inView || !pageVisible)
      return
    running = true
    rafId = requestAnimationFrame(frame)
  }
  function onVisibility() {
    pageVisible = !document.hidden
    if (pageVisible)
      resume()
    else
      pause()
  }
  if (!REDUCE) {
    if ('IntersectionObserver' in window) {
      io2 = new IntersectionObserver((entries) => {
        inView = entries[0]?.isIntersecting ?? true
        if (inView)
          resume()
        else
          pause()
      }, { rootMargin: '120px 0px 120px 0px' })
      io2.observe(el)
    }
    document.addEventListener('visibilitychange', onVisibility)
  }

  /* ---------- resize (debounced) ---------- */
  let rt: ReturnType<typeof setTimeout> | null = null
  function onResize() {
    if (rt)
      clearTimeout(rt)
    rt = setTimeout(() => {
      if (REDUCE) {
        drawStatic()
        return
      }
      measure()
    }, 150)
  }
  window.addEventListener('resize', onResize, { passive: true })

  /* ---------- teardown ---------- */
  cleanup = () => {
    disposed = true
    running = false
    if (rafId !== null)
      cancelAnimationFrame(rafId)
    if (rt)
      clearTimeout(rt)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerenter', onPointerEnter)
    canvas.removeEventListener('pointerleave', onPointerLeave)
    window.removeEventListener('resize', onResize)
    io2?.disconnect()
    document.removeEventListener('visibilitychange', onVisibility)
    readColorsHook = null
    drawStaticHook = null
  }
})

// Live re-tint via Vue reactivity (replaces the mockup's window 'flavorchange').
watch(flavor, () => {
  nextTick(() => {
    readColorsHook?.()
    if (reduce)
      drawStaticHook?.()
  })
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<template>
  <div
    ref="host"
    class="ascii"
    role="img"
    aria-label="raz.wtf, animated ASCII wordmark"
  />
</template>

<style scoped>
.ascii {
  position: relative;
  width: 100%;
  max-width: 560px;
  aspect-ratio: 1 / 1;
  margin: clamp(1.1rem, 3vw, 2rem) auto clamp(1.4rem, 3vw, 2.1rem);
  border-radius: 50%;
  overflow: hidden;
  isolation: isolate;
}

.ascii :deep(canvas) {
  display: block;
  width: 100%;
  height: auto;
}

/* crisp ring around the circular field */
.ascii::before {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 2;
  box-shadow:
    inset 0 0 0 1px rgb(var(--surface2) / 0.6),
    0 0 0 1px rgb(var(--surface1) / 0.35);
}

/* circular vignette so the faint field melts into crust at the edge */
.ascii::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: 50%;
  pointer-events: none;
  z-index: 1;
  background: radial-gradient(
    circle at 50% 50%,
    transparent 62%,
    rgb(var(--crust) / 0.55) 86%,
    rgb(var(--crust)) 100%
  );
}
</style>
