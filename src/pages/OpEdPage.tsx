import Badge from '@/components/ui/Badge'
import Image from '@/components/ui/Image'
import FontPreview from '@/components/op-ed/FontPreview'
import AdCreator from '@/components/op-ed/AdCreator'

const FEATURE_CARDS = [
  {
    image: '/images/op-ed/op-ed_case-study-1.png',
    caption: 'Elevated crossbars and strokes',
  },
  {
    image: '/images/op-ed/op-ed_case-study-2.png',
    caption: 'Curved, calligraphic serifs',
  },
  {
    image: '/images/op-ed/op-ed_case-study-3.png',
    caption: 'Extended language support',
  },
] as const

export default function OpEdPage() {
  return (
    <section className="flex flex-col gap-48 px-24 pt-24 pb-80">
      {/* Hero + Feature Cards */}
      <div className="flex flex-col gap-48">
        {/* Title + Badge */}
        <div className="flex flex-col gap-24">
          <h1 className="text-headline-large-mobile md:text-headline-large text-content-default">
            Op-ed, a semi-condensed serif typeface
          </h1>
          <div className="flex items-center">
            <Badge variant="hot-pink">Type Design</Badge>
          </div>
        </div>

        {/* Intro paragraph */}
        <p className="text-body-default text-content-default">
          Inspired by the typography that defined 70s and 80s newspapers and magazines, Op-ed is a
          semi-condensed typeface with curved serifs and nostalgic charm. It embodies the sleek yet
          playful visual style of that era. These typefaces often balanced elegance with boldness,
          using decorative serifs and compact forms for impactful headlines. Op-ed channels this
          aesthetic, blending classic editorial sophistication with a contemporary design for
          versatile applications.
        </p>

        {/* Features and characteristics */}
        <div className="flex flex-col gap-36">
          <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
            Features and characteristics
          </h2>

          {/* Feature Cards */}
          <div className="grid w-full gap-40 grid-cols-1 md:grid-cols-3">
            {FEATURE_CARDS.map((card) => (
              <div
                key={card.caption}
                className="bg-bg-default border-2 border-border-default flex flex-col gap-24 items-center justify-center p-24 min-w-0"
              >
                <div className="relative w-full aspect-[1280/1024]">
                  <Image
                    src={card.image}
                    alt={card.caption}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <p className="text-body-default text-content-default text-center w-full">
                  {card.caption}
                </p>
              </div>
            ))}
          </div>

          {/* Additional features */}
          <div className="flex flex-col gap-24">
            <h3 className="text-headline-small-mobile md:text-headline-small text-content-default">
              Additional features
            </h3>
            <ul className="text-body-default text-content-default list-disc ml-[30px] flex flex-col gap-0">
              <li>5 font weights (Extra Light, Light, Regular, Semibold, Bold)</li>
              <li>Variable font</li>
            </ul>
            <p className="text-body-default text-content-default">
              Planned features include additional glyphs, italic variants
            </p>
          </div>
        </div>
      </div>

      {/* Ad Creator */}
      <div className="flex flex-col gap-36">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          Create your own advertisement with Op-ed
        </h2>
        <AdCreator />
      </div>

      {/* Font Preview */}
      <div className="flex flex-col gap-36">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          Font preview
        </h2>
        <FontPreview />
      </div>
    </section>
  )
}
