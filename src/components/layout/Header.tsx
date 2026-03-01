import { Link } from 'react-router-dom'
import NavLink from '@/components/ui/NavLink'
import IconButton from '@/components/ui/IconButton'

export default function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between bg-bg-none px-24 py-24">
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
