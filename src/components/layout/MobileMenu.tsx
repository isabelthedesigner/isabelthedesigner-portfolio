import { useViewTransition } from '@/hooks/useViewTransition'
import NavLink from '@/components/ui/NavLink'
import IconButton from '@/components/ui/IconButton'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  onNavigate: () => void
}

export default function MobileMenu({
  open,
  onClose,
  onNavigate,
}: MobileMenuProps) {
  const { navigateWithTransition } = useViewTransition()

  if (!open) return null

  function handleLogoClick(e: React.MouseEvent) {
    e.preventDefault()
    navigateWithTransition('/', onNavigate)
  }

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-bg-default md:hidden">
      <div className="flex w-full items-center justify-between px-24 py-24">
        <a href="/" onClick={handleLogoClick} className="flex items-center">
          <img
            src="/images/logo-i-color.png"
            alt="Isabel the designer logo"
            className="size-48 object-contain"
          />
        </a>
        <IconButton icon="X" aria-label="Close menu" onClick={onClose} />
      </div>
      <nav className="flex flex-1 flex-col items-center justify-center gap-48 px-24 pb-48">
        <NavLink size="large" to="/#work" onTransition={onNavigate}>
          work
        </NavLink>
        <NavLink size="large" to="/info" onTransition={onNavigate}>
          info
        </NavLink>
      </nav>
    </div>
  )
}
