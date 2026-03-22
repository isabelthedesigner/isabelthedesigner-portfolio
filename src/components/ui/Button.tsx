import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { useShadowPress } from '@/hooks/useShadowPress'
import Icon, { type IconName } from '@/components/ui/Icon'

const sizeStyles = {
  sm: {
    button: 'text-label-small gap-8 px-16 py-8',
    iconSize: 16,
  },
  default: {
    button: 'text-label-medium gap-16 px-24 py-12',
    iconSize: 24,
  },
} as const

type ButtonSize = keyof typeof sizeStyles

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: ButtonSize
  iconLeft?: IconName
  iconRight?: IconName
}

export default function Button({
  children,
  size = 'sm',
  className = '',
  iconLeft,
  iconRight,
  ...props
}: ButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const shadowHandlers = useShadowPress(ref, { shadowSize: 8 })
  const styles = sizeStyles[size]

  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center cursor-pointer rounded-0 transition-colors bg-default text-content-default border-2 border-border-default ${styles.button} ${className}`}
      {...shadowHandlers}
      {...props}
    >
      {iconLeft && <Icon icon={iconLeft} size={styles.iconSize} />}
      {children}
      {iconRight && <Icon icon={iconRight} size={styles.iconSize} />}
    </button>
  )
}