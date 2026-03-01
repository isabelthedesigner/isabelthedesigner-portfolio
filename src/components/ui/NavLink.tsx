import { Link as RouterLink } from 'react-router-dom'
import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type NavLinkBaseProps = {
  children: ReactNode
  className?: string
}

type InternalNavLinkProps = NavLinkBaseProps &
  Omit<ComponentPropsWithoutRef<typeof RouterLink>, 'className'>

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
  const classes = `${baseClasses} ${className}`

  if (isInternal({ children, className, ...props })) {
    const { to, ...rest } = props as InternalNavLinkProps
    return (
      <RouterLink to={to} className={classes} {...rest}>
        {children}
      </RouterLink>
    )
  }

  const { href, ...rest } = props as ExternalNavLinkProps
  return (
    <a href={href} className={classes} {...rest}>
      {children}
    </a>
  )
}
