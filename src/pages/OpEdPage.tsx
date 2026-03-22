import { useState } from 'react'
import Checkbox from '@/components/ui/Checkbox'
import CheckboxField from '@/components/ui/CheckboxField'
import TabGroup from '@/components/ui/TabGroup'
import Field from '@/components/ui/Field'
import RangeSlider from '@/components/ui/RangeSlider'

export default function OpEdPage() {
  const [checked1, setChecked1] = useState(false)
  const [checked2, setChecked2] = useState(true)
  const [checkboxFieldChecked, setCheckboxFieldChecked] = useState(false)
  const [activeTab, setActiveTab] = useState('layout')
  const [fieldValue, setFieldValue] = useState('')
  const [sliderValue, setSliderValue] = useState(56)

  return (
    <div className="flex flex-col gap-64 px-24 py-48">
      <h1 className="text-display-large text-content-default">
        Component Test Page
      </h1>

      {/* Checkbox */}
      <section className="flex flex-col gap-16">
        <h2 className="text-label-large text-content-default">Checkbox</h2>
        <div className="flex gap-16 items-center">
          <Checkbox checked={checked1} onChange={setChecked1} />
          <Checkbox checked={checked2} onChange={setChecked2} />
        </div>
      </section>

      {/* Checkbox Field */}
      <section className="flex flex-col gap-16">
        <h2 className="text-label-large text-content-default">
          Checkbox Field
        </h2>
        <CheckboxField
          label="Option label"
          checked={checkboxFieldChecked}
          onChange={setCheckboxFieldChecked}
        />
      </section>

      {/* Tab Group */}
      <section className="flex flex-col gap-16">
        <h2 className="text-label-large text-content-default">Tab Group</h2>
        <div className="w-[400px]">
          <TabGroup
            tabs={[
              { label: 'LAYOUT', value: 'layout' },
              { label: 'IMAGE', value: 'image' },
              { label: 'TEXT', value: 'text' },
            ]}
            activeValue={activeTab}
            onChange={setActiveTab}
          />
        </div>
      </section>

      {/* Field */}
      <section className="flex flex-col gap-16">
        <h2 className="text-label-large text-content-default">Field</h2>
        <div className="w-[320px]">
          <Field
            placeholder="Text here"
            value={fieldValue}
            onChange={(e) => setFieldValue(e.target.value)}
          />
        </div>
      </section>

      {/* Range Slider */}
      <section className="flex flex-col gap-16">
        <h2 className="text-label-large text-content-default">
          Range Slider
        </h2>
        <div className="w-[320px]">
          <RangeSlider value={sliderValue} onChange={setSliderValue} />
        </div>
      </section>
    </div>
  )
}
