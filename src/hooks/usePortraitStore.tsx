import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export const COLOR_PALETTE = [
  '#d10000',  // Red
  '#DE2BC0',  // Pink
  '#FFCA41',  // Yellow
  '#04E1B2',  // Teal
  '#6781FF',  // Periwinkle
  '#4600EC',  // Electric Periwinkle
] as const

const DEFAULTS = {
  hairColor: '#6781FF',
  glassesColor: '#FFCA41',
  lipstickColor: '#d10000',
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
