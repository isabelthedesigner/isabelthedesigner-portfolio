import { useState, useRef, useEffect, useCallback } from 'react'
import Tooltip from '@/components/ui/Tooltip'

interface RangeSliderProps {
  min?: number
  max?: number
  value: number
  onChange: (value: number) => void
  showIndicators?: boolean
  className?: string
}

export default function RangeSlider({
  min = 8,
  max = 300,
  value,
  onChange,
  showIndicators = true,
  className = '',
}: RangeSliderProps) {
  const sliderRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [isFocused, setIsFocused] = useState(false)

  const percentage = ((value - min) / (max - min)) * 100

  const updateValue = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return
      const rect = trackRef.current.getBoundingClientRect()
      const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      onChange(Math.round(min + pct * (max - min)))
    },
    [min, max, onChange],
  )

  const handleTrackMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setShowTooltip(true)
    updateValue(e.clientX)
  }

  const handleThumbMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
    setShowTooltip(true)
  }

  useEffect(() => {
    if (!isDragging) return

    const handleMouseMove = (e: MouseEvent) => updateValue(e.clientX)
    const handleMouseUp = () => setIsDragging(false)

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, updateValue])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sliderRef.current && !sliderRef.current.contains(e.target as Node)) {
        setShowTooltip(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={sliderRef} className={`flex items-center gap-8 ${className}`}>
      {showIndicators && (
        <span className="font-sans text-[24px] font-light leading-[32px] text-content-default shrink-0 select-none">
          A
        </span>
      )}

      <div className="relative flex-1">
        {/* Clickable track area */}
        <div
          ref={trackRef}
          className="relative flex items-center h-[30px] cursor-pointer"
          onMouseDown={handleTrackMouseDown}
        >
          <div className="relative h-4 w-full bg-charcoal">
            <div
              className="absolute h-full bg-dark-charcoal"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Thumb + Tooltip */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 pointer-events-none"
          style={{ left: `${percentage}%` }}
        >
          <div
            className="size-[30px] rounded-full bg-dark-charcoal cursor-pointer pointer-events-auto"
            onMouseDown={handleThumbMouseDown}
            onMouseEnter={() => setShowTooltip(true)}
            style={isFocused ? {
              outline: '2px solid var(--color-electric-periwinkle)',
              outlineOffset: '2px',
            } : undefined}
          />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-[8px]">
            <Tooltip text={String(value)} visible={showTooltip} />
          </div>
        </div>

        {/* Native range input overlaid on thumb for keyboard accessibility */}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => {
            onChange(Number(e.target.value))
            setShowTooltip(true)
          }}
          onFocus={() => { setShowTooltip(true); setIsFocused(true) }}
          onBlur={() => setIsFocused(false)}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-[30px] rounded-full opacity-0 pointer-events-none z-10 focus-visible:outline-none"
          style={{ left: `${percentage}%` }}
          aria-label="Range slider"
        />
      </div>

      {showIndicators && (
        <span className="font-sans text-[24px] font-semibold leading-[32px] text-content-default shrink-0 select-none">
          A
        </span>
      )}
    </div>
  )
}
