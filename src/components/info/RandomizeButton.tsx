import { useRef, useCallback } from 'react'
import { usePortraitStore } from '@/hooks/usePortraitStore'

const COLOR_COMBOS = [
  { bg: '#FFCA41', text: '#131313' },
  { bg: '#4600EC', text: '#EBE9E6' },
  { bg: '#DE2BC0', text: '#131313' },
  { bg: '#04E1B2', text: '#131313' },
  { bg: '#d10000', text: '#EBE9E6' },
  { bg: '#6781FF', text: '#131313' },
]

export default function RandomizeButton() {
  const { randomize } = usePortraitStore()
  const ref = useRef<HTMLButtonElement>(null)
  const indexRef = useRef(0)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const isPressedRef = useRef(false)

  const updateColors = useCallback(() => {
    if (ref.current && !ref.current.matches(':hover') && !ref.current.matches(':focus')) {
      stopCycling()
      resetColors()
      return
    }

    indexRef.current = (indexRef.current + 1) % COLOR_COMBOS.length
    const combo = COLOR_COMBOS[indexRef.current]

    if (ref.current) {
      ref.current.style.backgroundColor = combo.bg
      ref.current.style.color = combo.text
      ref.current.querySelectorAll<HTMLElement>('span').forEach((el) => {
        el.style.color = combo.text
      })
    }
  }, [])

  const startCycling = useCallback(() => {
    if (intervalRef.current) return

    if (ref.current && !isPressedRef.current) {
      ref.current.style.boxShadow = '8px 8px 0 #131313'
      ref.current.style.transition = 'box-shadow 0.15s linear, transform 0.1s ease'
    }

    intervalRef.current = setInterval(updateColors, 300)
  }, [updateColors])

  const stopCycling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const resetColors = useCallback(() => {
    if (ref.current) {
      ref.current.style.backgroundColor = ''
      ref.current.style.color = ''
      ref.current.style.boxShadow = ''
      ref.current.querySelectorAll<HTMLElement>('span').forEach((el) => {
        el.style.color = ''
      })
    }
  }, [])

  const handleMouseEnter = useCallback(() => {
    startCycling()
  }, [startCycling])

  const handleMouseLeave = useCallback(() => {
    stopCycling()
    resetColors()
    if (isPressedRef.current) {
      isPressedRef.current = false
      if (ref.current) ref.current.style.transform = 'translate(0px, 0px)'
    }
  }, [stopCycling, resetColors])

  const handleMouseDown = useCallback(() => {
    isPressedRef.current = true
    if (ref.current) {
      ref.current.style.transform = 'translate(8px, 8px)'
      ref.current.style.boxShadow = '0px 0px 0 #131313'
    }
    randomize()
  }, [randomize])

  const handleMouseUp = useCallback(() => {
    isPressedRef.current = false
    if (ref.current) {
      ref.current.style.transform = 'translate(0px, 0px)'
      const hovering = ref.current.matches(':hover')
      if (hovering) {
        ref.current.style.boxShadow = '8px 8px 0 #131313'
      } else {
        stopCycling()
        resetColors()
      }
    }
  }, [stopCycling, resetColors])

  const handleFocus = useCallback(() => {
    startCycling()
  }, [startCycling])

  const handleBlur = useCallback(() => {
    stopCycling()
    resetColors()
    if (isPressedRef.current) {
      isPressedRef.current = false
      if (ref.current) ref.current.style.transform = 'translate(0px, 0px)'
    }
  }, [stopCycling, resetColors])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        isPressedRef.current = true
        if (ref.current) {
          ref.current.style.transform = 'translate(8px, 8px)'
          ref.current.style.boxShadow = '0px 0px 0 #131313'
        }
        randomize()
      }
    },
    [randomize],
  )

  const handleKeyUp = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        isPressedRef.current = false
        if (ref.current) {
          ref.current.style.transform = 'translate(0px, 0px)'
          ref.current.style.boxShadow = '8px 8px 0 #131313'
        }
      }
    },
    [],
  )

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
      <span>RANDOMIZE</span>
    </button>
  )
}
