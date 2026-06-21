import { useRef } from 'react'
import { useShadowPress } from '@/hooks/useShadowPress'
import TransitionLink from '@/components/TransitionLink'
import Badge from '@/components/ui/Badge'
import type { BadgeVariant } from '@/components/ui/Badge'

type BadgeCategory = '3D' | 'Animation' | 'AR' | 'Design Systems' | 'Type Design' | 'UX'

const CATEGORY_VARIANT: Record<BadgeCategory, BadgeVariant> = {
  UX: 'yellow',
  'Design Systems': 'periwinkle',
  Animation: 'electric-periwinkle',
  'Type Design': 'hot-pink',
  '3D': 'red',
  AR: 'periwinkle',
}

interface ProjectCardProps {
  to: string
  title: string
  badges: BadgeCategory[]
  className?: string
}

export default function ProjectCard({
  to,
  title,
  badges,
  className = '',
}: ProjectCardProps) {
  const ref = useRef<HTMLAnchorElement>(null)
  const shadowHandlers = useShadowPress(ref, { shadowSize: 16 })

  return (
    <TransitionLink
      ref={ref}
      to={to}
      className={`flex min-h-[325px] md:min-h-[460px] flex-col items-start justify-between border-2 border-border-default bg-bg-default p-24 md:p-36 transition-[box-shadow,transform] ${className}`}
      {...shadowHandlers}
    >
      <div className="flex w-full flex-col gap-16">
        <div className="flex flex-wrap gap-8">
          {badges.map((category) => (
            <Badge key={category} variant={CATEGORY_VARIANT[category]}>{category}</Badge>
          ))}
        </div>
        <h3 className="text-title-large-mobile md:text-title-large">
          {title}
        </h3>
      </div>
      <span className="text-label-small md:text-label-medium inline-flex items-center gap-8 text-content-link">
        VIEW PROJECT
        <img src="/images/arrow-right.svg" alt="" className="size-12 md:size-16" loading="lazy" decoding="async" />
      </span>
    </TransitionLink>
  )
}
