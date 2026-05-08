import { type ButtonHTMLAttributes } from 'react'

interface TabProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  isActive?: boolean
}

export default function Tab({
  label,
  isActive = false,
  className = '',
  ...props
}: TabProps) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      className={`flex items-center justify-center p-16 text-label-small cursor-pointer border-2 border-border-default focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-border-default),0_0_0_4px_var(--color-bg-default),0_0_0_6px_var(--color-electric-periwinkle)] ${
        isActive
          ? 'bg-bg-strong text-content-default-inverse'
          : 'bg-bg-default text-content-default hover:bg-baby-charcoal'
      } ${className}`}
      {...props}
    >
      {label}
    </button>
  )
}
