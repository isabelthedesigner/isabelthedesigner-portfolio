interface AdCanvasProps {
  layout: number
  image: string
  fullBleed: boolean
  headlineText: string
  headlineWeight: number
  headlineSize: 'sm' | 'md' | 'lg'
  headlineColor: string
  taglineText: string
  taglineWeight: number
  taglineColor: string
  onHeadlineChange: (text: string) => void
  onTaglineChange: (text: string) => void
}

const HEADLINE_SIZES = {
  sm: { fontSize: 40, lineHeight: 56 },
  md: { fontSize: 48, lineHeight: 64 },
  lg: { fontSize: 56, lineHeight: 80 },
} as const

const TAGLINE_STYLE = { fontSize: 30, lineHeight: 40 } as const

const showsTagline = (layout: number) => layout >= 2

function HeadlineEl({
  text,
  weight,
  size,
  color,
  onChange,
}: {
  text: string
  weight: number
  size: 'sm' | 'md' | 'lg'
  color: string
  onChange: (t: string) => void
}) {
  const s = HEADLINE_SIZES[size]
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="outline-none text-center w-full break-words"
      style={{
        fontFamily: '"Op-Ed Variable", "Op-Ed", serif',
        fontSize: s.fontSize,
        lineHeight: `${s.lineHeight}px`,
        fontWeight: weight,
        color,
      }}
      onInput={(e) => onChange(e.currentTarget.textContent ?? '')}
    >
      {text}
    </div>
  )
}

function TaglineEl({
  text,
  weight,
  color,
  onChange,
}: {
  text: string
  weight: number
  color: string
  onChange: (t: string) => void
}) {
  return (
    <div
      contentEditable
      suppressContentEditableWarning
      className="outline-none text-center w-full break-words"
      style={{
        fontFamily: '"Op-Ed Variable", "Op-Ed", serif',
        fontSize: TAGLINE_STYLE.fontSize,
        lineHeight: `${TAGLINE_STYLE.lineHeight}px`,
        fontWeight: weight,
        color,
      }}
      onInput={(e) => onChange(e.currentTarget.textContent ?? '')}
    >
      {text}
    </div>
  )
}

function ImageEl({ src }: { src: string }) {
  return (
    <img
      src={src}
      alt=""
      className="max-w-full max-h-full object-contain"
    />
  )
}

export default function AdCanvas(props: AdCanvasProps) {
  const {
    layout,
    image,
    fullBleed,
    headlineText,
    headlineWeight,
    headlineSize,
    headlineColor,
    taglineText,
    taglineWeight,
    taglineColor,
    onHeadlineChange,
    onTaglineChange,
  } = props

  const hasTagline = showsTagline(layout)

  const headline = (
    <HeadlineEl
      text={headlineText}
      weight={headlineWeight}
      size={headlineSize}
      color={headlineColor}
      onChange={onHeadlineChange}
    />
  )

  const tagline = hasTagline ? (
    <TaglineEl
      text={taglineText}
      weight={taglineWeight}
      color={taglineColor}
      onChange={onTaglineChange}
    />
  ) : null

  const imageSection = (
    <div className="flex-1 min-h-0 overflow-hidden flex items-center justify-center">
      <ImageEl src={image} />
    </div>
  )

  const textSection = (
    <div className="flex flex-col items-center justify-center gap-8 p-16">
      {headline}
      {tagline}
    </div>
  )

  const renderLayout = () => {
    switch (layout) {
      case 0:
        return (
          <>
            {textSection}
            {imageSection}
          </>
        )
      case 1:
        return (
          <>
            {imageSection}
            {textSection}
          </>
        )
      case 2:
        return (
          <>
            {textSection}
            {imageSection}
          </>
        )
      case 3:
        return (
          <>
            {imageSection}
            {textSection}
          </>
        )
      case 4: {
        const topText = (
          <div className="flex flex-col items-center justify-center gap-8 p-16">
            {headline}
          </div>
        )
        const bottomText = hasTagline ? (
          <div className="flex flex-col items-center justify-center gap-8 p-16">
            {tagline}
          </div>
        ) : null
        return (
          <>
            {topText}
            {imageSection}
            {bottomText}
          </>
        )
      }
      default:
        return null
    }
  }

  const innerContent = fullBleed ? (
    <div className="relative h-[84%] aspect-[77/96] border-2 border-border-default overflow-hidden">
      <img src={image} alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative inset-0 flex flex-col justify-end p-24 gap-8">
        {headline}
        {tagline}
      </div>
    </div>
  ) : (
    <div className="flex flex-col h-[84%] aspect-[77/96] border-2 border-border-default overflow-hidden p-16">
      {renderLayout()}
    </div>
  )

  return (
    <div className="w-full h-[575px] border-2 border-border-default bg-bg-default flex items-center justify-center p-24">
      {innerContent}
    </div>
  )
}
