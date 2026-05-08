import type { ComponentPropsWithoutRef, ReactNode } from 'react'
import { useViewTransition } from '@/hooks/useViewTransition'

type NavLinkBaseProps = {
  children: ReactNode
  className?: string
}

type InternalNavLinkProps = NavLinkBaseProps & {
  to: string
  onClick?: React.MouseEventHandler<HTMLAnchorElement>
}

type ExternalNavLinkProps = NavLinkBaseProps &
  Omit<ComponentPropsWithoutRef<'a'>, 'className'>

type NavLinkProps = InternalNavLinkProps | ExternalNavLinkProps

const baseClasses =
  'inline-block text-title-default-strong text-content-link hover:bg-bg-link-hover hover:text-content-link-hover active:bg-bg-link-hover active:text-content-link-hover'

function isInternal(props: NavLinkProps): props is InternalNavLinkProps {
  return 'to' in props
}

export default function NavLink({
  children,
  className = '',
  ...props
}: NavLinkProps) {
  const { navigateWithTransition } = useViewTransition()
  const classes = `${baseClasses} ${className}`

  if (isInternal({ children, className, ...props })) {
    const { to, onClick, ...rest } = props as InternalNavLinkProps
    return (
      <a
        href={to}
        className={classes}
        onClick={(e) => {
          e.preventDefault()
          onClick?.(e)
          navigateWithTransition(to)
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
