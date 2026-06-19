import { useState } from 'react'
import TabGroup from '@/components/ui/TabGroup'
import CheckboxField from '@/components/ui/CheckboxField'
import ColorSwatch from '@/components/info/ColorSwatch'
import Field from '@/components/ui/Field'
import Icon from '@/components/ui/Icon'
import AdCanvas from './AdCanvas'
import tokens from '@/tokens/design-tokens.json'

const bg = tokens.semantic.color.bg

const AD_IMAGES = Array.from({ length: 8 }, (_, i) => `/images/op-ed/ad-creator-${i + 1}.png`)

const COLOR_OPTIONS = [
  { label: 'Dark Charcoal', value: bg.strong.value },
  { label: 'Eggshell', value: bg.default.value },
  { label: 'Red', value: bg.red.value },
  { label: 'Hot Pink', value: bg['hot-pink'].value },
  { label: 'Yellow', value: bg.yellow.value },
  { label: 'Teal', value: bg.teal.value },
  { label: 'Periwinkle', value: bg.periwinkle.value },
  { label: 'Electric Periwinkle', value: bg['electric-periwinkle'].value },
]

const WEIGHT_OPTIONS = [200, 300, 400, 600, 700] as const
const WEIGHT_FONT_WEIGHTS: Record<number, number> = {
  200: 200,
  300: 300,
  400: 400,
  600: 600,
  700: 700,
}

const SIZE_OPTIONS = [
  { key: 'sm' as const, fontSize: 36, lineHeight: 36 },
  { key: 'md' as const, fontSize: 48, lineHeight: 48 },
  { key: 'lg' as const, fontSize: 64, lineHeight: 64 },
]

const TABS = [
  { label: 'LAYOUT', value: 'layout' },
  { label: 'IMAGE', value: 'image' },
  { label: 'TEXT', value: 'text' },
]

/* ─── Layout thumbnail wireframe data ─── */

interface LayoutBlock {
  type: 'headline' | 'tagline' | 'image'
}

const LAYOUTS: LayoutBlock[][] = [
  [{ type: 'headline' }, { type: 'image' }],
  [{ type: 'image' }, { type: 'headline' }],
  [{ type: 'headline' }, { type: 'tagline' }, { type: 'image' }],
  [{ type: 'image' }, { type: 'headline' }, { type: 'tagline' }],
  [{ type: 'headline' }, { type: 'image' }, { type: 'tagline' }],
]

function LayoutThumbnail({
  blocks,
  selected,
  onClick,
}: {
  blocks: LayoutBlock[]
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="relative bg-bg-default border-2 border-border-default flex flex-col gap-8 aspect-[120/156] items-center p-8 w-full cursor-pointer"
    >
      {blocks.map((block, i) => {
        if (block.type === 'headline') {
          return (
            <div key={i} className="flex flex-col gap-4 w-full">
              <div className="bg-bg-strong h-[8px] w-full" />
              <div className="bg-bg-strong h-[8px] w-full" />
            </div>
          )
        }
        if (block.type === 'tagline') {
          return (
            <div key={i} className="flex flex-col gap-4 w-full items-center">
              <div className="bg-bg-strong h-[4px] w-full" />
              <div className="bg-bg-strong h-[4px] w-[60px]" />
            </div>
          )
        }
        return (
          <div
            key={i}
            className="flex-1 min-h-0 w-full border-2 border-border-default bg-bg-default flex items-center justify-center"
          >
            <Icon icon="Image" size={24} weight="fill" className="text-content-default" />
          </div>
        )
      })}
      {selected && (
        <span className="absolute bottom-[-2px] right-[-2px] inline-flex items-center justify-center size-24 border-2 border-border-default bg-bg-electric-periwinkle">
          <Icon icon="Checkmark" size={16} className="text-content-default-inverse" />
        </span>
      )}
    </button>
  )
}

