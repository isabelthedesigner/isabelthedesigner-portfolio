import type { ReactNode } from 'react'

export type BadgeVariant =
  | 'yellow'
  | 'periwinkle'
  | 'electric-periwinkle'
  | 'hot-pink'
  | 'red'
  | 'teal'
  | 'subtle'

interface BadgeProps {
  variant: BadgeVariant
  children: ReactNode
}

const BADGE_STYLES: Record<BadgeVariant, { bg: string; text: string }> = {
  yellow: { bg: 'bg-bg-yellow', text: 'text-content-default' },
  periwinkle: { bg: 'bg-bg-periwinkle', text: 'text-content-default' },
  'electric-periwinkle': { bg: 'bg-bg-electric-periwinkle', text: 'text-content-default-inverse' },
  'hot-pink': { bg: 'bg-bg-hot-pink', text: 'text-content-default' },
  red: { bg: 'bg-bg-red', text: 'text-content-default-inverse' },
  teal: { bg: 'bg-bg-teal', text: 'text-content-default' },
  subtle: { bg: 'bg-bg-subtle', text: 'text-content-default' },
}

export default function Badge({ variant, children }: BadgeProps) {
  const style = BADGE_STYLES[variant]

  return (
    <span
      className={`text-meta-small md:text-meta-medium inline-flex items-center justify-center rounded-4 px-12 py-4 md:px-16 md:py-4 ${style.bg} ${style.text}`}
    >
      {children}
    </span>
  )
}
