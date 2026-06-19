import Badge from '@/components/ui/Badge'
import Alert from '@/components/ui/Alert'
import Icon, { type IconName } from '@/components/ui/Icon'

const PROBLEMS = [
  {
    label: 'PROBLEM #1',
    text: 'With no clear guidance, teams were wondering what the best practices were for implementing animation',
  },
  {
    label: 'PROBLEM #2',
    text: 'It created inconsistent experiences that confused users across products',
  },
  {
    label: 'PROBLEM #3',
    text: 'It widened the gap between design intent and engineering implementation',
  },
] as const

const PRINCIPLES = [
  {
    title: 'Emergence over Entrance',
    description: 'Elements grow into place rather than simply fading or sliding in',
    video: '/images/leaf-motion/emergence-over-entrance.mp4',
  },
  {
    title: 'Rooted Movement',
    description:
      'Components expand from a defined anchor point as though connected to the interface',
    video: '/images/leaf-motion/rooted-movement.mp4',
  },
  {
    title: 'Layered Unfurling',
    description: 'Complex elements reveal progressively in stages like leaves opening one at a time',
    video: '/images/leaf-motion/layered-unfurling.mp4',
  },
  {
    title: 'Breathing Rhythm',
    description: 'Subtle loops and micro animations give a sense of life and continuity',
    video: '/images/leaf-motion/breathing-rhythm.mp4',
  },
  {
    title: 'Gentle Settling',
    description: 'Motion eases out naturally with soft deceleration instead of abrupt stops',
    video: '/images/leaf-motion/gentle-settling.mp4',
  },
] as const

const LIFECYCLE_STAGES: {
  icon: IconName
  name: string
  description: string
  tokens: string[]
}[] = [
  {
    icon: 'Plant',
    name: 'Sprout',
    description: 'Entrance motions like sprout, root, and branch that convey emergence',
    tokens: ['--leaf-motion-sprout', '--leaf-motion-root', '--leaf-motion-branch'],
  },
  {
    icon: 'Tree',
    name: 'Canopy',
    description: 'Active states like bloom, unfurl, and sway that show maturity and interaction',
    tokens: [
      '--leaf-motion-unfurl',
      '--leaf-motion-emerge',
      '--leaf-motion-sway',
      '--leaf-motion-bloom-*',
      '--leaf-motion-pulse-*',
      '--leaf-motion-lift-*',
    ],
  },
  {
    icon: 'Leaf',
    name: 'Fall',
    description: 'Exit motions like settle, fade, and return that suggest completion and rest',
    tokens: [
      '--leaf-motion-fade',
      '--leaf-motion-return',
      '--leaf-motion-layer-soften',
      '--leaf-motion-shed',
    ],
  },
]

const COMPONENT_DEMOS = [
  {
    video: '/images/leaf-motion/leaf-accordion.mp4',
    tokens: ['--leaf-motion-unfurl (expand)', '--leaf-motion-return (collapse)'],
  },
  {
    video: '/images/leaf-motion/leaf-button.mp4',
    tokens: ['--leaf-motion-bloom-hover', '--leaf-motion-bloom-pressed'],
  },
  {
    video: '/images/leaf-motion/leaf-checkbox.mp4',
    tokens: ['--leaf-motion-bloom-pressed'],
  },
  {
    video: '/images/leaf-motion/leaf-modal.mp4',
    tokens: ['--leaf-motion-sprout (open)', '--leaf-motion-return (close)'],
  },
] as const

const CIGNA_CLIPS = [
  {
    video: '/images/leaf-motion/chc-2.0_app-intro.mp4',
    caption: 'App launch, where the logo sprouts in and dashboard cards unfurl and settle into place.',
  },
  {
    video: '/images/leaf-motion/chc-2.0_conversation-module.mp4',
    caption: 'An AI conversation carries a user from a weight loss question to a booked lab appointment, with cards unfurling, buttons and radio fields blooming and transitions easing between each step.',
  },
] as const

