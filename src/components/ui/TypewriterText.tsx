import { useEffect, useRef, useState } from 'react'

interface TypewriterTextProps {
  children: string
  className?: string
  wordDelay?: number
  /** When provided, controls typing start externally (skips internal IntersectionObserver) */
  startTyping?: boolean
  /** When true, shows all text immediately with no animation */
  disabled?: boolean
}

export default function TypewriterText({
  children,
  className = '',
  wordDelay = 120,
  startTyping,
  disabled = false,
}: TypewriterTextProps) {
  const [visibleCount, setVisibleCount] = useState(0)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLParagraphElement>(null)
  const words = children.split(/\s+/)

  const isControlled = startTyping !== undefined

  useEffect(() => {
    if (disabled) return
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
  }, [disabled, isControlled, startTyping, hasTriggered])

  useEffect(() => {
    if (disabled || !hasTriggered) return
    if (visibleCount >= words.length) return

    const timer = setTimeout(() => {
      setVisibleCount((c) => c + 1)
    }, wordDelay)

    return () => clearTimeout(timer)
  }, [disabled, hasTriggered, visibleCount, words.length, wordDelay])

  if (disabled) {
    return <p className={className}>{children}</p>
  }

  return (
    <p ref={ref} className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-opacity duration-150"
          style={{ opacity: i < visibleCount ? 1 : 0 }}
        >
          {word}
          {i < words.length - 1 && '\u00A0'}
        </span>
      ))}
    </p>
  )
}
