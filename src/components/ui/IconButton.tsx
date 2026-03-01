import type { ButtonHTMLAttributes } from 'react'
import type { IconProps as PhosphorIconProps } from '@phosphor-icons/react'
import Icon, { type IconName } from '@/components/ui/Icon'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: IconName
  size?: 'default' | 'xl'
  weight?: PhosphorIconProps['weight']
}

export default function IconButton({
  icon,
  size = 'default',
  weight,
  className = '',
  ...props
}: IconButtonProps) {
  const iconSize = size === 'xl' ? 48 : 32

  return (
    <button
      type="button"
      className={`inline-flex cursor-pointer items-center justify-center p-12 border-2 border-solid bg-button-tertiary-bg-default border-button-tertiary-border-default text-button-tertiary-content-default hover:bg-button-tertiary-bg-hover hover:border-button-tertiary-border-hover active:bg-button-tertiary-bg-active active:border-button-tertiary-border-active focus-visible:bg-button-tertiary-bg-focus focus-visible:border-button-tertiary-border-focus focus-visible:outline-none ${className}`}
      {...props}
    >
      <Icon icon={icon} size={iconSize} weight={weight} />
    </button>
  )
}
