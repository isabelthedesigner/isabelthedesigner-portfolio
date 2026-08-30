import { useState, useEffect, useCallback, useRef } from 'react'
import TypewriterText from '@/components/ui/TypewriterText'
import { hasRevealed } from '@/lib/revealMemory'

const WORD_DELAY = 180

type QueueItem = { id: string; wait: 'callback' | number }

const QUEUE: QueueItem[] = [
  { id: 'type-hello',    wait: 'callback' },
  { id: 'pre-portrait',  wait: 300 },
  { id: 'show-portrait', wait: 0 },
  { id: 'pre-iam',       wait: 300 },
  { id: 'type-iam',      wait: 'callback' },
  { id: 'pre-wordmark',  wait: 400 },
  { id: 'show-wordmark', wait: 0 },
  { id: 'pre-designer',  wait: 300 },
  { id: 'type-designer', wait: 'callback' },
]

const IDX = Object.fromEntries(QUEUE.map((q, i) => [q.id, i])) as Record<string, number>

function IsabelWordmark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      aria-label="isabel"
      viewBox="0 0 1001.5 427.3"
      xmlns="http://www.w3.org/2000/svg"
      overflow="visible"
    >
      <path fill="currentColor" d="M495.6,327.3c-9.5,6.6-24.4,15.6-34.4,18.5-9.9-.1-39,3.1-44.8-13.2-2-5.9-2.3-146.3-3-158.9,0-5,.1-5.1,5-5.1,7.6,0,63.4-1,72.2-1.1,2.2,0,2.8-.9,2.8-3.3s-.8-47.5-.9-68.7c.7-11.8-32.1-12-34.2-.6,0,3.6.6,55,.5,57.1,0,1.9-.5,2.3-2.5,2.5-.3,0-26.6.3-39.5.4-3.8,0-4.3-.4-4.4-4.1-1.5-38.5,18.3-75.2,65.7-75,37,0,54.6,10.4,61.2,20.9,1.2,2,1.6,4.2,1.7,6.5,0,4.1,5,223.9,5,226.3,0,1.5.8,2,2.3,1.9,2.2-.1,19.8-.2,26.4-.3,5.5-.5,5.2,2,5.2,6.7,4.9,7-69,3.6-79.7,5.4-7,.9-3.2-11.6-4.4-15.8h-.2ZM464.9,331c10.2-4.6,19.8-10.7,28.8-17.4,1.3-1,2-2.3,1.9-4-.1-2.7-2-118-2.1-124.9,0-4.4.3-4.2-4.2-4.1-8.8.3-17.6.7-26.4,1.1-5.7,2.1,3.7,148.7,2,149.3h0Z" />
      <path fill="currentColor" d="M635.9,42.9c9.9-9.4,19.5-18.6,29.4-27.8,6.2-3.8,13-16.7,20.7-14.9,25.2,7.3,46.2,36.1,38.1,62.4-1.6,3.4-26.2,23.5-28,25.2,9.8,3.8,41.5,31,44.3,41.1,0,4.8,11.1,40.5,6.1,47.1-14.5,11.8-53.8,62.8-76.8,64.1-18.3-.2-35.2-7.8-50.7-11.4-10.2-3.7-24.3,17-28.8,10.1-10-10.9.3-8.7,4.3-19.8,2.7-19-4.2-129-5.6-150.3-6.4-7.7-11.3,6.4-16,1.8-2-3.3-10.4-8.3-6.1-12.1,14.6-13.6,29.1-27.5,43.8-40.9,9.6-5.4,22.2,18.7,25.3,25.6h0v-.2h0ZM642.3,134.5c-5.5.5-5.8,1.4-5.2,7,.9,9.3,1,18.6.8,27.9,0,1.5.5,2.4,2.1,2.6,1.9.2,21.9,7.7,27.2,10.4,6.5,2.8,12.3,8.2,19.1,10.2,17.8-11.2,22.3-23.6,6.8-43.3-10.7-16-34.3-15.6-50.9-14.7h0q0-.1,0-.1ZM636.5,106.7c6.6-3.9,29.1-31.3,33.9-36.1,3.4-4,4.5-8.6,4.3-13.7.3-4.9-4.3-8-7.6-10.9-2.8-1.3-6.5-6.8-9.5-3.7-6.5,5.9-12.7,12.2-19.9,17.3-1.8,1.3-2.3,2.7-2.3,4.8.7,14-.2,28.4,1.1,42.4h0Z" />
      <path fill="currentColor" d="M115.2,114.5c19,4.1,48,20,36.7,53-5.3,25.3-62.6,141.9-50.3,147.8,12.9,8.6,48.9-23.8,43.9-5-24.9,37.9-60.4,56.6-106.1,56.6s-45-26.8-30.8-59.1c2.4-5.5,64.7-128.3,65.4-129.7,10.2-28.3-26.2-9.2-36.3,3.6-27.7,14.3,26.7-84.7,77.5-67.2Z" />
      <path fill="currentColor" d="M177.7,201.5s0-24.8,0-24.8c0-3.6,0-3.8,3.9-3.8,26.5.7,74.7-.2,101.9.1,12.9-.6,26.9,2.5,39.2-1.5,5.3-2.6,6.1-7.4,2.1-11.9-4.5-4.7-11.9-2.8-17.8-3.8-25.8-3.3-96.2,5.8-117.7-17.8-15.9-27.5,16.1-41.1,41.6-41.7,13.4-.6,120.1-3.2,120.9-3.2,3.9-.5,1.5,8.5,2.2,10.2,0,2.1-.4,2.6-2.4,2.7-31.1,1-62.1,1.5-93.2,1.8-9.1,0-34.6-1.4-27.2,13.8,5,5.8,44.3,6.1,49,6.3,8.4.4,46,2.8,51.8,3.2,24.3,0,46.5,26.6,45.2,47.4.8,32.9-27.5,50.9-58,50-25.7,1.2-51.3,1-77,1.6-20.6.3-41.1,1.8-61.7.4-2.3,0-2.7-.4-2.7-2.7,0,0,0-25.9,0-25.9h0v-.4h-.1Z" />
      <path fill="currentColor" d="M938.2,310.6c-7-31.5-45.9-33.7-68.9-11.1-21.3,20.7-29.7,49.1-25.2,50.2,5.3-3.8,34.5-53.3,56.7-47.3,58.3,26.8-80.6,150-126.8,88.8.2-1.3,41.2-33.8,35.2-44.3-1.4-1.1-11.5,8.4-20.7,14.6-9.7,6.6-15.8,9.6-19.6,10.9-.1-89,118.9-122.1,90.4-135.5-15.8-2.2-34.5-8.1-40.7-18.2,41-10.3,89.8-28.1,83-56.3-6.3-13.3-23.5-18.2-46-13.1-28.7,6.2-62.2,30.2-62.7,60.1-60.6,24.6-203.8,93.6-170.6,184.3,24.4,48.3,95.4,29.9,128.3,11.5,45.3,66.1,202.1-32.4,187.6-94.7h0ZM826.4,182.8c54-41.5,93.6-3.5-12.4,21.2.8-7.1,5.1-14.5,12.4-21.2h0ZM743.6,386.1c-68.9,33.6-105,5.2-89.8-46.4,5.1-37.1,111.6-106.4,142.4-115.7,6.8,11.4,20.8,19.7,34.1,24.1-42,24.6-94.5,85-86.8,138h0Z" />
      <path fill="currentColor" d="M934.1,242.3c.4-21.1,36.8-170.1,30.1-180.8-3.2-4.3,27.5-4.9,30-5.9,6.5,5.9-31.8,162-30.4,168.2-3.4,20.8,3.9,25.5,12.3,21.7,10.4-4.8,21.8-29.1,22-29.6.8-2.4,4-1,3.4,1.2-.7,2.6-17.5,56.1-42.5,57.8-18.1,1.3-27-8.4-24.8-32.7h0Z" />
      <path fill="currentColor" d="M113.3,96.3c-38-14.8-15.9-76.4,26.4-64.3,51.1,13.4,19.6,83.5-26.3,64.2h0q0,0,0,0Z" />
    </svg>
  )
}

