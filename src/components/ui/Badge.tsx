type BadgeCategory = '3D' | 'Animation' | 'AR' | 'Design Systems' | 'Type Design' | 'UX'

interface BadgeProps {
  category: BadgeCategory
}

const BADGE_STYLES: Record<BadgeCategory, { bg: string; text: string }> = {
  UX: { bg: 'bg-bg-yellow', text: 'text-content-default' },
  'Design Systems': { bg: 'bg-bg-periwinkle', text: 'text-content-default' },
  Animation: { bg: 'bg-bg-electric-periwinkle', text: 'text-content-default-inverse' },
  'Type Design': { bg: 'bg-bg-hot-pink', text: 'text-content-default' },
  '3D': { bg: 'bg-bg-red', text: 'text-content-default-inverse' },
  AR: { bg: 'bg-bg-periwinkle', text: 'text-content-default' },
}

export default function Badge({ category }: BadgeProps) {
  const style = BADGE_STYLES[category]

  return (
    <span
      className={`text-meta-small md:text-meta-medium inline-flex items-center justify-center rounded-4 px-12 py-4 md:px-16 md:py-4 ${style.bg} ${style.text}`}
    >
      {category}
    </span>
  )
}
