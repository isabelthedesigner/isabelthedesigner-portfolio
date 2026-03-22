import { useRef, useMemo } from 'react'
import SplineViewer from '@/components/spline/SplineViewer'
import IconButton from '@/components/ui/IconButton'
import ProjectCard from '@/components/ui/ProjectCard'
import TypewriterText from '@/components/ui/TypewriterText'
import { useScrollGuide } from '@/hooks/useScrollGuide'
import { useScrollPin } from '@/hooks/useScrollPin'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const SPLINE_URLS = {
  header: 'https://prod.spline.design/EW9vZmJdPt5tgtEJ/scene.splinecode',
  designSystem: 'https://prod.spline.design/vun7zojAqJkae44f/scene.splinecode',
  typeDesign: 'https://prod.spline.design/ikrsxHExiNYglGCf/scene.splinecode',
  animation3d: 'https://prod.spline.design/sFJKyBfgHW1TZsCK/scene.splinecode',
}

const PROJECTS = [
  {
    to: '/work/leaf-animation-tokens',
    title: 'Bringing care to motion: creating animation tokens for Leaf Design System',
    badges: ['UX', 'Design Systems', 'Animation'] as const,
  },
  {
    to: '/work/op-ed-typeface',
    title: 'Op-ed, a semi-condensed serif typeface',
    badges: ['Type Design'] as const,
  },
  {
    to: '/work/retro-desk-supply',
    title: 'Retro desk supply series',
    badges: ['Animation', '3D'] as const,
  },
  {
    to: '/work/phonofile',
    title: 'Phonofile, a physical music catalog app',
    badges: ['UX', 'Design Systems', 'Animation', '3D'] as const,
  },
  {
    to: '/work/fundamental-sans',
    title: 'Fundamental Sans, a neo-grotesque & geometric typeface',
    badges: ['Type Design'] as const,
  },
] as const

