/**
 * Media optimization pipeline.
 *
 * Reads originals from `media-raw/` and writes optimized, web-ready assets into
 * `public/` (same relative paths). Idempotent: re-running regenerates outputs
 * from the pristine originals, so quality never degrades across runs.
 *
 *   - Images -> resized AVIF + WebP + a compressed same-format fallback
 *   - Videos -> re-encoded MP4 (H.264, faststart, yuv420p for iOS) + WebM + WebP poster
 *   - GIF    -> downscaled, transparent animated WebP (preserves alpha so it
 *               blends into the page; far smaller than the source GIF)
 *
 * Usage:
 *   node scripts/optimize-media.js            # everything
 *   node scripts/optimize-media.js images     # images only
 *   node scripts/optimize-media.js videos     # videos only
 *   node scripts/optimize-media.js gif        # animated gif -> webp only
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import sharp from 'sharp'

const RAW = 'media-raw'
const OUT = 'public'

// ── Asset config ──────────────────────────────────────────────────────────
// maxWidth caps the longest output edge; images are never enlarged.

const IMAGE_JOBS = [
  { src: 'images/spline-portfolio-header.png', maxWidth: 1600 },
  { src: 'images/spline-design-system.png', maxWidth: 1440 },
  { src: 'images/spline-type-design.png', maxWidth: 1248 },
  { src: 'images/logo-i-color.png', maxWidth: 256 },
  { src: 'images/info/isabel-portrait.png', maxWidth: 1000 },
  { src: 'images/info/fun-fact-1.png', maxWidth: 1100 },
  { src: 'images/info/fun-fact-2.png', maxWidth: 1100 },
  { src: 'images/info/fun-fact-3.png', maxWidth: 1100 },
  { src: 'images/op-ed/op-ed_case-study-1.png', maxWidth: 1280 },
  { src: 'images/op-ed/op-ed_case-study-2.png', maxWidth: 1280 },
  { src: 'images/op-ed/op-ed_case-study-3.png', maxWidth: 1280 },
  // Ad-creator images live inside a zoom/pan canvas (up to 3x), so keep more detail.
  ...Array.from({ length: 8 }, (_, i) => ({
    src: `images/op-ed/ad-creator-${i + 1}.png`,
    maxWidth: 1024,
  })),
]

// Favicon just needs to be small and square.
const FAVICON = { src: 'favicon-i.png', size: 256 }

// Large hero/demo videos keep full resolution and a low CRF for crisp detail;
// small UI clips downscale aggressively. crf defaults to 26 (see encodeVideo).
const VIDEO_JOBS = [
  { src: 'images/phonofile/phonofile_onboarding.mp4', maxWidth: 1920, crf: 21 },
  { src: 'images/phonofile/phonofile_theme-switcher-bg.mp4', maxWidth: 1920, crf: 21 },
  { src: 'images/phonofile/phonofile_views.mp4', maxWidth: 1920, crf: 21 },
  { src: 'images/leaf-motion/chc-2.0_conversation-module.mp4', maxWidth: 1920, crf: 21 },
  { src: 'images/leaf-motion/chc-2.0_app-intro.mp4', maxWidth: 1920, crf: 21 },
  { src: 'images/leaf-motion/leaf-accordion.mp4', maxWidth: 1040 },
  { src: 'images/leaf-motion/leaf-button.mp4', maxWidth: 1040 },
  { src: 'images/leaf-motion/leaf-checkbox.mp4', maxWidth: 1040 },
  { src: 'images/leaf-motion/leaf-modal.mp4', maxWidth: 1040 },
  { src: 'images/leaf-motion/emergence-over-entrance.mp4', maxWidth: 480 },
  { src: 'images/leaf-motion/rooted-movement.mp4', maxWidth: 480 },
  { src: 'images/leaf-motion/layered-unfurling.mp4', maxWidth: 480 },
  { src: 'images/leaf-motion/breathing-rhythm.mp4', maxWidth: 480 },
  { src: 'images/leaf-motion/gentle-settling.mp4', maxWidth: 480 },
]

// Animated GIF -> transparent animated WebP. We keep the alpha channel so the
// animation blends seamlessly into the page (a flattened/opaque video always
// leaves a faint colour-managed rectangle). maxWidth + fps + quality trade size
// against fidelity; this clip is decorative and lazy-loaded below the fold.
const GIF_JOBS = [
  { src: 'images/home-animation-3-d.gif', maxWidth: 512, fps: 20, quality: 70 },
]

// ── Helpers ────────────────────────────────────────────────────────────────

let totalBefore = 0
let totalAfter = 0

function fmtBytes(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)}MB`
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${bytes}B`
}

function sizeOf(file) {
  try {
    return fs.statSync(file).size
  } catch {
    return 0
  }
}

function ensureDir(file) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
}

function stripExt(p) {
  return p.slice(0, p.length - path.extname(p).length)
}

function reportPair(label, before, outputs) {
  const after = outputs.reduce((sum, f) => sum + sizeOf(f), 0)
  totalBefore += before
  totalAfter += after
  const pct = before > 0 ? Math.round((1 - after / before) * 100) : 0
  console.log(
    `  ${label.padEnd(46)} ${fmtBytes(before).padStart(7)} -> ${fmtBytes(after).padStart(7)}  (-${pct}%)`,
  )
}

function ffmpeg(args) {
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], {
    stdio: ['ignore', 'ignore', 'inherit'],
  })
}

function ffmpegToBuffer(args) {
  return execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], {
    stdio: ['ignore', 'pipe', 'inherit'],
    maxBuffer: 1024 * 1024 * 64,
  })
}

function assertFfmpeg() {
  try {
    execFileSync('ffmpeg', ['-version'], { stdio: 'ignore' })
  } catch {
    console.error('ffmpeg not found. Install it (e.g. `brew install ffmpeg`) and re-run.')
    process.exit(1)
  }
}

// Scale filter: cap width, keep aspect, force even dimensions. Comma escaped for ffmpeg.
const scaleFilter = (maxWidth) => `scale=min(${maxWidth}\\,iw):-2:flags=lanczos`

// ── Image processing ─────────────────────────────────────────────────────────

async function processImage(job) {
  const inPath = path.join(RAW, job.src)
  if (!fs.existsSync(inPath)) {
    console.warn(`  ! missing original: ${inPath}`)
    return
  }
  const fallbackOut = path.join(OUT, job.src)
  const base = stripExt(fallbackOut)
  ensureDir(fallbackOut)

  const resize = { width: job.maxWidth, withoutEnlargement: true }
  const meta = await sharp(inPath, { limitInputPixels: false }).metadata()

  // PNG fallback for browsers without AVIF/WebP (kept as .png so existing code
  // paths stay valid). Palette quantization wins big on flat 3D renders but
  // bloats photographic images, so encode both ways and keep the smaller. If
  // the original doesn't need resizing and is already smaller (often the case
  // for hand-optimized PNGs), just reuse it.
  const candidates = await Promise.all([
    sharp(inPath, { limitInputPixels: false })
      .resize(resize)
      .png({ quality: 82, effort: 9, palette: true })
      .toBuffer(),
    sharp(inPath, { limitInputPixels: false })
      .resize(resize)
      .png({ compressionLevel: 9, effort: 10, palette: false })
      .toBuffer(),
  ])
  if (meta.width <= job.maxWidth) candidates.push(fs.readFileSync(inPath))
  const best = candidates.reduce((a, b) => (b.length < a.length ? b : a))
  fs.writeFileSync(fallbackOut, best)

  await sharp(inPath, { limitInputPixels: false })
    .resize(resize)
    .webp({ quality: 78, effort: 6 })
    .toFile(`${base}.webp`)

  await sharp(inPath, { limitInputPixels: false })
    .resize(resize)
    .avif({ quality: 55, effort: 4 })
    .toFile(`${base}.avif`)

  reportPair(job.src, sizeOf(inPath), [fallbackOut, `${base}.webp`, `${base}.avif`])
}

async function processFavicon() {
  const inPath = path.join(RAW, FAVICON.src)
  if (!fs.existsSync(inPath)) return
  const out = path.join(OUT, FAVICON.src)
  ensureDir(out)
  await sharp(inPath)
    .resize({ width: FAVICON.size, height: FAVICON.size, fit: 'cover' })
    .png({ quality: 82, effort: 9, palette: true })
    .toFile(out)
  reportPair(FAVICON.src, sizeOf(inPath), [out])
}

// ── Video processing ─────────────────────────────────────────────────────────

async function encodeVideo(inPath, base, { maxWidth, crf = 26 } = {}) {
  const filter = ['-vf', `${scaleFilter(maxWidth)},format=yuv420p`]

  // MP4 (H.264) — universal, including iOS. faststart moves the moov atom to the
  // front so playback can begin before the full file downloads. Audio dropped
  // since every video plays muted.
  ffmpeg([
    '-i', inPath,
    ...filter,
    '-an',
    '-c:v', 'libx264',
    '-profile:v', 'high',
    '-pix_fmt', 'yuv420p',
    '-preset', 'slow',
    '-crf', String(crf),
    '-movflags', '+faststart',
    `${base}.mp4`,
  ])

  // WebM (VP9) — smaller for Chrome/Android; browsers fall back to MP4 otherwise.
  ffmpeg([
    '-i', inPath,
    ...filter,
    '-an',
    '-c:v', 'libvpx-vp9',
    '-pix_fmt', 'yuv420p',
    '-b:v', '0',
    '-crf', String(crf + 8),
    '-row-mt', '1',
    '-deadline', 'good',
    '-cpu-used', '4',
    `${base}.webm`,
  ])

  // Poster (first frame) so something shows before the video loads/plays.
  // This ffmpeg build lacks libwebp, so extract a PNG frame and let sharp
  // encode the WebP.
  const frame = ffmpegToBuffer([
    '-ss', '0',
    '-i', inPath,
    ...filter,
    '-frames:v', '1',
    '-c:v', 'png',
    '-f', 'image2pipe',
    'pipe:1',
  ])
  await sharp(frame).webp({ quality: 65, effort: 6 }).toFile(`${base}-poster.webp`)
}

async function processVideo(job) {
  const inPath = path.join(RAW, job.src)
  if (!fs.existsSync(inPath)) {
    console.warn(`  ! missing original: ${inPath}`)
    return
  }
  const base = stripExt(path.join(OUT, job.src))
  ensureDir(`${base}.mp4`)
  await encodeVideo(inPath, base, { maxWidth: job.maxWidth, crf: job.crf })
  reportPair(job.src, sizeOf(inPath), [`${base}.mp4`, `${base}.webm`, `${base}-poster.webp`])
}

// ── Animated GIF -> transparent WebP ──────────────────────────────────────────

function assertImg2webp() {
  try {
    execFileSync('img2webp', ['-version'], { stdio: 'ignore' })
  } catch {
    console.error('img2webp not found. Install it (e.g. `brew install webp`) and re-run.')
    process.exit(1)
  }
}

function processGif(job) {
  const inPath = path.join(RAW, job.src)
  if (!fs.existsSync(inPath)) {
    console.warn(`  ! missing original: ${inPath}`)
    return
  }
  const out = `${stripExt(path.join(OUT, job.src))}.webp`
  ensureDir(out)

  const { maxWidth, fps = 20, quality = 70 } = job
  // Preserve the alpha channel end-to-end so the animation blends into the page.
  // ffmpeg's GIF intermediate flattens transparency, so instead extract PNG
  // frames (which keep alpha), then assemble a lossy animated WebP via img2webp.
  // With transparency, the empty background costs almost nothing, so the file is
  // tiny despite full frame rate.
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'optmedia-'))
  try {
    ffmpeg([
      '-i', inPath,
      '-vf', `fps=${fps},scale=min(${maxWidth}\\,iw):-1:flags=lanczos`,
      path.join(tmpDir, 'f_%04d.png'),
    ])
    const frames = fs
      .readdirSync(tmpDir)
      .filter((f) => f.endsWith('.png'))
      .sort()
      .map((f) => path.join(tmpDir, f))
    execFileSync(
      'img2webp',
      ['-loop', '0', '-lossy', '-q', String(quality), '-m', '6', '-d', String(Math.round(1000 / fps)), ...frames, '-o', out],
      { stdio: ['ignore', 'ignore', 'inherit'] },
    )
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true })
  }

  reportPair(job.src, sizeOf(inPath), [out])
}

// ── Run ──────────────────────────────────────────────────────────────────────

async function run() {
  const arg = process.argv[2]
  const doImages = !arg || arg === 'images'
  const doVideos = !arg || arg === 'videos'
  const doGif = !arg || arg === 'videos' || arg === 'gif'

  if (doImages) {
    console.log('\nImages:')
    for (const job of IMAGE_JOBS) await processImage(job)
    await processFavicon()
  }

  if (doVideos) {
    assertFfmpeg()
    console.log('\nVideos:')
    for (const job of VIDEO_JOBS) await processVideo(job)
  }

  if (doGif) {
    assertFfmpeg()
    assertImg2webp()
    console.log('\nGIF -> animated WebP:')
    for (const job of GIF_JOBS) processGif(job)
  }

  console.log(
    `\nTotal: ${fmtBytes(totalBefore)} -> ${fmtBytes(totalAfter)} ` +
      `(saved ${fmtBytes(totalBefore - totalAfter)})`,
  )
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
