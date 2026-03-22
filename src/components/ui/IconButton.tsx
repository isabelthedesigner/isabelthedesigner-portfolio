import { useRef, type ButtonHTMLAttributes } from 'react'
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react'
import Icon, { type IconName } from '@/components/ui/Icon'
import { useShadowPress } from '@/hooks/useShadowPress'

type IconButtonVariant = 'primary' | 'secondary' | 'tertiary'

const variantStyles: Record<IconButtonVariant, string> = {
  primary:
    'bg-default text-content-default border-border-default transition-colors',
  secondary:
    'bg-button-secondary-bg-default border-button-secondary-border-default text-button-secondary-content-default hover:bg-button-secondary-bg-hover hover:border-button-secondary-border-hover active:bg-button-secondary-bg-active active:border-button-secondary-border-active focus-visible:bg-button-secondary-bg-focus focus-visible:border-button-secondary-border-focus',
  tertiary:
    'bg-button-tertiary-bg-default border-button-tertiary-border-default text-button-tertiary-content-default hover:bg-button-tertiary-bg-hover hover:border-button-tertiary-border-hover active:bg-button-tertiary-bg-active active:border-button-tertiary-border-active focus-visible:bg-button-tertiary-bg-focus focus-visible:border-button-tertiary-border-focus focus-visible:outline-none',
}

const sizeStyles = {
  default: { padding: 'p-16', iconSize: 24 },
  xl: { padding: 'p-12', iconSize: 48 },
} as const

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  variant?: IconButtonVariant
  size?: 'default' | 'xl'
  weight?: PhosphorIconProps['weight']
}

export default function IconButton({
  icon,
  variant = 'tertiary',
  size = 'default',
  weight,
  className = '',
  ...props
}: IconButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  const shadowPress = useShadowPress(ref, { shadowSize: 8 })
  const shadowHandlers = variant === 'primary' ? shadowPress : {}
  const { padding, iconSize } = sizeStyles[size]

  return (
    <button
      ref={ref}
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center border-2 border-solid ${padding} ${variantStyles[variant]} ${className}`}
      {...shadowHandlers}
      {...props}
    >
      <Icon icon={icon} size={iconSize} weight={weight} />
    </button>
  )
}
