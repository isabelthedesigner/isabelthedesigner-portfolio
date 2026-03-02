import ColorSwatch from './ColorSwatch'
import { COLOR_PALETTE } from '@/hooks/usePortraitStore'

interface SwatchGroupProps {
  label: string
  currentColor: string
  onSelect: (color: string) => void
}

export default function SwatchGroup({ label, currentColor, onSelect }: SwatchGroupProps) {
  return (
    <div className="flex flex-col gap-8">
      <span className="text-label-small text-content-default">{label}</span>
      <div className="flex flex-wrap gap-8">
        {COLOR_PALETTE.map((color) => (
          <ColorSwatch
            key={color}
            color={color}
            isSelected={currentColor.toUpperCase() === color.toUpperCase()}
            onClick={() => onSelect(color)}
          />
        ))}
      </div>
    </div>
  )
}
