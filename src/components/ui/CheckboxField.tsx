import Checkbox from '@/components/ui/Checkbox'

interface CheckboxFieldProps {
  label: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  className?: string
}

export default function CheckboxField({
  label,
  checked = false,
  onChange,
  disabled,
  className = '',
}: CheckboxFieldProps) {
  return (
    <div
      className={`flex items-center gap-8 cursor-pointer select-none ${className}`}
      onClick={() => !disabled && onChange?.(!checked)}
    >
      <Checkbox checked={checked} disabled={disabled} />
      <span className="text-label-medium text-content-default">{label}</span>
    </div>
  )
}
