import { Fragment, useEffect, useRef, useState } from 'react'
import { hasRevealed, markRevealed } from '@/lib/revealMemory'

interface TypewriterTextProps {
  children: string
  className?: string
  wordDelay?: number
  /** When provided, controls typing start externally (skips internal IntersectionObserver) */
  startTyping?: boolean
  /** When true, shows all text immediately with no animation */
  disabled?: boolean
  /** Unique id used to remember if this typing already played this session; if so, the text shows instantly */
  revealKey?: string
  /** Fires once all words are visible (or instantly if showInstantly) */
  onComplete?: () => void
}

export default function TypewriterText({
  children,
  className = '',
  wordDelay = 120,
  startTyping,
  disabled = false,
  revealKey,
  onComplete,
}: TypewriterTextProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)
  const words = children.split(/\s+/)

  const alreadyRevealed = revealKey ? hasRevealed(revealKey) : false
  const showInstantly = disabled || alreadyRevealed

  const completeFiredRef = useRef(false)

  const isControlled = startTyping !== undefined

  useEffect(() => {
    if (showInstantly) return
    if (isControlled) {
      if (startTyping && !hasTriggered) setHasTriggered(true)
      return
    }

    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTriggered) {
          setHasTriggered(true)
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [showInstantly, isControlled, startTyping, hasTriggered])

  useEffect(() => {
    if (showInstantly || !hasTriggered) return
    if (visibleCount >= words.length) {
      if (revealKey) markRevealed(revealKey)
      completeFiredRef.current = true
      onComplete?.()
      return
    }

    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1)
    }, wordDelay)

    return () => clearTimeout(timer)
  }, [showInstantly, hasTriggered, visibleCount, words.length, wordDelay, revealKey, onComplete])

  useEffect(() => {
    if (showInstantly && onComplete && !completeFiredRef.current) {
      if (isControlled && !startTyping) return
      completeFiredRef.current = true
      onComplete()
    }
  }, [showInstantly, isControlled, startTyping, onComplete])

  if (showInstantly) {
    const visible = !isControlled || startTyping
    return <p className={className} style={visible ? undefined : { opacity: 0 }}>{children}</p>
  }

  return (
    <p ref={ref} className={`whitespace-normal ${className}`}>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span
            className="inline-block transition-opacity duration-150"
            style={{ opacity: i < visibleCount ? 1 : 0 }}
          >
            {word}
          </span>
          {i < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </p>
  )
}
