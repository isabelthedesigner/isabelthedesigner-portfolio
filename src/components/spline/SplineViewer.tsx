import { lazy, Suspense, useRef, useState, useEffect } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineViewerProps {
  /** Spline scene URL for the 3D embed */
  sceneUrl: string
  /** Path to the fallback PNG image shown on mobile */
  fallbackImage: string
  /** Alt text for the fallback image */
  alt: string
  className?: string
  /** Plays a bottom-right clip-path reveal when the element enters the viewport */
  maskReveal?: boolean
  /** When provided, controls the mask reveal externally (skips internal IntersectionObserver) */
  triggerInView?: boolean
}

/**
 * Renders a Spline 3D scene on md+ screens and a static PNG on mobile.
 * The Spline runtime is lazy-loaded to avoid impacting initial bundle size.
 */
export default function SplineViewer({
  sceneUrl,
  fallbackImage,
  alt,
  className = '',
  maskReveal = false,
  triggerInView,
}: SplineViewerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [internalInView, setInternalInView] = useState(false)

  const isControlled = triggerInView !== undefined
  const inView = isControlled ? triggerInView : internalInView

  useEffect(() => {
    if (isControlled || !maskReveal || !wrapperRef.current) return

    const el = wrapperRef.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInternalInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [isControlled, maskReveal, isDesktop])

  const hiddenStyle = maskReveal && !inView
    ? { clipPath: 'inset(100% 0 0 100%)' } as const
    : undefined

  if (!isDesktop) {
    return (
      <div
        ref={wrapperRef}
        className={`${className} ${inView && maskReveal ? 'mask-reveal-br' : ''}`}
        style={hiddenStyle}
      >
        <img
          src={fallbackImage}
          alt={alt}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div
      ref={wrapperRef}
      className={`${className} ${inView && maskReveal ? 'mask-reveal-br' : ''}`}
      style={hiddenStyle}
    >
      <Suspense
        fallback={
          <img
            src={fallbackImage}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        }
      >
        <Spline scene={sceneUrl} className="w-full h-full" />
      </Suspense>
    </div>
  )
}