function WeightOption({
  weight,
  selected,
  onClick,
}: {
  weight: number
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="relative bg-bg-default border-2 border-border-default flex flex-col h-[88px] items-center justify-center pb-8 pt-12 px-16 w-full cursor-pointer"
    >
      <span
        className="text-[64px] leading-[64px] text-center text-content-default"
        style={{
          fontFamily: '"Op-Ed Variable", "Op-Ed", serif',
          fontWeight: WEIGHT_FONT_WEIGHTS[weight],
        }}
      >
        Aa
      </span>
      {selected && (
        <span className="absolute bottom-[-2px] right-[-2px] inline-flex items-center justify-center size-24 border-2 border-border-default bg-bg-electric-periwinkle">
          <Icon icon="Checkmark" size={16} className="text-content-default-inverse" />
        </span>
      )}
    </button>
  )
}

function SizeOption({
  size,
  lineHeight,
  selected,
  onClick,
}: {
  size: number
  lineHeight: number
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="relative bg-bg-default border-2 border-border-default flex flex-col h-[88px] items-center justify-end pb-8 px-16 w-full cursor-pointer"
    >
      <span
        className="text-center text-content-default"
        style={{
          fontFamily: '"Op-Ed Variable", "Op-Ed", serif',
          fontSize: size,
          lineHeight: `${lineHeight}px`,
          fontWeight: 400,
        }}
      >
        Aa
      </span>
      {selected && (
        <span className="absolute bottom-[-2px] right-[-2px] inline-flex items-center justify-center size-24 border-2 border-border-default bg-bg-electric-periwinkle">
          <Icon icon="Checkmark" size={16} className="text-content-default-inverse" />
        </span>
      )}
    </button>
  )
}

function ImageOption({
  src,
  selected,
  onClick,
}: {
  src: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className="relative aspect-[120/156] w-full cursor-pointer overflow-hidden"
    >
      <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" />
      {selected && (
        <span className="absolute bottom-0 right-0 inline-flex items-center justify-center size-24 border-2 border-border-default bg-bg-electric-periwinkle">
          <Icon icon="Checkmark" size={16} className="text-content-default-inverse" />
        </span>
      )}
    </button>
  )
}

