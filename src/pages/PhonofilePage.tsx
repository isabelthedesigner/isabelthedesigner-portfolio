import Badge from '@/components/ui/Badge'
import Alert from '@/components/ui/Alert'

const GAPS = [
  {
    issue: 'ISSUE #1',
    subtitle: 'You find out you own it when you get home',
    cta: 'CHECK BEFORE YOU BUY',
    description:
      'Check your collection from the store to make sure you never accidentally buy Rumours for the third time.',
  },
  {
    issue: 'ISSUE #2',
    subtitle: 'Every new item is a chore',
    cta: 'POINT, SCAN, DONE',
    description:
      'Cataloging manually is tedious. Barcode scanning removes almost all of the friction.',
  },
  {
    issue: 'ISSUE #3',
    subtitle: 'A collection full of data, none of it visible',
    cta: 'SEE WHAT YOU ACTUALLY OWN',
    description:
      'A collection built over years contains patterns worth surfacing: dominant genres, format habits, gaps in a discography',
  },
] as const

const UPCOMING_FEATURES = [
  {
    title: 'Collection stats',
    description:
      ': Surface insights like most collected artist, format breakdown, collection value estimate via Discogs pricing data',
  },
  {
    title: 'Want list',
    description: ": Keep track of a running list for next time you're at the store",
  },
  {
    title: 'New release notifications',
    description:
      ": Get notified when an artist is releasing a new album or Record Store Day exclusive so you don't miss out on getting that special vinyl variant or cassette.",
  },
  {
    title: 'Collector score and achievement system',
    description:
      ': Earn badges for collection milestones and a score based on rarity and diversity',
  },
  {
    title: 'Smart discovery',
    description:
      ': Get recommendations for completing discographies and artists and albums you may be interested in based on your collection.',
  },
] as const

export default function PhonofilePage() {
  return (
    <section className="flex flex-col gap-56 px-24 pt-24 pb-80">
      {/* Title + Badges */}
      <div className="flex flex-col gap-24">
        <h1 className="text-headline-large-mobile md:text-headline-large text-content-default">
          Phonofile, a physical music catalog app
        </h1>
        <div className="flex flex-wrap items-center gap-8">
          <Badge variant="yellow">UX</Badge>
          <Badge variant="periwinkle">Design Systems</Badge>
          <Badge variant="electric-periwinkle">Animation</Badge>
          <Badge variant="red">3D</Badge>
        </div>
      </div>

      {/* Alert */}
      <Alert>This project is actively in design and development.</Alert>

      {/* Intro */}
      <div className="flex flex-col gap-36">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          A mobile app for folks who buy too much music and aren't sorry about it
        </h2>
        <p className="text-body-default text-content-default">
          My husband and I have a large physical music collection (vinyl, CDs, cassettes and even a
          few 8-tracks). Every time I walk into a record store, I have the same problem: I find
          something I might already own, and I have no quick way to check. I've definitely bought
          (and had to return 😐) an album more than once. Phonofile is my answer to that problem: a
          mobile app for cataloging physical music collections so you always know what you have
          before you buy it again (and again).
        </p>
      </div>

      {/* Video: views */}
      <figure className="flex flex-col gap-16">
        <div className="relative w-full aspect-[3/5] sm:aspect-[2/3] md:aspect-[4/3] lg:aspect-[16/9]">
          <video
            src="/images/phonofile/phonofile_views.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <figcaption className="text-body-default-italic text-content-default">
          Two ways to look at what you own
        </figcaption>
      </figure>

      {/* The gaps that Phonofile fills */}
      <div className="flex flex-col gap-36">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          The gaps that Phonofile fills
        </h2>
        <div className="flex flex-col gap-56">
          {GAPS.map((gap) => (
            <div key={gap.issue} className="flex flex-col gap-24">
              <div className="flex flex-col gap-8 items-start">
                <Badge variant="subtle">{gap.issue}</Badge>
                <p className="text-body-default text-content-default">{gap.subtitle}</p>
              </div>
              <div className="flex flex-col gap-8 items-start">
                <Badge variant="electric-periwinkle">{gap.cta}</Badge>
                <p className="text-title-large-mobile md:text-title-large text-content-default">
                  {gap.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video: onboarding */}
      <figure className="flex flex-col gap-16">
        <div className="relative w-full aspect-[3/5] sm:aspect-[2/3] md:aspect-[4/3] lg:aspect-[16/9]">
          <video
            src="/images/phonofile/phonofile_onboarding.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <figcaption className="text-body-default-italic text-content-default">
          Scan the barcode, the rest fills in.
        </figcaption>
      </figure>

      {/* Video: theme switcher */}
      <figure className="flex flex-col gap-16">
        <div className="relative w-full aspect-[3/5] sm:aspect-[2/3] md:aspect-[4/3] lg:aspect-[16/9]">
          <video
            src="/images/phonofile/phonofile_theme-switcher-bg.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <figcaption className="text-body-default-italic text-content-default">
          Your collection, your color
        </figcaption>
      </figure>

      {/* Upcoming features */}
      <div className="flex flex-col gap-36">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          Upcoming features
        </h2>
        <ul className="text-body-default text-content-default list-disc ml-[30px] flex flex-col gap-0">
          {UPCOMING_FEATURES.map((feature) => (
            <li key={feature.title}>
              <span className="text-body-default-strong">{feature.title}</span>
              {feature.description}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
