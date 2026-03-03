import { Link, useLocation } from 'react-router-dom'
import NavLink from '@/components/ui/NavLink'
import IconButton from '@/components/ui/IconButton'

export default function Header() {
  const isHome = useLocation().pathname === '/'

  return (
    <header
      className={`${
        isHome
          ? 'fixed inset-x-0 mx-auto max-w-[1440px]'
          : 'sticky'
      } top-0 z-50 flex w-full items-center justify-between bg-bg-none px-24 py-24`}
    >
      <Link to="/" className="flex items-center">
        <img
          src="/images/logo-i-color.png"
          alt="Isabel the designer logo"
          className="size-48 md:size-[72px] object-contain"
        />
      </Link>
      <nav className="hidden items-center gap-48 md:flex">
        <NavLink to="/">work</NavLink>
        <NavLink to="/info">info</NavLink>
        <NavLink to="/thoughts">thoughts</NavLink>
      </nav>
      <IconButton icon="List" aria-label="Open menu" className="md:hidden" />
    </header>
  )
}
