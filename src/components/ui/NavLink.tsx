import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useViewTransition } from '@/hooks/useViewTransition'

type NavLinkSize = 'default' | 'large'

type NavLinkBaseProps = {
  children: ReactNode
  className?: string
  size?: NavLinkSize
}

type InternalNavLinkProps = NavLinkBaseProps & {
  to: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
  onTransition?: () => void
}

type ExternalNavLinkProps = NavLinkBaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'className'>

type NavLinkProps = InternalNavLinkProps | ExternalNavLinkProps

const sizeClasses: Record<NavLinkSize, string> = {
  default: 'text-title-default-strong',
  large: 'text-title-large-strong',
}

const baseClasses =
  'inline-block text-content-link hover:bg-bg-link-hover hover:text-content-link-hover active:bg-bg-link-hover active:text-content-link-hover'

function isInternal(props: NavLinkProps): props is InternalNavLinkProps {
  return 'to' in props
}

export default function NavLink({
  children,
  className = '',
  size = 'default',
  ...props
}: NavLinkProps) {
  const { navigateWithTransition } = useViewTransition()
  const classes = `${baseClasses} ${sizeClasses[size]} ${className}`

  if (isInternal({ children, className, size, ...props })) {
    const { to, onClick, onTransition, ...rest } = props as InternalNavLinkProps
    return (
      <a
        href={to}
        className={classes}
        onClick={(e) => {
          e.preventDefault()
          onClick?.(e)
          navigateWithTransition(to, onTransition)
        }}
        {...rest}
      >
        {children}
      </a>
    )
  }

  const { href, ...rest } = props as ExternalNavLinkProps
  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  )
}
