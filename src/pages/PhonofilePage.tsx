import Badge from '@/components/ui/Badge'
import Alert from '@/components/ui/Alert'
import LazyVideo from '@/components/ui/LazyVideo'

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
    <section className="flex flex-col gap-48 px-24 pt-24 pb-80">
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
      <div className="flex flex-col gap-24">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          A mobile app for folks who buy too much music and aren't sorry about it
        </h2>
        <p className="text-body-default text-content-default">
          My husband and I have a large physical music collection (vinyl, CDs, cassettes and even a
          few 8-tracks). Every time I walk into a record store, I have the same problem: I find
          something I might already own, and I have no quick way to check. I've definitely bought
          (and had to go back and return 😐) an album more than once. Phonofile is my answer to that problem: a
          mobile app for cataloging physical music collections so you always know what you have
          before you buy it again (and again).
        </p>
      </div>

      {/* Do I already own this? */}
      <div className="flex flex-col gap-24">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          "Do I already own this?"
        </h2>
        <p className="text-body-default text-content-default">
          Phonofile is built to answer that question before you reach the register. That shaped two views: a list view for scanning a lot of titles at once, and a stack view for browsing by cover.
        </p>
      </div>

      {/* Video: views */}
      <figure className="flex flex-col gap-16">
        <div className="relative w-full aspect-[3/5] sm:aspect-[2/3] md:aspect-[4/3] lg:aspect-[16/9]">
          <LazyVideo
            src="/images/phonofile/phonofile_views.mp4"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <figcaption className="text-body-default-italic text-content-default">
          Two ways to look at what you own
        </figcaption>
      </figure>

      {/* Point, scan, done. */}
      <div className="flex flex-col gap-24">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          Point, scan, done.
        </h2>
        <p className="text-body-default text-content-default">
        Manual cataloging is the fastest way to abandon an app like this. One scan and Phonofile fills in the rest. And for the things barcodes cannot read, like 8-tracks or a vinyl that has been through it, there is still a manual entry flow.
        </p>
      </div>

      {/* Video: onboarding */}
      <figure className="flex flex-col gap-16">
        <div className="relative w-full aspect-[3/5] sm:aspect-[2/3] md:aspect-[4/3] lg:aspect-[16/9]">
          <LazyVideo
            src="/images/phonofile/phonofile_onboarding.mp4"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <figcaption className="text-body-default-italic text-content-default">
          Scan the barcode, the rest fills in.
        </figcaption>
      </figure>

      {/* See what you actually own */}
      <div className="flex flex-col gap-24">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          See what you actually own
        </h2>
        <p className="text-body-default text-content-default">
          A collection built over years hides patterns worth surfacing: dominant genres, format
          habits, the gap you did not realize you were one album from closing. This is a deliberate
          later phase, not something half finished. Clean, structured data on every item is the
          foundation that makes it possible.
        </p>
      </div>

      {/* A system, not a stack of screens */}
      <div className="flex flex-col gap-24">
        <h2 className="text-headline-medium-mobile md:text-headline-medium text-content-default">
          A system, not a stack of screens
        </h2>
        <p className="text-body-default text-content-default">
          I built Phonofile on a token system, the same way I build at work. I used Leonardo Color to
          create seven color palettes matched in luminosity, so 200 is equally light whether it is
          cerulean or salmon. That consistency is what lets a single factory turn any palette into
          the same set of semantic tokens, which a{' '}
          <span className="text-body-default-mono">useColors</span> hook feeds to a small component
          library (Tag, Avatar, and the rest). Color is the only token that lives in app state, so
          picking a palette recolors the whole app at once, while spacing, type, and border radius
          stay put.
        </p>
      </div>

      {/* Video: theme switcher */}
      <figure className="flex flex-col gap-16">
        <div className="relative w-full aspect-[3/5] sm:aspect-[2/3] md:aspect-[4/3] lg:aspect-[16/9]">
          <LazyVideo
            src="/images/phonofile/phonofile_theme-switcher-bg.mp4"
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <figcaption className="text-body-default-italic text-content-default">
          Your collection, your color
        </figcaption>
      </figure>

      {/* Upcoming features */}
      <div className="flex flex-col gap-24">
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
