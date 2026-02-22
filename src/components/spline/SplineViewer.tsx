import { lazy, Suspense } from 'react'
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
}: SplineViewerProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  if (!isDesktop) {
    return (
      <img
        src={fallbackImage}
        alt={alt}
        className={className}
        loading="lazy"
      />
    )
  }

  return (
    <Suspense
      fallback={
        <img
          src={fallbackImage}
          alt={alt}
          className={className}
          loading="lazy"
        />
      }
    >
      <Spline scene={sceneUrl} className={className} />
    </Suspense>
  )
}
