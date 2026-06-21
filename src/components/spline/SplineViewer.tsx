import { lazy, Suspense, useRef, useState, useEffect } from 'react'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { hasRevealed, markRevealed } from '@/lib/revealMemory'
import Image from '@/components/ui/Image'
import LazyVideo from '@/components/ui/LazyVideo'
import { DitherReveal } from './DitherReveal'

const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineViewerProps {
  /** Spline scene URL for the 3D embed */
  sceneUrl: string
  /** Path to the fallback image shown on mobile / while Spline loads */
  fallbackImage?: string
  /** Path to a fallback MP4 (looping, muted) shown instead of an image, e.g. for animated content */
  fallbackVideo?: string
  /** Alt text for the fallback image */
  alt: string
  className?: string
  /** Plays a dithering pixel reveal when the element enters the viewport */
  maskReveal?: boolean
  /** When provided, controls the mask reveal externally (skips internal IntersectionObserver) */
  triggerInView?: boolean
  /** Delays the mask reveal until the Spline scene has actually loaded (with a safety timeout) */
  revealOnLoad?: boolean
  /** Unique id used to remember if this reveal already played this session; if so, the animation is skipped */
  revealKey?: string
  /** Above-the-fold media (e.g. the hero): load the fallback eagerly with high priority */
  priority?: boolean
}

/**
 * Renders a Spline 3D scene on md+ screens and a static PNG on mobile.
 * The Spline runtime is lazy-loaded to avoid impacting initial bundle size.
 */
export default function SplineViewer({
  sceneUrl,
  fallbackImage,
  fallbackVideo,
  alt,
  className = '',
  maskReveal = false,
  triggerInView,
  revealOnLoad = false,
  revealKey,
  priority = false,
}: SplineViewerProps) {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [internalInView, setInternalInView] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const alreadyRevealed = revealKey ? hasRevealed(revealKey) : false

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

  // Remember the reveal as soon as it starts, so navigating back doesn't replay it
  useEffect(() => {
    if (!revealKey || alreadyRevealed) return
    if (revealTrigger === true) markRevealed(revealKey)
  }, [revealKey, alreadyRevealed, revealTrigger])

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

  const renderFallback = (imgClassName: string) => {
    if (fallbackVideo) {
      return <LazyVideo src={fallbackVideo} className={imgClassName} />
    }
    if (fallbackImage) {
      return (
        <Image src={fallbackImage} alt={alt} className={imgClassName} priority={priority} />
      )
    }
    return null
  }

  const content = !isDesktop ? (
    <div ref={wrapperRef} className={className}>
      {renderFallback('w-4/5 h-full object-contain mx-auto')}
    </div>
  ) : (
    <div ref={wrapperRef} className={className}>
      <Suspense fallback={renderFallback('w-full h-full object-cover')}>
        <Spline scene={sceneUrl} className="w-full h-full" />
      </Suspense>
    </div>
  )

  if (!maskReveal) return content

  return (
    <DitherReveal
      trigger={revealTrigger}
      skip={alreadyRevealed}
      className={className}
    >
      {!isDesktop ? (
        <div ref={wrapperRef} className="w-full h-full">
          {renderFallback('w-4/5 h-full object-contain mx-auto')}
        </div>
      ) : (
        <div ref={wrapperRef} className="w-full h-full">
          <Suspense fallback={renderFallback('w-full h-full object-cover')}>
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