export default function AdCreator() {
  const [activeTab, setActiveTab] = useState('layout')
  const [selectedLayout, setSelectedLayout] = useState(4)
  const [selectedImage, setSelectedImage] = useState(0)
  const [fullBleed, setFullBleed] = useState(false)
  const [headlineWeight, setHeadlineWeight] = useState(400)
  const [headlineSize, setHeadlineSize] = useState<'sm' | 'md' | 'lg'>('sm')
  const [headlineColor, setHeadlineColor] = useState(bg.strong.value)
  const [taglineWeight, setTaglineWeight] = useState(400)
  const [taglineColor, setTaglineColor] = useState(bg.strong.value)
  const [headlineText, setHeadlineText] = useState('Your headline here')
  const [taglineText, setTaglineText] = useState('Your tagline here')

  const hasTagline = LAYOUTS[selectedLayout]?.some(b => b.type === 'tagline') ?? false

  return (
    <div className="flex flex-col md:flex-row gap-24 md:h-[575px]">
      {/* Canvas */}
      <div className="w-full md:w-[55%] desktop:w-[65%] xl:w-[65%]">
        <AdCanvas
          layout={selectedLayout}
          image={AD_IMAGES[selectedImage]}
          fullBleed={fullBleed}
          headlineText={headlineText}
          headlineWeight={headlineWeight}
          headlineSize={headlineSize}
          headlineColor={headlineColor}
          taglineText={taglineText}
          taglineWeight={taglineWeight}
          taglineColor={taglineColor}
        />
      </div>

      {/* Controls */}
      <div className="w-full md:w-[45%] desktop:w-[35%] xl:w-[35%] flex flex-col min-h-0">
        <TabGroup
          tabs={TABS}
          activeValue={activeTab}
          onChange={setActiveTab}
        />

        <div className="border-2 border-border-default border-t-0 p-24 overflow-y-auto flex-1 min-h-0">
          {/* LAYOUT tab */}
          {activeTab === 'layout' && (
            <div className="flex flex-col gap-24">
              <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-16 md:grid-cols-3">
                {LAYOUTS.map((blocks, i) => (
                  <LayoutThumbnail
                    key={i}
                    blocks={blocks}
                    selected={selectedLayout === i}
                    onClick={() => setSelectedLayout(i)}
                  />
                ))}
              </div>
              <CheckboxField
                label="Full bleed image"
                checked={fullBleed}
                onChange={setFullBleed}
              />
            </div>
          )}

          {/* IMAGE tab */}
          {activeTab === 'image' && (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-16 md:grid-cols-3">
              {AD_IMAGES.map((src, i) => (
                <ImageOption
                  key={i}
                  src={src}
                  selected={selectedImage === i}
                  onClick={() => setSelectedImage(i)}
                />
              ))}
            </div>
          )}

          {/* TEXT tab */}
          {activeTab === 'text' && (
            <div className="flex flex-col gap-36">
              {/* Headline Text */}
              <div className="flex flex-col gap-16">
                <p className="text-label-medium text-content-default">
                  HEADLINE TEXT
                </p>
                <Field
                  type="text"
                  value={headlineText}
                  onChange={(e) => setHeadlineText(e.target.value)}
                  placeholder="Your headline here"
                />
              </div>

              {/* Headline Color */}
              <div className="flex flex-col gap-16">
                <p className="text-label-medium text-content-default">
                  HEADLINE COLOR
                </p>
                <div className="flex flex-wrap gap-16">
                  {COLOR_OPTIONS.map((c) => (
                    <ColorSwatch
                      key={`hc-${c.value}`}
                      color={c.value}
                      isSelected={headlineColor === c.value}
                      onClick={() => setHeadlineColor(c.value)}
                    />
                  ))}
                </div>
              </div>

              {/* Headline Size */}
              <div className="flex flex-col gap-16">
                <p className="text-label-medium text-content-default">
                  HEADLINE SIZE
                </p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-12 md:grid-cols-3">
                  {SIZE_OPTIONS.map((opt) => (
                    <SizeOption
                      key={opt.key}
                      size={opt.fontSize}
                      lineHeight={opt.lineHeight}
                      selected={headlineSize === opt.key}
                      onClick={() => setHeadlineSize(opt.key)}
                    />
                  ))}
                </div>
              </div>

              {/* Headline Font Weight */}
              <div className="flex flex-col gap-16">
                <p className="text-label-medium text-content-default">
                  HEADLINE FONT WEIGHT
                </p>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-16 md:grid-cols-3">
                  {WEIGHT_OPTIONS.map((w) => (
                    <WeightOption
                      key={`hw-${w}`}
                      weight={w}
                      selected={headlineWeight === w}
                      onClick={() => setHeadlineWeight(w)}
                    />
                  ))}
                </div>
              </div>

              {hasTagline && (
                <>
                  {/* Tagline Text */}
                  <div className="flex flex-col gap-16">
                    <p className="text-label-medium text-content-default">
                      TAGLINE TEXT
                    </p>
                    <Field
                      type="text"
                      value={taglineText}
                      onChange={(e) => setTaglineText(e.target.value)}
                      placeholder="Your tagline here"
                    />
                  </div>

                  {/* Tagline Color */}
                  <div className="flex flex-col gap-16">
                    <p className="text-label-medium text-content-default">
                      TAGLINE COLOR
                    </p>
                    <div className="flex flex-wrap gap-16">
                      {COLOR_OPTIONS.map((c) => (
                        <ColorSwatch
                          key={`tc-${c.value}`}
                          color={c.value}
                          isSelected={taglineColor === c.value}
                          onClick={() => setTaglineColor(c.value)}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Tagline Font Weight */}
                  <div className="flex flex-col gap-16">
                    <p className="text-label-medium text-content-default">
                      TAGLINE FONT WEIGHT
                    </p>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(72px,1fr))] gap-16 md:grid-cols-3">
                      {WEIGHT_OPTIONS.map((w) => (
                        <WeightOption
                          key={`tw-${w}`}
                          weight={w}
                          selected={taglineWeight === w}
                          onClick={() => setTaglineWeight(w)}
                        />
                      ))}
                    </div>
                  </div>
                </>
              )}

            </div>
          )}
        </div>
      </div>
    </div>
  )
}