export default function HomePage() {
  const isTablet = useMediaQuery('(min-width: 768px)')

  const headerRef = useRef<HTMLElement>(null)
  const workRef = useRef<HTMLElement>(null)
  const text1 = useScrollPin<HTMLElement>({ pinDistance: '+=40%', enabled: isTablet })
  const spline1 = useScrollPin<HTMLElement>({ pinDistance: '+=60%', enabled: isTablet })
  const text2 = useScrollPin<HTMLElement>({ pinDistance: '+=40%', enabled: isTablet })
  const spline2 = useScrollPin<HTMLElement>({ pinDistance: '+=60%', enabled: isTablet })
  const text3 = useScrollPin<HTMLElement>({ pinDistance: '+=40%', enabled: isTablet })
  const spline3 = useScrollPin<HTMLElement>({ pinDistance: '+=60%', enabled: isTablet })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const sections = useMemo(
    () => [headerRef, text1.ref, spline1.ref, text2.ref, spline2.ref, text3.ref, spline3.ref, workRef],
    [],
  )
  const { sentinelRef, anchorRef, isPinned, next } = useScrollGuide({ sections })

  return (
    <>
      {/* Spline 3D: Portfolio Header — full-bleed, nav overlays */}
      <section ref={headerRef} className="flex w-screen ml-[calc(50%-50vw)] items-center justify-center h-dvh">
        <SplineViewer
          sceneUrl={SPLINE_URLS.header}
          fallbackImage="/images/spline-portfolio-header.png"
          alt="Isabel — 3D typographic header"
          className="w-full h-full"
          maskReveal
        />
      </section>

      <div className="flex flex-col gap-120 md:contents">
        {/* Text Section 1 */}
        <section
          ref={text1.ref}
          className="flex w-full items-center justify-center px-6 md:h-dvh md:px-24"
        >
          <TypewriterText
            className="text-display-small-mobile md:text-display-small px-36 md:px-48 desktop:px-0 max-w-[768px] text-center text-content-default"
            startTyping={isTablet ? text1.isActive : undefined}
            disabled={!isTablet}
          >
            I'm a multi-disciplinary designer currently specializing in design systems, creating the tools that enable teams to build better products.
          </TypewriterText>
        </section>

        {/* Spline 3D: Design System */}
        <section
          ref={spline1.ref}
          className="flex w-full items-center justify-center px-6 md:h-dvh md:px-24"
        >
          <div className="w-full max-w-[1248px] md:h-[80vh]">
            <SplineViewer
              sceneUrl={SPLINE_URLS.designSystem}
              fallbackImage="/images/spline-design-system.png"
              alt="Design System — 3D rendered UI components"
              className="w-full md:h-full"
              maskReveal={isTablet}
              triggerInView={isTablet ? spline1.isActive : undefined}
            />
          </div>
        </section>

        {/* Text Section 2 */}
        <section
          ref={text2.ref}
          className="flex w-full items-center justify-center px-6 md:h-dvh md:px-24"
        >
          <TypewriterText
            className="text-display-small-mobile md:text-display-small px-36 md:px-48 desktop:px-0 max-w-[768px] text-center text-content-default"
            startTyping={isTablet ? text2.isActive : undefined}
            disabled={!isTablet}
          >
            I'm a typography enthusiast specializing in custom typeface design, crafting fonts that blend functionality with retro flair.
          </TypewriterText>
        </section>

        {/* Spline 3D: Type Design */}
        <section
          ref={spline2.ref}
          className="flex w-full items-center justify-center px-6 md:h-dvh md:px-24"
        >
          <div className="w-full max-w-[1248px] md:h-[80vh]">
            <SplineViewer
              sceneUrl={SPLINE_URLS.typeDesign}
              fallbackImage="/images/spline-type-design.png"
              alt="Typeface Design — 3D letter forms"
              className="w-full md:h-full"
              maskReveal={isTablet}
              triggerInView={isTablet ? spline2.isActive : undefined}
            />
          </div>
        </section>

        {/* Text Section 3 */}
        <section
          ref={text3.ref}
          className="flex w-full items-center justify-center px-6 md:h-dvh md:px-24"
        >
          <TypewriterText
            className="text-display-small-mobile md:text-display-small px-36 md:px-48 desktop:px-0 max-w-[768px] text-center text-content-default"
            startTyping={isTablet ? text3.isActive : undefined}
            disabled={!isTablet}
          >
            I also dabble in animation and 3d design for funsies, exploring motion and depth to expand on creative possibilities.
          </TypewriterText>
        </section>

        {/* Spline 3D: Animation & 3D */}
        <section
          ref={spline3.ref}
          className="flex w-full items-center justify-center px-6 md:h-dvh md:px-24"
        >
          <div className="w-full max-w-[1248px] md:h-[80vh]">
            <SplineViewer
              sceneUrl={SPLINE_URLS.animation3d}
              fallbackImage="/images/home-animation-3-d.gif"
              alt="Animation & 3D — interactive retro computer scene"
              className="w-full md:h-full"
              maskReveal={isTablet}
              triggerInView={isTablet ? spline3.isActive : undefined}
            />
          </div>
        </section>
      </div>

      {/* Scroll guide arrow — desktop/tablet only */}
      {isTablet && (
        <>
          <div ref={sentinelRef} className="flex justify-center py-48">
            <div ref={anchorRef}>
              <IconButton
                icon="Arrow Down"
                weight="fill"
                size="xl"
                onClick={next}
                aria-label="Scroll to next section"
                className={isPinned ? 'invisible' : ''}
              />
            </div>
          </div>
          {isPinned && (
            <IconButton
              icon="Arrow Down"
              weight="fill"
              size="xl"
              onClick={next}
              aria-label="Scroll to next section"
              className="fixed bottom-24 left-1/2 -translate-x-1/2 z-10"
            />
          )}
        </>
      )}

      {/* Work Section */}
      <section ref={workRef} id="work" className="flex flex-col items-center gap-36 md:gap-48 pt-96 md:pt-16 pb-80 md:pb-120 px-24">
        <h2 className="text-display-large-mobile md:text-display-large max-w-[768px] text-center text-content-default">
          work
        </h2>
        <div className="grid w-full max-w-[1440px] grid-cols-1 gap-40 md:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((project) => (
            <ProjectCard
              key={project.to}
              to={project.to}
              title={project.title}
              badges={[...project.badges]}
            />
          ))}
        </div>
      </section>
    </>
  )
}
