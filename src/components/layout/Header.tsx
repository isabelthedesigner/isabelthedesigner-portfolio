import { Link } from 'react-router-dom'
import NavLink from '@/components/ui/NavLink'

export default function Header() {
  return (
    <header className="absolute inset-x-0 top-0 z-10 mx-auto flex w-full max-w-[1440px] items-center justify-between bg-bg-none px-6 py-6 md:px-120 md:py-6">
      <Link to="/" className="flex items-center">
        <img
          src="/images/logo-i-color.png"
          alt="Isabel the Designer"
          className="size-12 md:size-[72px] object-contain"
        />
      </Link>
      <nav className="flex items-center gap-48 md:gap-48">
        <NavLink to="/">work</NavLink>
        <NavLink to="/info">info</NavLink>
        <NavLink to="/thoughts">thoughts</NavLink>
      </nav>
    </header>
  )
}
