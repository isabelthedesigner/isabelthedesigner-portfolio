import { useEffect, useRef, useState, type ReactNode, type FC } from 'react'

interface ScratchToRevealProps {
  children: ReactNode
  width?: number
  height?: number
  fluidHeight?: boolean
  minScratchPercentage?: number
  className?: string
  onComplete?: () => void
  gradientColors?: [string, string, string]
}

const DEFAULT_WIDTH = 400
const DEFAULT_HEIGHT = 320

export const ScratchToReveal: FC<ScratchToRevealProps> = ({
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  fluidHeight = false,
  minScratchPercentage = 50,
  onComplete,
  children,
  className,
  gradientColors = ['#A97CF8', '#F38CB8', '#FDCC92'],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const lastPointRef = useRef<{ x: number; y: number } | null>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [fluidSize, setFluidSize] = useState({ width: 0, height: 0 })

  const canvasWidth = fluidHeight ? fluidSize.width : width
  const canvasHeight = fluidHeight ? fluidSize.height : height

  useEffect(() => {
    if (!fluidHeight || !containerRef.current) return
    const el = containerRef.current
    const observer = new ResizeObserver((entries) => {
      const entry = entries[0]
      if (!entry) return
      const { width: w, height: h } = entry.contentRect
      setFluidSize({ width: Math.floor(w), height: Math.floor(h) })
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [fluidHeight])

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx && canvasWidth > 0 && canvasHeight > 0) {
      ctx.fillStyle = '#ccc'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, gradientColors[0])
      gradient.addColorStop(0.5, gradientColors[1])
      gradient.addColorStop(1, gradientColors[2])
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [gradientColors, canvasWidth, canvasHeight])

  useEffect(() => {
    const handleMove = (clientX: number, clientY: number) => {
      if (!isScratching) return
      scratch(clientX, clientY)
    }

    const handleDocumentMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY)
    const handleDocumentTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }
    const handleEnd = () => {
      setIsScratching(false)
      lastPointRef.current = null
      checkCompletion()
    }

    document.addEventListener('mousedown', handleDocumentMouseMove)
    document.addEventListener('mousemove', handleDocumentMouseMove)
    document.addEventListener('touchstart', handleDocumentTouchMove)
    document.addEventListener('touchmove', handleDocumentTouchMove)
    document.addEventListener('mouseup', handleEnd)
    document.addEventListener('touchend', handleEnd)
    document.addEventListener('touchcancel', handleEnd)

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseMove)
      document.removeEventListener('mousemove', handleDocumentMouseMove)
      document.removeEventListener('touchstart', handleDocumentTouchMove)
      document.removeEventListener('touchmove', handleDocumentTouchMove)
      document.removeEventListener('mouseup', handleEnd)
      document.removeEventListener('touchend', handleEnd)
      document.removeEventListener('touchcancel', handleEnd)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScratching])

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      const rect = canvas.getBoundingClientRect()
      const x = clientX - rect.left + 16
      const y = clientY - rect.top + 16
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = 40
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      ctx.strokeStyle = 'rgba(0,0,0,1)'
      ctx.beginPath()
      if (lastPointRef.current) {
        ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y)
      } else {
        ctx.moveTo(x, y)
      }
      ctx.lineTo(x, y)
      ctx.stroke()
      lastPointRef.current = { x, y }
    }
  }

  const checkCompletion = () => {
    if (isComplete) return

    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const pixels = imageData.data
      const totalPixels = pixels.length / 4
      let clearPixels = 0

      for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) clearPixels++
      }

      const percentage = (clearPixels / totalPixels) * 100

      if (percentage >= minScratchPercentage) {
        setIsComplete(true)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        onComplete?.()
      }
    }
  }

  return (
    <div
      ref={containerRef}
      className={`relative select-none overflow-hidden ${className ?? ''}`}
      style={fluidHeight ? undefined : { aspectRatio: `${width} / ${height}` }}
    >
      <div className="relative h-full w-full">
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          className="absolute inset-0 z-10 h-full w-full"
          style={{ cursor: "url('/images/penny-cursor.png') 32 32, grab" }}
          onMouseDown={() => setIsScratching(true)}
          onTouchStart={() => setIsScratching(true)}
        />
        <div className="flex h-full w-full items-center justify-center">{children}</div>
      </div>
    </div>
  )
}
