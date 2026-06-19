import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useLayoutEffect, useRef } from 'react'

type Direction = 'forward' | 'backward'

function getDirection(to: string): Direction {
  const toPath = to.split('#')[0].split('?')[0]
  const fromPath = window.location.pathname
  if (toPath === '/' && fromPath !== '/') return 'backward'
  return 'forward'
}

// Monotonic token so a finishing (or aborted) transition never clears the
// `data-transition` attribute that a newer, in-flight transition relies on.
let activeTransition = 0

export function runViewTransition(
  direction: Direction,
  callback: () => void | Promise<void>,
) {
  const token = ++activeTransition
  document.documentElement.dataset.transition = direction

  if (!document.startViewTransition) {
    callback()
    return
  }

  const transition = document.startViewTransition(callback)
  transition.finished.finally(() => {
    if (token === activeTransition) {
      delete document.documentElement.dataset.transition
    }
  })
}

export function useViewTransition() {
  const navigate = useNavigate()
  const location = useLocation()
  const prevIdxRef = useRef<number>(
    (window.history.state as { idx?: number } | null)?.idx ?? 0
  )
  const commitResolveRef = useRef<(() => void) | null>(null)

  // Resolve the in-flight transition once the destination route has actually
  // committed, so the View Transition snapshots the NEW DOM rather than stale
  // DOM. This is more reliable than flushSync, which cannot force a synchronous
  // commit when React Router defers navigation via startTransition.
  useLayoutEffect(() => {
    if (commitResolveRef.current) {
      const resolve = commitResolveRef.current
      commitResolveRef.current = null
      resolve()
    }
  }, [location])

  useEffect(() => {
    const handlePopState = () => {
      const currentIdx =
        (window.history.state as { idx?: number } | null)?.idx ?? 0
      const direction: Direction =
        currentIdx < prevIdxRef.current ? 'backward' : 'forward'
      document.documentElement.dataset.transition = direction
      prevIdxRef.current = currentIdx
      setTimeout(() => {
        delete document.documentElement.dataset.transition
      }, 500)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateWithTransition = (to: string, onTransition?: () => void) => {
    // On mobile the diagonal page reveal is reserved for opening/closing the
    // menu (handled in Header). Backward navigations (e.g. going home) never
    // reveal on any breakpoint. Both cases just navigate instantly.
    const isMobile = window.matchMedia('(max-width: 767px)').matches
    const direction = getDirection(to)
    if (isMobile || direction === 'backward') {
      onTransition?.()
      navigate(to)
      return
    }

    prevIdxRef.current =
      (window.history.state as { idx?: number } | null)?.idx ?? 0

    runViewTransition(direction, () => {
      onTransition?.()
      navigate(to)
      return new Promise<void>((resolve) => {
        commitResolveRef.current = resolve
        // Safety net: resolve even if the route does not change (e.g. tapping
        // the link for the page you're already on) so the transition can't hang.
        setTimeout(() => {
          if (commitResolveRef.current === resolve) {
            commitResolveRef.current = null
          }
          resolve()
        }, 400)
      })
    })
  }

  return { navigateWithTransition }
}
