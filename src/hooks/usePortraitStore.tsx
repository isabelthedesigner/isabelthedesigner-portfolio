import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import tokens from '@/tokens/design-tokens.json'

const bg = tokens.semantic.color.bg

export const COLOR_PALETTE = [
  bg.red.value,
  bg['hot-pink'].value,
  bg.yellow.value,
  bg.teal.value,
  bg.periwinkle.value,
  bg['electric-periwinkle'].value,
] as const

const DEFAULTS = {
  hairColor: bg.periwinkle.value,
  glassesColor: bg.yellow.value,
  lipstickColor: bg.red.value,
} as const

interface PortraitStore {
  hairColor: string
  glassesColor: string
  lipstickColor: string
  setHairColor: (color: string) => void
  setGlassesColor: (color: string) => void
  setLipstickColor: (color: string) => void
  randomize: () => void
  reset: () => void
}

const PortraitContext = createContext<PortraitStore | null>(null)

export function PortraitProvider({ children }: { children: ReactNode }) {
  const [hairColor, setHairColor] = useState<string>(DEFAULTS.hairColor)
  const [glassesColor, setGlassesColor] = useState<string>(DEFAULTS.glassesColor)
  const [lipstickColor, setLipstickColor] = useState<string>(DEFAULTS.lipstickColor)

  const randomize = useCallback(() => {
    const pick = () => COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)]
    setHairColor(pick())
    setGlassesColor(pick())
    setLipstickColor(pick())
  }, [])

  const reset = useCallback(() => {
    setHairColor(DEFAULTS.hairColor)
    setGlassesColor(DEFAULTS.glassesColor)
    setLipstickColor(DEFAULTS.lipstickColor)
  }, [])

  return (
    <PortraitContext.Provider
      value={{ hairColor, glassesColor, lipstickColor, setHairColor, setGlassesColor, setLipstickColor, randomize, reset }}
    >
      {children}
    </PortraitContext.Provider>
  )
}

export function usePortraitStore() {
  const ctx = useContext(PortraitContext)
  if (!ctx) throw new Error('usePortraitStore must be used within PortraitProvider')
  return ctx
}
