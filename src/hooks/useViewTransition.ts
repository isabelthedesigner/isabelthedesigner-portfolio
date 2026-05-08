import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'

type Direction = 'forward' | 'backward'

function getDirection(to: string): Direction {
  const toPath = to.split('#')[0].split('?')[0]
  const fromPath = window.location.pathname
  if (toPath === '/' && fromPath !== '/') return 'backward'
  return 'forward'
}

function runTransition(direction: Direction, callback: () => void) {
  document.documentElement.dataset.transition = direction

  if (!document.startViewTransition) {
    callback()
    return
  }

  const transition = document.startViewTransition(callback)
  transition.finished.finally(() => {
    delete document.documentElement.dataset.transition
  })
}

export function useViewTransition() {
  const navigate = useNavigate()
  const prevIdxRef = useRef<number>(
    (window.history.state as { idx?: number } | null)?.idx ?? 0
  )
  const handlingPopRef = useRef(false)

  useEffect(() => {
    // FALLBACK: if the undo/redo approach below causes instability,
    // replace handlePopState with this simpler version.
    // Browser back/forward will still get the correct CSS direction
    // but will not run inside startViewTransition.
    //
    const handlePopState = () => {
      const currentIdx = (window.history.state as { idx?: number } | null)?.idx ?? 0;
      const direction: Direction = currentIdx < prevIdxRef.current ? 'backward' : 'forward';
      document.documentElement.dataset.transition = direction;
      prevIdxRef.current = currentIdx;
      setTimeout(() => {
        delete document.documentElement.dataset.transition;
      }, 500);
    };

    // const handlePopState = () => {
    //   if (handlingPopRef.current) return

    //   const currentIdx =
    //     (window.history.state as { idx?: number } | null)?.idx ?? 0
    //   const prevIdx = prevIdxRef.current
    //   const delta = currentIdx - prevIdx

    //   const direction: Direction =
    //     currentIdx < prevIdx ? 'backward' : 'forward'

    //   handlingPopRef.current = true
    //   window.history.go(-delta)

    //   setTimeout(() => {
    //     runTransition(direction, () => {
    //       window.history.go(delta)
    //     })

    //     setTimeout(() => {
    //       prevIdxRef.current = currentIdx
    //       handlingPopRef.current = false
    //     }, 50)
    //   }, 50)
    // }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigateWithTransition = (to: string) => {
    const direction = getDirection(to)
    prevIdxRef.current =
      (window.history.state as { idx?: number } | null)?.idx ?? 0
    runTransition(direction, () => navigate(to))
  }

  return { navigateWithTransition }
}
