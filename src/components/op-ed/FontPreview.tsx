import { useState } from 'react'
import IconButton from '@/components/ui/IconButton'
import Field from '@/components/ui/Field'
import RangeSlider from '@/components/ui/RangeSlider'
import TabGroup from '@/components/ui/TabGroup'

const WEIGHT_TABS = [
  { label: '200', value: '200' },
  { label: '300', value: '300' },
  { label: '400', value: '400' },
  { label: '600', value: '600' },
  { label: '700', value: '700' },
]

const WEIGHT_VALUES = [200, 300, 400, 600, 700]

const DEFAULT_TEXT =
  'A quick brown fox jumped over the lazy dog and the fox ended up on a sidewalk next to a snail'

export default function FontPreview() {
  const [fontSize, setFontSize] = useState(56)
  const [fontWeight, setFontWeight] = useState(400)

  const activeWeightTab = WEIGHT_VALUES.includes(fontWeight)
    ? String(fontWeight)
    : ''

  const handleFontSizeInput = (val: string) => {
    const num = parseInt(val, 10)
    if (!isNaN(num)) {
      setFontSize(Math.min(300, Math.max(8, num)))
    } else if (val === '') {
      setFontSize(8)
    }
  }

  return (
    <div className="flex flex-col gap-48">
      <div className="flex flex-col md:flex-row gap-48 items-start">
        {/* Font size controls */}
        <div className="flex flex-col gap-16 shrink-0 w-full md:w-auto">
          <p className="text-label-medium text-content-default">FONT SIZE</p>
          <div className="flex flex-wrap items-center gap-36">
            <div className="flex items-center gap-8">
              <IconButton
                icon="Minus"
                variant="secondary"
                aria-label="Decrease font size"
                onClick={() => setFontSize((s) => Math.max(8, s - 1))}
              />
              <Field
                type="text"
                inputMode="numeric"
                className="!w-[72px] text-center"
                value={fontSize}
                onChange={(e) => handleFontSizeInput(e.target.value)}
                onBlur={() => {
                  if (fontSize < 8) setFontSize(8)
                  if (fontSize > 300) setFontSize(300)
                }}
                aria-label="Font size"
              />
              <IconButton
                icon="Plus"
                variant="secondary"
                aria-label="Increase font size"
                onClick={() => setFontSize((s) => Math.min(300, s + 1))}
              />
            </div>
            <div className="w-[160px]">
              <RangeSlider
                min={8}
                max={300}
                value={fontSize}
                onChange={setFontSize}
                showIndicators={false}
              />
            </div>
          </div>
        </div>

        {/* Font weight controls */}
        <div className="flex flex-col gap-16 flex-1 min-w-0 w-full md:w-auto">
          <p className="text-label-medium text-content-default">FONT WEIGHT</p>
          <div className="flex flex-wrap items-center gap-36">
            <TabGroup
              tabs={WEIGHT_TABS}
              activeValue={activeWeightTab}
              onChange={(val) => setFontWeight(Number(val))}
            />
            <RangeSlider
              min={200}
              max={700}
              value={fontWeight}
              onChange={setFontWeight}
              showIndicators={true}
            />
          </div>
        </div>
      </div>

      {/* Preview text */}
      <div
        contentEditable
        suppressContentEditableWarning
        className="text-content-default outline-none w-full break-words"
        style={{
          fontFamily: '"Op-Ed Variable", "Op-Ed", serif',
          fontSize: `${fontSize}px`,
          fontWeight,
          lineHeight: 1.43,
        }}
      >
        {DEFAULT_TEXT}
      </div>
    </div>
  )
}
