import { type ButtonHTMLAttributes } from 'react'
import Icon from '@/components/ui/Icon'

interface CheckboxProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked?: boolean
  onChange?: (checked: boolean) => void
}

export default function Checkbox({
  checked = false,
  onChange,
  className = '',
  disabled,
  ...props
}: CheckboxProps) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      className={`inline-flex items-center justify-center size-24 border-2 border-border-default cursor-pointer ${
        checked ? 'bg-bg-electric-periwinkle' : 'bg-bg-default'
      } ${className}`}
      onClick={() => onChange?.(!checked)}
      {...props}
    >
      {checked && (
        <Icon
          icon="Checkmark"
          size={16}
          className="text-content-default-inverse"
        />
      )}
    </button>
  )
}
