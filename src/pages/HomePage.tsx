import { useRef } from 'react'
import HeroIntro from '@/components/home/HeroIntro'
import PrintBay from '@/components/home/PrintBay'
import ProjectCard from '@/components/ui/ProjectCard'

const PROJECTS = [
  {
    to: '/work/phonofile',
    title: 'Phonofile, a physical music catalog app',
    badges: ['UX', 'Design Systems', 'Animation', '3D'] as const,
  },
  {
    to: '/work/op-ed-typeface',
    title: 'Op-ed, a semi-condensed serif typeface',
    badges: ['Type Design'] as const,
  },
  {
    to: '/work/leaf-animation-tokens',
    title: 'Bringing care to motion: creating animation tokens for Leaf Design System',
    badges: ['UX', 'Design Systems', 'Animation'] as const,
  },
] as const

export default function HomePage() {
  const workRef = useRef<HTMLElement>(null)

  return (
    <>
      <HeroIntro />

      <PrintBay />

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
