import { useRef, useCallback } from 'react'
import { usePortraitStore } from '@/hooks/usePortraitStore'
import Icon from '@/components/ui/Icon'

export default function ResetButton() {
  const { reset } = usePortraitStore()
  const ref = useRef<HTMLButtonElement>(null)
  const isPressedRef = useRef(false)
  const rotationRef = useRef(0)

  const handleMouseEnter = useCallback(() => {
    if (ref.current && !isPressedRef.current) {
      ref.current.style.boxShadow = '8px 8px 0 #131313'
      ref.current.style.transition = 'box-shadow 0.15s linear, transform 0.1s ease'
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.boxShadow = ''
    }
    if (isPressedRef.current) {
      isPressedRef.current = false
      if (ref.current) ref.current.style.transform = 'translate(0px, 0px)'
    }
  }, [])

  const handleMouseDown = useCallback(() => {
    isPressedRef.current = true

    if (ref.current) {
      ref.current.style.transform = 'translate(8px, 8px)'
      ref.current.style.boxShadow = '0px 0px 0 #131313'

      const icon = ref.current.querySelector<HTMLElement>('[data-icon]')
      if (icon) {
        rotationRef.current -= 360
        icon.style.transform = `rotate(${rotationRef.current}deg)`
        icon.style.transition = 'transform 0.5s ease-in-out'
      }
    }

    reset()
  }, [reset])

  const handleMouseUp = useCallback(() => {
    isPressedRef.current = false
    if (ref.current) {
      ref.current.style.transform = 'translate(0px, 0px)'
      const hovering = ref.current.matches(':hover')
      if (hovering) {
        ref.current.style.boxShadow = '8px 8px 0 #131313'
      } else {
        ref.current.style.boxShadow = ''
      }
    }
  }, [])

  const handleFocus = useCallback(() => {
    if (ref.current && !isPressedRef.current) {
      ref.current.style.boxShadow = '8px 8px 0 #131313'
      ref.current.style.transition = 'box-shadow 0.15s linear, transform 0.1s ease'
    }
  }, [])

  const handleBlur = useCallback(() => {
    if (ref.current) {
      ref.current.style.boxShadow = ''
    }
    if (isPressedRef.current) {
      isPressedRef.current = false
      if (ref.current) ref.current.style.transform = 'translate(0px, 0px)'
    }
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        isPressedRef.current = true

        if (ref.current) {
          ref.current.style.transform = 'translate(8px, 8px)'
          ref.current.style.boxShadow = '0px 0px 0 #131313'

          const icon = ref.current.querySelector<HTMLElement>('[data-icon]')
          if (icon) {
            rotationRef.current -= 360
            icon.style.transform = `rotate(${rotationRef.current}deg)`
            icon.style.transition = 'transform 0.5s ease-in-out'
          }
        }

        reset()
      }
    },
    [reset],
  )

  const handleKeyUp = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      isPressedRef.current = false
      if (ref.current) {
        ref.current.style.transform = 'translate(0px, 0px)'
        ref.current.style.boxShadow = '8px 8px 0 #131313'
      }
    }
  }, [])

  return (
    <button
      ref={ref}
      type="button"
      className="text-label-medium inline-flex w-full cursor-pointer items-center justify-center gap-16 border-2 border-border-default bg-default px-24 py-12 text-content-default"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
    >
      <span data-icon className="inline-flex">
        <Icon icon="Arrow Counter Clockwise" size={24} />
      </span>
      <span>RESET TO DEFAULT</span>
    </button>
  )
}
