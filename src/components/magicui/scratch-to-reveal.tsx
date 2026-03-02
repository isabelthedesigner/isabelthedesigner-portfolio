import { motion, useAnimation } from 'motion/react'
import { useEffect, useRef, useState, type ReactNode, type FC } from 'react'

interface ScratchToRevealProps {
  children: ReactNode
  width: number
  height: number
  minScratchPercentage?: number
  className?: string
  onComplete?: () => void
  gradientColors?: [string, string, string]
}

export const ScratchToReveal: FC<ScratchToRevealProps> = ({
  width,
  height,
  minScratchPercentage = 50,
  onComplete,
  children,
  className,
  gradientColors = ['#A97CF8', '#F38CB8', '#FDCC92'],
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScratching, setIsScratching] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const controls = useAnimation()

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (canvas && ctx) {
      ctx.fillStyle = '#ccc'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, gradientColors[0])
      gradient.addColorStop(0.5, gradientColors[1])
      gradient.addColorStop(1, gradientColors[2])
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [gradientColors])

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
      ctx.beginPath()
      ctx.arc(x, y, 30, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  const startAnimation = async () => {
    await controls.start({
      scale: [1, 1.5, 1],
      rotate: [0, 10, -10, 10, -10, 0],
      transition: { duration: 0.5 },
    })
    onComplete?.()
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
        startAnimation()
      }
    }
  }

  return (
    <div
      className={`relative select-none overflow-hidden ${className ?? ''}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <motion.div animate={controls} className="relative h-full w-full">
        <canvas
          ref={canvasRef}
          width={width}
          height={height}
          className="absolute inset-0 z-10 h-full w-full cursor-grab active:cursor-grabbing"
          onMouseDown={() => setIsScratching(true)}
          onTouchStart={() => setIsScratching(true)}
        />
        <div className="flex h-full w-full items-center justify-center">{children}</div>
      </motion.div>
    </div>
  )
}
