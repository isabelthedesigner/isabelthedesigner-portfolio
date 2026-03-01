import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useShadowPress } from '@/hooks/useShadowPress'
import Icon, { type IconName } from '@/components/ui/Icon'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  iconLeft?: IconName
  iconRight?: IconName
}

export default function Button({
  children,
  className = '',
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const shadowHandlers = useShadowPress(ref, { shadowSize: 8 })

  return (
    <button
      ref={ref}
      className={`text-label-large inline-flex items-center justify-center gap-16 cursor-pointer rounded-0 px-24 py-12 transition-colors bg-default text-content-default border-2 border-border-default ${className}`}
      {...shadowHandlers}
      {...props}
    >
      {iconLeft && <Icon icon={iconLeft} size={24} />}
      {children}
      {iconRight && <Icon icon={iconRight} size={24} />}
    </button>
  )
}