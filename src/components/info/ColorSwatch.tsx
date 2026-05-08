import Icon from '@/components/ui/Icon'
import tokens from '@/tokens/design-tokens.json'

const bg = tokens.semantic.color.bg

const DARK_CHECK_COLORS = [
  bg.yellow.value,
  bg.teal.value,
  bg['hot-pink'].value,
  bg.periwinkle.value,
  bg.eggshell.value,
].map(c => c.toUpperCase())

interface ColorSwatchProps {
  color: string
  isSelected: boolean
  onClick: () => void
}

export default function ColorSwatch({ color, isSelected, onClick }: ColorSwatchProps) {
  const needsDarkCheck = DARK_CHECK_COLORS.includes(color.toUpperCase())

  return (
    <button
      type="button"
      className="relative size-48 shrink-0 cursor-pointer border-2 border-border-default"
      style={{ backgroundColor: color }}
      onClick={onClick}
      aria-label={`Select color ${color}`}
      aria-pressed={isSelected}
    >
      {isSelected && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Icon icon="Checkmark" size={40} weight="bold" className={needsDarkCheck ? 'text-content-default' : 'text-content-default-inverse'} />
        </span>
      )}
    </button>
  )
}
