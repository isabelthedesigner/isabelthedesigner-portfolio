import { useEffect, useMemo, useRef, useState } from 'react'
import { DitherReveal } from '@/components/spline/DitherReveal'
import { markRevealed } from '@/lib/revealMemory'
import { BOOT_BLOCKS, WORDMARK, pickBlockIndex, type BootBlock, type BootLine } from './bootBlocks'
import './BootSequence.css'

interface BootSequenceProps {
  /** true once Spline onLoad fires or the parent safety timeout elapses */
  splineLoaded: boolean
  /** parent unmounts the boot; wired to DitherReveal's onComplete */
  onComplete: () => void
  className?: string
}

const BAR_CELLS = 10

function cx(...parts: Array<string | false | undefined | null>): string {
  return parts.filter(Boolean).join(' ')
}

// Resolve a CSS custom property to a hex string at runtime (SSR-safe).
function readCssHex(varName: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
  return v.startsWith('#') ? v : fallback
}

function isProgress(line: BootLine): line is { label: string; progress: true } {
  return 'progress' in line && line.progress === true
}

function renderBar(progress: number): string {
  const clamped = Math.max(0, Math.min(1, progress))
  const filled = Math.round(clamped * BAR_CELLS)
  return `[${'▓'.repeat(filled)}${'░'.repeat(BAR_CELLS - filled)}]`
}

