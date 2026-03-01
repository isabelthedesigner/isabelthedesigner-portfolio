import type { ReactNode } from 'react'

interface MarqueeProps {
  children: ReactNode
  /** Speed in seconds for one full scroll cycle */
  duration?: number
  className?: string
}

/**
 * Horizontally scrolling marquee. Content is duplicated to create
 * a seamless infinite loop using CSS animation.
 */
export default function Marquee({
  children,
  duration = 20,
  className = '',
}: MarqueeProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className="flex w-max gap-8"
        style={{
          animation: `marquee ${duration}s linear infinite`,
        }}
      >
        <div className="flex shrink-0 items-center gap-8">{children}</div>
        <div className="flex shrink-0 items-center gap-8" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}
