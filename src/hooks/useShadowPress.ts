import { useRef, useCallback, type RefObject } from 'react'

interface ShadowPressOptions {
  /** Shadow offset in pixels (8 for buttons, 16 for cards) */
  shadowSize?: number
  /** Shadow color */
  shadowColor?: string
  /** Translation distance on press */
  pressOffset?: number
}

interface ShadowPressHandlers {
  onMouseEnter: () => void
  onMouseLeave: () => void
  onMouseDown: () => void
  onMouseUp: () => void
}

/**
 * Provides hover shadow + press-down interaction handlers.
 * Button variant: 8px shadow offset.
 * Card variant: 16px shadow offset.
 */
export function useShadowPress<T extends HTMLElement>(
  ref: RefObject<T | null>,
  options: ShadowPressOptions = {},
): ShadowPressHandlers {
  const {
    shadowSize = 8,
    shadowColor = 'var(--color-border-default)',
    pressOffset = 8,
  } = options

  const isPressed = useRef(false)
  const isHovering = useRef(false)

  const hoverShadow = `${shadowSize}px ${shadowSize}px 0 ${shadowColor}`
  const pressedShadow = `0px 0px 0 ${shadowColor}`
  const transition = 'box-shadow 0.15s linear, transform 0.1s ease'

  const onMouseEnter = useCallback(() => {
    isHovering.current = true
    if (ref.current && !isPressed.current) {
      ref.current.style.boxShadow = hoverShadow
      ref.current.style.transition = transition
    }
  }, [ref, hoverShadow])

  const onMouseDown = useCallback(() => {
    isPressed.current = true
    if (ref.current) {
      ref.current.style.transform = `translate(${pressOffset}px, ${pressOffset}px)`
      ref.current.style.boxShadow = pressedShadow
    }
  }, [ref, pressOffset, pressedShadow])

  const onMouseUp = useCallback(() => {
    isPressed.current = false
    if (ref.current) {
      ref.current.style.transform = 'translate(0px, 0px)'
      const actuallyHovering = ref.current.matches(':hover')
      if (actuallyHovering) {
        ref.current.style.boxShadow = hoverShadow
      } else {
        isHovering.current = false
        ref.current.style.boxShadow = ''
      }
    }
  }, [ref, hoverShadow])

  const onMouseLeave = useCallback(() => {
    isHovering.current = false
    if (ref.current) {
      ref.current.style.boxShadow = ''
    }
    if (isPressed.current) {
      isPressed.current = false
      if (ref.current) {
        ref.current.style.transform = 'translate(0px, 0px)'
      }
    }
  }, [ref])

  return { onMouseEnter, onMouseLeave, onMouseDown, onMouseUp }
}
