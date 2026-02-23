import { useRef, useState, useLayoutEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface ScrollPinOptions {
  /** How far past the pin start the user must scroll before it unpins (default "+=50%") */
  pinDistance?: string
  /** Disable pinning entirely (useful for mobile override) */
  enabled?: boolean
}

/**
 * Pins an element in the viewport while the user scrolls through a defined range.
 * Returns a ref to attach to the section and an `isActive` flag that flips true
 * once the section first enters its pinned position (for triggering animations).
 */
export function useScrollPin<T extends HTMLElement = HTMLElement>(
  options: ScrollPinOptions = {},
) {
  const { pinDistance = '+=50%', enabled = true } = options
  const ref = useRef<T>(null)
  const [isActive, setIsActive] = useState(false)

  useLayoutEffect(() => {
    if (!enabled || !ref.current) return

    const trigger = ScrollTrigger.create({
      trigger: ref.current,
      start: 'top top',
      end: pinDistance,
      pin: true,
      onEnter: () => setIsActive(true),
    })

    return () => {
      trigger.kill()
    }
  }, [enabled, pinDistance])

  return { ref, isActive }
}
