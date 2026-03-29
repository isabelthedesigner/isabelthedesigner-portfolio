import { Link, useLocation, useNavigate } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import NavLink from '@/components/ui/NavLink'
import IconButton from '@/components/ui/IconButton'

gsap.registerPlugin(ScrollToPlugin, ScrollTrigger)

export default function Header() {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'

  function handleLogoClick(e: React.MouseEvent) {
    if (isHome) {
      e.preventDefault()
      gsap.to(window, {
        scrollTo: { y: 0, autoKill: false },
        duration: 1,
        ease: 'power2.inOut',
      })
      window.history.replaceState(null, '', '/')
    }
  }

  function handleWorkClick(e: React.MouseEvent) {
    e.preventDefault()
    if (isHome) {
      const el = document.getElementById('work')
      if (el) {
        gsap.to(window, {
          scrollTo: { y: el, autoKill: false },
          duration: 1,
          ease: 'power2.inOut',
        })
        window.history.replaceState(null, '', '/#work')
      }
    } else {
      navigate('/#work')
    }
  }

  return (
    <header
      className={`${
        isHome
          ? 'fixed inset-x-0 mx-auto max-w-[1440px]'
          : 'sticky'
      } top-0 z-50 flex w-full items-center justify-between bg-bg-none px-24 py-24`}
    >
      <Link to="/" onClick={handleLogoClick} className="flex items-center">
        <img
          src="/images/logo-i-color.png"
          alt="Isabel the designer logo"
          className="size-48 md:size-[72px] object-contain"
        />
      </Link>
      <nav className="hidden items-center gap-48 md:flex">
        <NavLink href="/#work" onClick={handleWorkClick}>work</NavLink>
        <NavLink to="/info">info</NavLink>
        <NavLink to="/thoughts">thoughts</NavLink>
      </nav>
      <IconButton icon="List" aria-label="Open menu" className="md:hidden" />
    </header>
  )
}
