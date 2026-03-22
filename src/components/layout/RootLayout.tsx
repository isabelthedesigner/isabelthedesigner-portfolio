import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './Header'
import Footer from './Footer'

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

function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      smoothScrollTo(hash)
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash])

  return null
}

export default function RootLayout() {
  return (
    <div className="relative flex min-h-dvh flex-col max-w-[1440px] mx-auto">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
