import { useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

function smoothScrollTo(hash: string, attempt = 0) {
  const el = document.getElementById(hash.replace('#', ''))
  if (!el) {
    if (attempt < 20) {
      requestAnimationFrame(() => smoothScrollTo(hash, attempt + 1))
    }
    return
  }
  ScrollTrigger.refresh()
  gsap.to(window, {
    scrollTo: { y: el, autoKill: false },
    duration: 1,
    ease: 'power2.inOut',
  })
}

export function useHashScroll() {
  const { hash, pathname } = useLocation()

  useEffect(() => {
    if (!hash) return
    const id = setTimeout(() => {
      smoothScrollTo(hash)
    }, 500)
    return () => clearTimeout(id)
  }, [hash, pathname])
}