export default function HeroIntro() {
  const reduceMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  /* Fix 8: read revealMemory in an effect to avoid hydration mismatch */
  const [allRevealed, setAllRevealed] = useState(false)
  useEffect(() => {
    if (
      hasRevealed('hero-hello') &&
      hasRevealed('hero-iam') &&
      hasRevealed('hero-thedesigner')
    ) {
      setAllRevealed(true)
    }
  }, [])

  const skipSequence = reduceMotion.current || allRevealed

  const [cursor, setCursor] = useState(0)

  useEffect(() => {
    if (skipSequence) setCursor(QUEUE.length)
  }, [skipSequence])

  const advance = useCallback(() => setCursor((c) => c + 1), [])

  useEffect(() => {
    if (skipSequence || cursor >= QUEUE.length) return
    const item = QUEUE[cursor]
    if (item.wait === 'callback') return
    const timer = setTimeout(advance, item.wait)
    return () => clearTimeout(timer)
  }, [skipSequence, cursor, advance])

  const reached = (id: string) => cursor >= IDX[id]

  return (
    <section className="flex w-full items-center justify-center px-6 md:px-24 pt-[30vh] pb-24">
      <div className="flex flex-col items-center gap-4 max-w-[342px] md:max-w-[1248px] w-full">
        {/* Line 1: "Hello there!" + portrait */}
        <div className="flex flex-row items-center gap-8 md:gap-16 justify-center">
          <TypewriterText
            className="text-display-small-mobile md:text-display-small text-content-default"
            startTyping={reached('type-hello')}
            wordDelay={WORD_DELAY}
            revealKey="hero-hello"
            onComplete={advance}
          >
            Hello there!
          </TypewriterText>

          <div
            className="shrink-0 w-[64px] h-[64px] md:w-[96px] md:h-[96px] grayscale transition-[transform,filter] duration-500 ease-out hover:-translate-y-[16px] hover:grayscale-0 hover:animate-[portrait-wiggle_0.6s_ease-out]"
            style={{ opacity: reached('show-portrait') ? 1 : 0 }}
          >
            <img
              src="/images/portrait-color-hero.webp"
              alt=""
              aria-hidden="true"
              className="w-full h-full object-contain"
              draggable={false}
            />
          </div>
        </div>

        {/* Line 2: "I am" + wordmark + "the designer." */}
        <div className="flex flex-row items-center gap-8 md:gap-16 justify-center flex-wrap">
          <TypewriterText
            className="text-display-small-mobile md:text-display-small text-content-default"
            startTyping={reached('type-iam')}
            wordDelay={WORD_DELAY}
            revealKey="hero-iam"
            onComplete={advance}
          >
            I am
          </TypewriterText>

          <div
            className="shrink-0 w-[112px] h-[48px] md:w-[225px] md:h-[96px]"
            style={{ opacity: reached('show-wordmark') ? 1 : 0 }}
          >
            <IsabelWordmark className="wordmark w-full h-full" />
          </div>

          <TypewriterText
            className="text-display-small-mobile md:text-display-small text-content-default"
            startTyping={reached('type-designer')}
            wordDelay={WORD_DELAY}
            revealKey="hero-thedesigner"
          >
            the designer.
          </TypewriterText>
        </div>
      </div>
    </section>
  )
}
