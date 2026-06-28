export type BootLine =
  | { label: string }                  // renders "> <label> ····· ok"
  | { label: string; progress: true }  // the live Spline load bar

export interface BootBlock {
  subtitle: string
  lines: BootLine[]
  close: string
}

export const WORDMARK = 'isabel//os'

export const BOOT_BLOCKS: BootBlock[] = [
  {
    subtitle: 'ux · design systems · type · 3d · motion',
    lines: [
      { label: 'link component library' },
      { label: 'decode design tokens' },
      { label: 'load geometry [spline]', progress: true },
      { label: 'init motion system' },
      { label: 'resolve type [op-ed]' },
    ],
    close: 'ready_',
  },
  {
    subtitle: 'taking complex problems and turning them into clear, practical solutions',
    lines: [
      { label: 'mount design system' },
      { label: 'cast type [glyphs → op-ed]' },
      { label: 'load geometry [spline]', progress: true },
      { label: 'build runtime [cursor]' },
      { label: 'check contrast [wcag]' },
    ],
    close: 'welcome_',
  },
  {
    subtitle: 'visual craft, strategic thinking, code fluency',
    lines: [
      { label: 'resolve tokens + components' },
      { label: 'setting type in op-ed' },
      { label: 'load geometry [spline]', progress: true },
      { label: 'connect eng + product' },
      { label: 'init motion + interaction' },
    ],
    close: 'let’s gooooo_',
  },
]

// Pick a block, avoiding the one shown last (persisted across sessions).
export function pickBlockIndex(count = BOOT_BLOCKS.length): number {
  const key = 'boot:lastBlock'
  let last = -1
  try { last = Number(localStorage.getItem(key)) } catch {}
  let idx = Math.floor(Math.random() * count)
  if (count > 1 && idx === last) idx = (idx + 1) % count
  try { localStorage.setItem(key, String(idx)) } catch {}
  return idx
}
