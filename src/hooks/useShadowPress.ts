import { useRef, useCallback, type RefObject, type KeyboardEvent } from 'react'

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
  onFocus: () => void
  onBlur: () => void
  onKeyDown: (e: KeyboardEvent) => void
  onKeyUp: (e: KeyboardEvent) => void
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
  const isFocused = useRef(false)

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
      const activelyEngaged = isHovering.current || isFocused.current
      if (activelyEngaged) {
        ref.current.style.boxShadow = hoverShadow
      } else {
        ref.current.style.boxShadow = ''
      }
    }
  }, [ref, hoverShadow])

  const onMouseLeave = useCallback(() => {
    isHovering.current = false
    if (ref.current && !isFocused.current) {
      ref.current.style.boxShadow = ''
    }
    if (isPressed.current) {
      isPressed.current = false
      if (ref.current) {
        ref.current.style.transform = 'translate(0px, 0px)'
      }
    }
  }, [ref])

  const onFocus = useCallback(() => {
    isFocused.current = true
    if (ref.current && !isPressed.current) {
      ref.current.style.boxShadow = hoverShadow
      ref.current.style.transition = transition
    }
  }, [ref, hoverShadow])

  const onBlur = useCallback(() => {
    isFocused.current = false
    if (ref.current && !isHovering.current) {
      ref.current.style.boxShadow = ''
    }
    if (isPressed.current) {
      isPressed.current = false
      if (ref.current) {
        ref.current.style.transform = 'translate(0px, 0px)'
      }
    }
  }, [ref])

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        if (e.key === ' ') e.preventDefault()
        isPressed.current = true
        if (ref.current) {
          ref.current.style.transform = `translate(${pressOffset}px, ${pressOffset}px)`
          ref.current.style.boxShadow = pressedShadow
        }
      }
    },
    [ref, pressOffset, pressedShadow],
  )

  const onKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        isPressed.current = false
        if (ref.current) {
          ref.current.style.transform = 'translate(0px, 0px)'
          ref.current.style.boxShadow = hoverShadow
        }
      }
    },
    [ref, hoverShadow],
  )

  return { onMouseEnter, onMouseLeave, onMouseDown, onMouseUp, onFocus, onBlur, onKeyDown, onKeyUp }
}