export default function BootSequence({ splineLoaded, onComplete, className }: BootSequenceProps) {
  // Lock the chosen block once; never reshuffle on re-render.
  const blockRef = useRef<BootBlock | null>(null)
  if (blockRef.current === null) {
    blockRef.current = BOOT_BLOCKS[pickBlockIndex()]
  }
  const block = blockRef.current

  const PERIWINKLE = useMemo(() => readCssHex('--color-electric-periwinkle', '#4600ec'), [])

  // Leader-dot target width: align all `ok` against the longest non-progress label.
  const dotsTarget = useMemo(() => {
    const lengths = block.lines.filter((l) => !isProgress(l)).map((l) => l.label.length)
    return Math.max(0, ...lengths) + 4
  }, [block])

  const formatDoneLine = useMemo(
    () => (label: string) => `> ${label} ${'·'.repeat(Math.max(1, dotsTarget - label.length))} ok`,
    [dotsTarget],
  )

  const closeBody = block.close.endsWith('_') ? block.close.slice(0, -1) : block.close
  const closeHasCursor = block.close.endsWith('_')

  const [showWordmark, setShowWordmark] = useState(false)
  const [showSubtitle, setShowSubtitle] = useState(false)
  const [rendered, setRendered] = useState<string[]>(() => block.lines.map(() => ''))
  const [closeText, setCloseText] = useState('')
  const [closeDone, setCloseDone] = useState(false)
  const [flash, setFlash] = useState(true)
  const [skipFlash, setSkipFlash] = useState(false)
  const [flashKey, setFlashKey] = useState(0)
  const [exiting, setExiting] = useState(false)

  const aliveRef = useRef(true)
  const skipRef = useRef(false)
  const exitingRef = useRef(false)
  const splineLoadedRef = useRef(splineLoaded)
  const rafRef = useRef(0)
  const sleepsRef = useRef<Set<() => void>>(new Set())

  useEffect(() => {
    splineLoadedRef.current = splineLoaded
  }, [splineLoaded])

  const setLine = (i: number, value: string) =>
    setRendered((prev) => {
      const next = [...prev]
      next[i] = value
      return next
    })

  useEffect(() => {
    markRevealed('boot')
    aliveRef.current = true

    const stop = () => skipRef.current || !aliveRef.current

    const sleep = (ms: number) =>
      new Promise<void>((resolve) => {
        const done = () => {
          clearTimeout(id)
          sleepsRef.current.delete(done)
          resolve()
        }
        const id = window.setTimeout(done, ms)
        sleepsRef.current.add(done)
      })

    const typeText = async (
      apply: (s: string) => void,
      prefix: string,
      text: string,
      perChar: number,
    ) => {
      for (let i = 1; i <= text.length; i++) {
        if (stop()) {
          apply(prefix + text)
          return
        }
        apply(prefix + text.slice(0, i))
        await sleep(perChar)
      }
    }

    const runBar = (apply: (p: number) => void) =>
      new Promise<void>((resolve) => {
        if (skipRef.current) {
          apply(1)
          resolve()
          return
        }
        const alreadyLoaded = splineLoadedRef.current
        const cap = alreadyLoaded ? 1 : 0.9
        const fillDur = alreadyLoaded ? 1600 : 1500
        const start = performance.now()
        let phase: 'fill' | 'hold' | 'finish' = 'fill'
        let finishStart = 0

        const tick = (now: number) => {
          if (!aliveRef.current) {
            resolve()
            return
          }
          if (skipRef.current) {
            apply(1)
            resolve()
            return
          }
          if (phase === 'fill') {
            const raw = Math.min((now - start) / fillDur, 1)
            const eased = 1 - Math.pow(1 - raw, 3)
            apply(eased * cap)
            if (raw >= 1) {
              if (alreadyLoaded) {
                resolve()
                return
              }
              phase = 'hold'
            }
          } else if (phase === 'hold') {
            apply(cap)
            if (splineLoadedRef.current) {
              phase = 'finish'
              finishStart = now
            }
          } else {
            const raw = Math.min((now - finishStart) / 250, 1)
            apply(cap + raw * (1 - cap))
            if (raw >= 1) {
              resolve()
              return
            }
          }
          rafRef.current = requestAnimationFrame(tick)
        }
        rafRef.current = requestAnimationFrame(tick)
      })

    const run = async () => {
      await sleep(380)
      if (stop()) return
      setFlash(false)

      setShowWordmark(true)
      await sleep(180)
      if (stop()) return
      setShowSubtitle(true)
      await sleep(260)
      if (stop()) return

      for (let i = 0; i < block.lines.length; i++) {
        const line = block.lines[i]
        if (isProgress(line)) {
          await typeText((s) => setLine(i, s), '> ', line.label, 14)
          if (stop()) return
          const base = `> ${line.label} ... `
          setLine(i, base + renderBar(0))
          await runBar((p) => setLine(i, base + renderBar(p)))
          if (stop()) return
          setLine(i, base + renderBar(1) + ' ok')
        } else {
          await typeText((s) => setLine(i, s), '> ', line.label, 14)
          if (stop()) return
          setLine(i, formatDoneLine(line.label))
        }
        await sleep(90)
        if (stop()) return
      }

      await typeText(setCloseText, '', closeBody, 14)
      if (stop()) return
      setCloseDone(true)

      await sleep(650)
      if (stop()) return

      exitingRef.current = true
      setExiting(true)
    }

    run()

    return () => {
      aliveRef.current = false
      cancelAnimationFrame(rafRef.current)
      sleepsRef.current.forEach((fn) => fn())
      sleepsRef.current.clear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const skip = () => {
    if (skipRef.current || exitingRef.current) return
    skipRef.current = true
    // Resolve any in-flight sleeps so the running sequence bails immediately.
    sleepsRef.current.forEach((fn) => fn())
    sleepsRef.current.clear()
    cancelAnimationFrame(rafRef.current)

    setShowWordmark(true)
    setShowSubtitle(true)
    setRendered(
      block.lines.map((line) =>
        isProgress(line)
          ? `> ${line.label} ... ${renderBar(1)} ok`
          : formatDoneLine(line.label),
      ),
    )
    setCloseText(closeBody)
    setCloseDone(true)

    setSkipFlash(true)
    setFlashKey((k) => k + 1)
    setFlash(true)

    window.setTimeout(() => {
      if (!aliveRef.current) return
      setFlash(false)
      exitingRef.current = true
      setExiting(true)
    }, 150)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') skip()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Lock page scroll while the boot overlay is present; restore after it unmounts.
  useEffect(() => {
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.documentElement.style.overflow = prev
    }
  }, [])

  const ZWSP = '\u200b'

  return (
    <div
      className={cx('fixed inset-0 z-[60]', className)}
      aria-hidden="true"
      onClick={skip}
    >
      <DitherReveal
        trigger={exiting}
        overlayColor={PERIWINKLE}
        onComplete={onComplete}
        className="h-full w-full"
      >
        {/* Solid field behind the dither canvas: guarantees the periwinkle is opaque from
            the first frame (the canvas draws one frame later). Cleared once the dissolve
            starts so the reveal shows the Spline behind the overlay, not this backdrop. */}
        <div
          className="h-full w-full"
          style={{ backgroundColor: exiting ? undefined : PERIWINKLE }}
        />
      </DitherReveal>

      <div
        className={cx(
          'boot-chrome absolute inset-0 z-[2] flex items-start px-120 py-96 text-body-default-mono text-content-default-inverse',
          exiting && 'boot-chrome--exit',
        )}
      >
        <div className="boot-scanlines" />

        <div className="relative z-10 w-full whitespace-pre-wrap [word-break:break-word]">
          <p>{showWordmark ? WORDMARK : ZWSP}</p>
          <p>{showSubtitle ? block.subtitle : ZWSP}</p>
          <p>{ZWSP}</p>
          {rendered.map((line, i) => (
            <p key={i}>{line || ZWSP}</p>
          ))}
          <p>{ZWSP}</p>
          <p>
            {closeText}
            {closeDone && closeHasCursor && <span className="boot-cursor">_</span>}
          </p>
        </div>

        {flash && (
          <div key={flashKey} className={cx('boot-flash z-20', skipFlash && 'boot-flash--skip')} />
        )}
      </div>
    </div>
  )
}
