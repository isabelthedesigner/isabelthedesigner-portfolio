import { useRef, useState, useEffect, useCallback, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

interface UseScrollGuideOptions {
  sections: RefObject<HTMLElement | null>[]
}

/**
 * Drives a scroll-guide button that is fixed at the bottom of the viewport
 * until its sentinel element scrolls into view, at which point it becomes
 * static in the document flow.
 *
 * For pinned sections the hook looks up the corresponding ScrollTrigger
 * instance and scrolls to its pre-calculated `.start` position, which
 * already accounts for every pin spacer in the document. This avoids the
 * drift that occurs when scrollTo targets a moving element.
 */
export function useScrollGuide({ sections }: UseScrollGuideOptions) {
  const sentinelRef = useRef<HTMLDivElement>(null)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [isPinned, setIsPinned] = useState(true)

  useEffect(() => {
    let ticking = false
    const check = () => {
      if (!anchorRef.current) return
      const rect = anchorRef.current.getBoundingClientRect()
      // Unpin at the exact pixel where the in-flow button's bottom
      // meets the fixed clone's bottom (viewport height - bottom offset).
      // This makes the swap visually seamless.
      setIsPinned(rect.bottom > window.innerHeight - 24)
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        check()
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    check()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const next = useCallback(() => {
    let nextIdx = 0

    for (let i = 0; i < sections.length; i++) {
      const el = sections[i].current
      if (!el) continue
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight * 0.5) {
        nextIdx = i + 1
      }
    }

    const target = nextIdx < sections.length ? sections[nextIdx].current : null
    if (!target) return

    const trigger = ScrollTrigger.getAll().find((t) => t.trigger === target)

    gsap.to(window, {
      scrollTo: trigger ? trigger.start + 1 : { y: target, autoKill: true },
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => ScrollTrigger.update(),
    })
  }, [sections])

  return { sentinelRef, anchorRef, isPinned, next }
}
