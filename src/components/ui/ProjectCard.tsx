import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useShadowPress } from '@/hooks/useShadowPress'
import Badge from '@/components/ui/Badge'

type BadgeCategory = '3D' | 'Animation' | 'AR' | 'Design Systems' | 'Type Design' | 'UX'

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
    <Link
      ref={ref}
      to={to}
      className={`flex min-h-[440px] flex-col items-start justify-between border-2 border-border-default bg-bg-default p-9 transition-[box-shadow,transform] ${className}`}
      {...shadowHandlers}
    >
      <div className="flex w-full flex-col gap-4">
        <div className="flex flex-wrap gap-8">
          {badges.map((category) => (
            <Badge key={category} category={category} />
          ))}
        </div>
        <h3 className="text-headline-medium text-content-default">
          {title}
        </h3>
      </div>
      <span className="text-label-large inline-flex items-center gap-8 text-content-link">
        VIEW PROJECT
        <img src="/images/arrow-right.svg" alt="" className="size-16" />
      </span>
    </Link>
  )
}
