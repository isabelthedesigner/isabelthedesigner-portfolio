import { Link } from 'react-router-dom'
import NavLink from '@/components/ui/NavLink'
import Icon from '@/components/ui/Icon'

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between bg-bg-none px-24 py-24">
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
      <button
        type="button"
        className="flex cursor-pointer items-center justify-center text-content-link md:hidden"
        aria-label="Open menu"
      >
        <Icon icon="List" size={24} />
      </button>
    </header>
  )
}
