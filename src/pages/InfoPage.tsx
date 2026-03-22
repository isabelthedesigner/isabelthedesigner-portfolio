import { PortraitProvider } from '@/hooks/usePortraitStore'
import PortraitColorPicker from '@/components/info/PortraitColorPicker'
import FunFactCard from '@/components/info/FunFactCard'
import TypewriterText from '@/components/ui/TypewriterText'

const FUN_FACTS = [
  {
    image: '/images/info/fun-fact-1.png',
    text: 'I have seen both Fall Out Boy and Billy Joel live over ten times.',
  },
  {
    image: '/images/info/fun-fact-2.png',
    text: "I make a mean cup of Cuban coffee (it's in my blood).",
  },
  {
    image: '/images/info/fun-fact-3.png',
    text: 'I am a skincare junkie, feel free to ask me about my routine.',
  },
] as const

export default function InfoPage() {
  return (
    <PortraitProvider>
      <section className="flex flex-col gap-36 px-24 pt-24 pb-80">
        {/* Title */}
        <TypewriterText
            className="text-headline-medium-mobile md:text-headline-medium text-content-default"
            startTyping={true}
            disabled={false}
          >
            First things first: make me look cool.
          </TypewriterText>

        {/* Portrait + Color Picker */}
        <PortraitColorPicker />

        {/* Bio */}
        <div className="flex flex-col gap-36">
          <p className="text-headline-medium-mobile md:text-headline-medium text-content-default">
            Hi, I'm Isabel. In my current ux designer role, I specialize in design systems, with a
            focus on building tools that help teams work faster, more consistently, and at scale.
          </p>

          <div className="flex flex-col gap-36">
            <p className="text-body-default text-content-default">
              I'm known for taking complex problems and turning them into clear, practical solutions.
              I love digging into messy systems work, collaborating across teams, and finding smart
              ways to improve how people build and use design. I bring a balance of visual craft,
              strategic mindset, and implementation fluency that allows me to connect the dots between
              design, engineering, and product goals.
            </p>
            <p className="text-body-default text-content-default">
              Type design, 3D, and animation are creative spaces where I experiment, stay curious, and
              uncover insights that inform and elevate my product design work.
            </p>
          </div>
        </div>

        {/* Fun Facts */}
        <div className="flex flex-col gap-36">
          <h2 className="text-headline-small-mobile md:text-headline-small text-content-default">
            Here are some fun facts about me (scratch to reveal!)
          </h2>

          <div
            className="mx-auto grid w-full max-w-[1440px] gap-40 grid-cols-1 md:grid-cols-3"
            style={{ gridTemplateColumns: 'repeat(auto-fill, 1fr))' }}
          >
            {FUN_FACTS.map((fact) => (
              <FunFactCard key={fact.image} image={fact.image} text={fact.text} />
            ))}
          </div>
        </div>
      </section>
    </PortraitProvider>
  )
}
