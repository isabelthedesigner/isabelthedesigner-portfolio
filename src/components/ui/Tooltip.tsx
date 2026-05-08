interface TooltipProps {
  text: string
  visible?: boolean
  className?: string
}

export default function Tooltip({
  text,
  visible = false,
  className = '',
}: TooltipProps) {
  return (
    <div
      className={`relative inline-flex items-center bg-bg-strong p-8 transition-transform duration-150 ease-out origin-bottom ${
        visible ? 'scale-100' : 'scale-0'
      } ${className}`}
    >
      <span className="text-meta-small text-content-default-inverse text-center whitespace-nowrap">
        {text}
      </span>
      <div
        className="absolute left-1/2 -translate-x-1/2 bottom-[-8px]"
        style={{
          width: 0,
          height: 0,
          borderLeft: '6px solid transparent',
          borderRight: '6px solid transparent',
          borderTop: '8px solid var(--color-bg-strong)',
        }}
      />
    </div>
  )
}
