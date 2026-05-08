import { forwardRef } from 'react'
import { useViewTransition } from '@/hooks/useViewTransition'

interface TransitionLinkProps
  extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  to: string
  children: React.ReactNode
}

const TransitionLink = forwardRef<HTMLAnchorElement, TransitionLinkProps>(
  ({ to, children, onClick, ...rest }, ref) => {
    const { navigateWithTransition } = useViewTransition()

    return (
      <a
        ref={ref}
        href={to}
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
)

TransitionLink.displayName = 'TransitionLink'

export default TransitionLink
