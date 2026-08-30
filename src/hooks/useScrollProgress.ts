import { useEffect, useRef, useCallback, type RefObject } from 'react'

/**
 * Tracks how far a section has been scrolled through while pinned (0..1)
 * and writes `--p` (raw progress) and `--q` (eased, caps at 75%) as CSS
 * custom properties on the section element.
 *
 * Progress starts at 0 when the section top hits the viewport top (sticky
 * pin engages) and reaches 1 when the section bottom hits the viewport
 * bottom (sticky releases).
 *
 * Accepts an optional callback that fires on every update with (p, q),
 * so consumers don't need a second scroll listener.
 */
export function useScrollProgress<T extends HTMLElement>(
  onProgress?: (p: number, q: number) => void,
): RefObject<T | null> {
  const ref = useRef<T>(null)
  const cbRef = useRef(onProgress)
  cbRef.current = onProgress

  const update = useCallback(() => {
    const el = ref.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const sectionH = el.scrollHeight || el.offsetHeight
    const viewH = window.innerHeight
    const pinRange = sectionH - viewH

    if (pinRange <= 0) return

    const scrolledPast = -rect.top
    const p = Math.min(1, Math.max(0, scrolledPast / pinRange))
    const q = Math.min(1, Math.max(0, p / 0.75))

    el.style.setProperty('--p', String(p))
    el.style.setProperty('--q', String(q))

    cbRef.current?.(p, q)
  }, [])

  useEffect(() => {
    let ticking = false

    function onScroll() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          ticking = false
          update()
        })
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', update)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', update)
    }
  }, [update])

  return ref
}
