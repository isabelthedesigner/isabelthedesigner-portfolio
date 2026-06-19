'use client'

import { useEffect, useRef, useCallback, useMemo } from 'react'

const BAYER_8x8 = [
  [ 0, 32,  8, 40,  2, 34, 10, 42],
  [48, 16, 56, 24, 50, 18, 58, 26],
  [12, 44,  4, 36, 14, 46,  6, 38],
  [60, 28, 52, 20, 62, 30, 54, 22],
  [ 3, 35, 11, 43,  1, 33,  9, 41],
  [51, 19, 59, 27, 49, 17, 57, 25],
  [15, 47,  7, 39, 13, 45,  5, 37],
  [63, 31, 55, 23, 61, 29, 53, 21],
].map(row => row.map(v => v / 63))

function hexToRgb(hex: string): [number, number, number] {
  const c = hex.replace('#', '')
  return [
    parseInt(c.slice(0, 2), 16),
    parseInt(c.slice(2, 4), 16),
    parseInt(c.slice(4, 6), 16),
  ]
}

function resolveBgDefault(): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--color-bg-default')
    .trim()
}

interface DitherRevealProps {
  children: React.ReactNode
  pixelSize?: number
  duration?: number
  delay?: number
  overlayColor?: string
  radialWeight?: number
  /**
   * Controls when the reveal animation starts.
   * - `undefined`: starts automatically after `delay` ms
   * - `false`: stays fully covered
   * - `true`: starts the reveal
   */
  trigger?: boolean
  onComplete?: () => void
  className?: string
  /** When true, renders children fully revealed with no overlay or animation */
  skip?: boolean
}

export function DitherReveal({
  children,
  pixelSize = 2,
  duration = 3000,
  delay = 0,
  overlayColor,
  radialWeight = 0.65,
  trigger,
  onComplete,
  className,
  skip = false,
}: DitherRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef    = useRef<HTMLCanvasElement>(null)
  const rafRef       = useRef<number>(0)
  const startRef     = useRef<number | null>(null)
  const hasStarted   = useRef(false)

  const resolvedColor = useMemo(() => overlayColor ?? resolveBgDefault(), [overlayColor])
  const rgb = useMemo(() => hexToRgb(resolvedColor), [resolvedColor])

  const drawFrame = useCallback((progress: number) => {
    const canvas    = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const w = container.offsetWidth
    const h = container.offsetHeight
    canvas.width  = w
    canvas.height = h

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cols        = Math.ceil(w / pixelSize)
    const rows        = Math.ceil(h / pixelSize)
    const cx          = cols / 2
    const cy          = rows / 2
    const maxDist     = Math.sqrt(cx * cx + cy * cy)
    const bayerWeight = 1 - radialWeight

    ctx.clearRect(0, 0, w, h)

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const dx        = col - cx
        const dy        = row - cy
        const dist      = Math.sqrt(dx * dx + dy * dy) / maxDist
        const bayerVal  = BAYER_8x8[row % 8][col % 8]
        const threshold = dist * radialWeight + bayerVal * bayerWeight

        if (progress < threshold) {
          ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
          ctx.fillRect(
            col * pixelSize, row * pixelSize,
            pixelSize, pixelSize,
          )
        }
      }
    }
  }, [pixelSize, radialWeight, rgb])

  const startAnim = useCallback(() => {
    if (hasStarted.current) return
    hasStarted.current = true
    startRef.current = null
    const canvas = canvasRef.current
    if (canvas) canvas.style.display = 'block'

    const animate = (ts: number) => {
      if (!startRef.current) startRef.current = ts
      const raw   = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - raw, 3)

      drawFrame(eased)

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(animate)
      } else {
        if (canvas) canvas.style.display = 'none'
        onComplete?.()
      }
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [duration, drawFrame, onComplete])

  // Draw the fully-covered initial frame
  useEffect(() => {
    if (skip) return
    drawFrame(0)
  }, [drawFrame, skip])

  // Uncontrolled mode: start after delay
  useEffect(() => {
    if (skip || trigger !== undefined) return

    const t = setTimeout(startAnim, delay)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(rafRef.current)
    }
  }, [trigger, delay, startAnim, skip])

  // Controlled mode: start when trigger flips to true
  useEffect(() => {
    if (skip || trigger !== true) return

    const t = setTimeout(startAnim, delay)
    return () => {
      clearTimeout(t)
      cancelAnimationFrame(rafRef.current)
    }
  }, [trigger, delay, startAnim, skip])

  return (
    <div ref={containerRef} className={className} style={{ position: 'relative' }}>
      {children}
      {!skip && (
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none',
            imageRendering: 'pixelated',
          }}
        />
      )}
    </div>
  )
}
