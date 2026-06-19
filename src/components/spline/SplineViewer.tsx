import { lazy, Suspense, useRef, useState, useEffect } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { DitherReveal } from './DitherReveal'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineViewerProps {
  /** Spline scene URL for the 3D embed */
  sceneUrl: string
  /** Path to the fallback PNG image shown on mobile */
  fallbackImage: string
  /** Alt text for the fallback image */
  alt: string
  className?: string
  /** Plays a dithering pixel reveal when the element enters the viewport */
  maskReveal?: boolean
  /** When provided, controls the mask reveal externally (skips internal IntersectionObserver) */
  triggerInView?: boolean
  /** Delays the mask reveal until the Spline scene has actually loaded (with a safety timeout) */
  revealOnLoad?: boolean
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
  revealOnLoad = false,
}: SplineViewerProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [internalInView, setInternalInView] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const isControlled = triggerInView !== undefined
  const inView = isControlled ? triggerInView : internalInView

  const revealTrigger = revealOnLoad ? loaded : isControlled ? inView : undefined

  useEffect(() => {
    if (!revealOnLoad) return
    if (!isDesktop) {
      setLoaded(true)
      return
    }
    const t = setTimeout(() => setLoaded(true), 4000)
    return () => clearTimeout(t)
  }, [revealOnLoad, isDesktop])

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

  const content = !isDesktop ? (
    <div ref={wrapperRef} className={className}>
      <img
        src={fallbackImage}
        alt={alt}
        className="w-4/5 h-full object-contain mx-auto"
      />
    </div>
  ) : (
    <div ref={wrapperRef} className={className}>
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

  if (!maskReveal) return content

  return (
    <DitherReveal
      trigger={revealTrigger}
      className={className}
    >
      {!isDesktop ? (
        <div ref={wrapperRef} className="w-full h-full">
          <img
            src={fallbackImage}
            alt={alt}
            className="w-4/5 h-full object-contain mx-auto"
          />
        </div>
      ) : (
        <div ref={wrapperRef} className="w-full h-full">
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
            <Spline
              scene={sceneUrl}
              className="w-full h-full"
              onLoad={() => setLoaded(true)}
            />
          </Suspense>
        </div>
      )}
    </DitherReveal>
  )
}
