import Icon from '@/components/ui/Icon'

interface ColorSwatchProps {
  color: string
  isSelected: boolean
  onClick: () => void
}

export default function ColorSwatch({ color, isSelected, onClick }: ColorSwatchProps) {
  const needsDarkCheck = ['#FFCA41', '#04E1B2', '#DE2BC0'].includes(color.toUpperCase())

  return (
    <button
      type="button"
      className="relative size-36 shrink-0 cursor-pointer border-2 border-border-default"
      style={{ backgroundColor: color }}
      onClick={onClick}
      aria-label={`Select color ${color}`}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Icon icon="Checkmark" size={30} weight="bold" className={needsDarkCheck ? 'text-content-default' : 'text-content-default-inverse'} />
        </span>
      )}
    </button>
  )
}