export default function LeafMotion() {
  return (
    <section className="flex flex-col gap-48 px-24 pt-24 pb-80">
      {/* Title + Badges */}
      <div className="flex flex-col gap-24">
        <h1 className="text-headline-large-mobile md:text-headline-large text-content-default">
          Bringing care to interaction: creating a motion token system for Leaf Design System
        </h1>
        <div className="flex flex-wrap items-center gap-8">
          <Badge variant="yellow">UX</Badge>
          <Badge variant="periwinkle">Design Systems</Badge>
          <Badge variant="electric-periwinkle">Animation</Badge>
        </div>
      </div>

      {/* Alert */}
      <Alert>
        This project is in progress. The motion language is fully planned with implementation still
        ahead.
      </Alert>

      {/* Intro */}
      <div className="flex flex-col gap-24">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          Building a motion language that scales across design and engineering
        </h2>
        <p className="text-body-default text-content-default">
          Designers and engineers were improvising animations case by case, recreating similar
          motion patterns from scratch across products. This created inconsistent user experiences,
          duplicated effort, and a widening gap between how something was designed and how it
          shipped.
        </p>
      </div>

      {/* Motion was an afterthought */}
      <div className="flex flex-col gap-36">
        <div className="flex flex-col gap-24">
          <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
            Motion was an afterthought, if one at all
          </h2>
          <p className="text-body-default text-content-default">
            Leaf gives guidance for things like color, type and spacing but said nothing about how
            things should move.
          </p>
        </div>
        <div className="flex flex-col gap-36">
          {PROBLEMS.map((problem) => (
            <div key={problem.label} className="flex flex-col items-start gap-8">
              <Badge variant="subtle">{problem.label}</Badge>
              <p className="text-body-default text-content-default">{problem.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Three decisions */}
      <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
        Three decisions: what good motion is, how to structure it, and how to ship it
      </h2>

      {/* Decision #1 */}
      <div className="flex flex-col gap-36">
        <div className="flex flex-col gap-24">
          <div className="flex flex-col items-start gap-8">
            <Badge variant="electric-periwinkle">DECISION #1</Badge>
            <h3 className="text-headline-small-mobile md:text-headline-small text-content-default">
              Establishing principles to ground design decisions
            </h3>
          </div>
          <p className="text-body-default text-content-default">
          Tokens alone wouldn't solve consistency. Teams needed a way to judge whether an animation was right for the brand, and it had to work across The Cigna Group and its brands like Cigna Healthcare and Evernorth. So I defined five guiding principles grounded in Growth &amp; Lifecycle, a shared way to measure motion decisions instead of leaning on personal preference.
          </p>
        </div>

        {/* The five guiding principles */}
        <div className="flex flex-col gap-36">
          <h4 className="text-title-large-mobile md:text-title-large text-content-default">
            The five guiding principles
          </h4>
          <div className="flex flex-col gap-24">
            {PRINCIPLES.map((principle) => (
              <div
                key={principle.title}
                className="flex flex-col md:flex-row md:items-center gap-36 border-2 border-border-default bg-bg-default p-24"
              >
                <div className="relative aspect-[183/110] w-full md:w-[183px] md:shrink-0 border-2 border-border-default">
                  <video
                    src={principle.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-8 md:flex-1">
                  <p className="text-title-default-strong text-content-default">
                    {principle.title}
                  </p>
                  <p className="text-body-default text-content-default">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision #2 */}
      <div className="flex flex-col gap-36">
        <div className="flex flex-col gap-24">
          <div className="flex flex-col items-start gap-8">
            <Badge variant="electric-periwinkle">DECISION #2</Badge>
            <h3 className="text-headline-small-mobile md:text-headline-small text-content-default">
              Building a three tier token architecture organized by lifecycle
            </h3>
          </div>
          <p className="text-body-default text-content-default">
            I researched technical approaches through resources like Smashing Magazine's animation
            systems article and the Animation on the Web course to understand what makes motion
            systems usable. I developed a three tier architecture: global primitives (e.g. duration,
            easing, stagger) and semantic tokens organized by lifecycle stage. The semantic layer
            follows the growth metaphor with Sprout for entrance, Canopy for active states, and Fall
            for exits. This structure gave engineers flexibility while maintaining design
            consistency.
          </p>
        </div>

        {/* The three lifecycle stages */}
        <div className="flex flex-col gap-36">
          <h4 className="text-title-large-mobile md:text-title-large text-content-default">
            The three lifecycle stages
          </h4>
          <div className="grid grid-cols-1 gap-40 md:grid-cols-3">
            {LIFECYCLE_STAGES.map((stage) => (
              <div
                key={stage.name}
                className="flex flex-col gap-24 border-2 border-border-default bg-bg-default p-24"
              >
                <div className="flex flex-col items-start gap-8">
                  <Icon
                    icon={stage.icon}
                    size={40}
                    weight="regular"
                    className={`text-content-default ${stage.name === 'Fall' ? '-scale-y-100' : ''}`}
                  />
                  <p className="text-title-large-strong-mobile md:text-title-large-strong text-content-default">
                    {stage.name}
                  </p>
                </div>
                <p className="text-body-default text-content-default">{stage.description}</p>
                <div className="text-body-small-mono text-content-default flex flex-col">
                  {stage.tokens.map((token) => (
                    <p key={token}>{token}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Decision #3 */}
      <div className="flex flex-col gap-24">
        <div className="flex flex-col items-start gap-8">
          <Badge variant="electric-periwinkle">DECISION #3</Badge>
          <h3 className="text-headline-small-mobile md:text-headline-small text-content-default">
            Delivering for both Figma and our codebase
          </h3>
        </div>
        <p className="text-body-default text-content-default">
          The people prototyping with Leaf sit across a wide range of comfort with code. At one end
          are design engineers who prototype directly in Cursor. At the other are designers who work
          mostly in Figma because they are not comfortable in code, along with people outside the
          design team who use Figma Make to put prototypes together. The system has to meet all of
          them, so it is delivered three ways:
        </p>
        <ul className="text-body-default text-content-default list-disc ml-[30px] flex flex-col gap-0">
          <li>
            <span className="text-body-default-strong">
              Motion wired into Figma Make through a skills file or Make Kits
            </span>{' '}
            so designers and non-designers prototyping with AI get the system without having to
            touch code.
          </li>
          <li>
            <span className="text-body-default-strong">
              Animation tokens implemented directly in the codebase
            </span>
            , so design engineers and developers prototyping in Cursor get the system natively as
            they build.
          </li>
          <li>
            <span className="text-body-default-strong">
              Clear documentation especially for teams still migrating to Leaf
            </span>
            , so they can adopt motion the Leaf way without waiting on full migration as well as to
            show how the principles and tokens apply at the molecular and page levels
          </li>
        </ul>
        <p className="text-body-default text-content-default">
          I plan to lead the code implementation myself, which keeps the system moving without
          competing for limited engineering resources.
        </p>
      </div>

      {/* Component demos */}
      <div className="grid grid-cols-1 gap-40 md:grid-cols-2">
        {COMPONENT_DEMOS.map((demo) => (
          <div key={demo.video} className="flex flex-col gap-16 bg-bg-default">
            <div className="relative aspect-[1300/1000] w-full border-2 border-border-default">
              <video
                src={demo.video}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="text-body-small-mono text-content-default flex flex-col">
              {demo.tokens.map((token) => (
                <p key={token}>{token}</p>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Cigna Healthcare clips */}
      {CIGNA_CLIPS.map((clip) => (
        <figure key={clip.video} className="flex flex-col gap-16">
          <div className="relative w-full aspect-[3/5] sm:aspect-[2/3] md:aspect-[4/3] lg:aspect-[16/9]">
            <video
              src={clip.video}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <figcaption className="text-body-default-italic text-content-default">
            {clip.caption}
          </figcaption>
        </figure>
      ))}

      {/* Validation and next steps */}
      <div className="flex flex-col gap-24">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          Validation and next steps
        </h2>
        <p className="text-body-default text-content-default">
          Before the project paused, I socialized the system with the people who would use it and
          the early feedback confirmed the core bet: a shared vocabulary gave people a way to reason
          about motion together rather than each person improvising.
        </p>
        <ul className="text-body-default text-content-default list-disc ml-[30px] flex flex-col gap-0">
          <li>
            <span className="text-body-default-strong">
              Shared the prototypes with other designers
            </span>{' '}
            and refined the animations based on their feedback.
          </li>
          <li>
            <span className="text-body-default-strong">
              Got preliminary feedback from engineering
            </span>{' '}
            on the token architecture.
          </li>
        </ul>
        <p className="text-body-default text-content-default">
          The project is currently paused while the team prioritizes other efforts, with
          implementation expected to resume later this year or early next year. The next phase:
        </p>
        <ul className="text-body-default text-content-default list-disc ml-[30px] flex flex-col gap-0">
          <li>
            <span className="text-body-default-strong">
              Build the system into Figma and codebase
            </span>
            , and validate it against real product surfaces.
          </li>
          <li>
            <span className="text-body-default-strong">Review with our accessibility team</span>,
            since organizing motion in semantic tokens means a reduced motion preference can resolve
            at the token level rather than per component.
          </li>
        </ul>
      </div>
    </section>
  )
}
