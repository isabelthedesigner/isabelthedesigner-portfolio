import { useEffect, useRef, useCallback } from 'react'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/* ─── Panel content ──────────────────────────────────────── */

const PANELS = [
  {
    title: ['I spend my days building', 'design systems,'],
    img: '/images/dot-matrix-design-systems.svg',
    imgMobile: '/images/dot-matrix-design-systems-mobile.svg',
    alt: 'Design systems illustration',
  },
  {
    title: ['then write the code', 'that ships them.'],
    img: '/images/dot-matrix-code.svg',
    imgMobile: '/images/dot-matrix-code-mobile.svg',
    alt: 'Code illustration',
  },
] as const

/* ─── Sprocket strip (no halo) ───────────────────────────── */

const SPROCKET_R = 2
const SPROCKET_PITCH = 16

const sprocketMask =
  `radial-gradient(circle at center, transparent 0 ${SPROCKET_R}px, black ${SPROCKET_R + 0.5}px)`

function SprocketStrip({
  orientation = 'horizontal',
  className = '',
}: {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}) {
  const isH = orientation === 'horizontal'
  const size = isH ? `${SPROCKET_PITCH}px 100%` : `100% ${SPROCKET_PITCH}px`

  return (
    <div
      aria-hidden="true"
      className={`${isH ? 'h-5 w-full' : 'w-5 h-full'} ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-default)',
        WebkitMaskImage: sprocketMask,
        maskImage: sprocketMask,
        WebkitMaskSize: size,
        maskSize: size,
        WebkitMaskRepeat: isH ? 'repeat-x' : 'repeat-y',
        maskRepeat: isH ? 'repeat-x' : 'repeat-y',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
      }}
    />
  )
}

/* ─── Content band ───────────────────────────────────────── */

function PanelContent({
  title,
  img,
  imgMobile,
  alt,
  isDesktop,
}: {
  title: readonly string[]
  img: string
  imgMobile: string
  alt: string
  isDesktop: boolean
}) {
  return (
    <div
      className={`relative flex-1 flex flex-col overflow-hidden ${
        isDesktop ? 'p-9' : 'p-4'
      }`}
      style={{ backgroundColor: 'var(--color-bg-default)' }}
    >
      <div className="flex flex-col text-center">
        {title.map((line, i) => (
          <span
            key={i}
            className="text-title-large-pixel-mobile md:text-title-large-pixel text-content-default block"
          >
            {line}
          </span>
        ))}
      </div>

      <img
        src={isDesktop ? img : imgMobile}
        alt={alt}
        className="w-full mt-9"
        loading="lazy"
        aria-hidden="true"
      />
    </div>
  )
}

/* ─── Single panel: sprocket + content + sprocket ──────── */

function Panel({
  panel,
  isDesktop,
  isLast,
}: {
  panel: (typeof PANELS)[number]
  index: number
  isDesktop: boolean
  isLast: boolean
}) {
  if (isDesktop) {
    return (
      <div className={`flex flex-col w-[738px] shrink-0 ${!isLast ? 'border-r-2 border-dashed border-content-default' : ''}`}>
        <SprocketStrip orientation="horizontal" />
        <PanelContent
          {...panel}
          isDesktop
        />
        <SprocketStrip orientation="horizontal" />
      </div>
    )
  }

  return (
    <div className={`flex flex-row w-[294px] shrink-0 ${!isLast ? 'border-b-2 border-dashed border-content-default' : ''}`}>
      <SprocketStrip orientation="vertical" />
      <PanelContent
        {...panel}
        isDesktop={false}
      />
      <SprocketStrip orientation="vertical" />
    </div>
  )
}

/* ─── Main PrintBay component ──────────────────────────── */

export default function PrintBay() {
  const isDesktop = useMediaQuery('(min-width: 768px)')
  const printerRef = useRef<HTMLDivElement>(null)
  const slotRef = useRef<HTMLDivElement>(null)

  const sectionRef = useScrollProgress<HTMLElement>()

  const computeSlotEdge = useCallback(() => {
    if (!isDesktop || !printerRef.current || !slotRef.current) return
    const printerRect = printerRef.current.getBoundingClientRect()
    const slotEl = slotRef.current
    const parentRect = slotEl.parentElement?.getBoundingClientRect()
    if (!parentRect) return

    const frontLeftOffset = printerRect.width * 0.08105
    const tuck = printerRect.width * 0.12
    const rightEdge = printerRect.left + frontLeftOffset + tuck - parentRect.left
    slotEl.style.width = `${rightEdge}px`
    slotEl.style.setProperty('--slot-w', String(rightEdge))
  }, [isDesktop])

  useEffect(() => {
    if (!isDesktop) return
    const ro = new ResizeObserver(computeSlotEdge)
    if (printerRef.current) ro.observe(printerRef.current)
    computeSlotEdge()
    return () => ro.disconnect()
  }, [isDesktop, computeSlotEdge])

  if (isDesktop) {
    return <DesktopPrintBay sectionRef={sectionRef} printerRef={printerRef} slotRef={slotRef} />
  }

  return <MobilePrintBay sectionRef={sectionRef} />
}

/* ─── Desktop layout ─────────────────────────────────────── */

function DesktopPrintBay({
  sectionRef,
  printerRef,
  slotRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>
  printerRef: React.RefObject<HTMLDivElement | null>
  slotRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <section
      ref={sectionRef}
      className="relative w-screen ml-[calc(50%-50vw)] overflow-x-clip"
      style={{ height: '300vh' }}
    >
      <div className="sticky top-0 h-dvh flex items-center">
        <div className="relative w-full" style={{ height: '600px' }}>
          {/* Printer back layer - z-[1] */}
          <div
            ref={printerRef}
            className="absolute right-0 z-[1]"
            style={{ height: '100%', aspectRatio: '876 / 966', transform: 'translateX(60%)' }}
          >
            <img
              src="/images/printer-back.webp"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-auto"
            />
          </div>

          {/* Paper slot - z-[2], between back and front */}
          <div
            ref={slotRef}
            className="absolute left-0 z-[2] overflow-x-clip"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              filter: 'drop-shadow(8px 4px 24px rgba(50,49,49,.2))',
            }}
          >
            <div
              className="flex flex-row w-max will-change-transform"
              style={{
                transform: 'translateX(calc(var(--slot-w, 0) * 1px - var(--q, 0) * 100%))',
              }}
            >
              {PANELS.map((panel, i) => (
                <Panel
                  key={i}
                  panel={panel}
                  index={i}
                  isDesktop
                  isLast={i === PANELS.length - 1}
                />
              ))}
            </div>
          </div>

          {/* Printer front layer - z-[3] */}
          <div
            className="absolute right-0 z-[3] pointer-events-none"
            style={{ height: '100%', aspectRatio: '876 / 966', transform: 'translateX(60%)' }}
          >
            <img
              src="/images/printer-front.webp"
              alt=""
              aria-hidden="true"
              className="absolute top-0 h-full w-auto"
              style={{ left: '8.105%' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ─── Mobile layout ──────────────────────────────────────── */

function MobilePrintBay({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>
}) {
  return (
    <section ref={sectionRef} className="flex flex-col items-center px-6">
      <div
        className="relative w-full max-w-[342px]"
        style={{ aspectRatio: '876 / 966' }}
      >
        <img
          src="/images/printer-back.webp"
          alt=""
          aria-hidden="true"
          className="absolute top-0 left-0 h-full w-auto z-[1]"
        />
        <img
          src="/images/printer-front.webp"
          alt=""
          aria-hidden="true"
          className="absolute top-0 h-full w-auto z-[3] pointer-events-none"
          style={{ left: '8.105%' }}
        />
      </div>

      <div className="flex flex-col items-center"
           style={{ filter: 'drop-shadow(8px 4px 24px rgba(50,49,49,.2))' }}>
        {PANELS.map((panel, i) => (
          <Panel
            key={i}
            panel={panel}
            index={i}
            isDesktop={false}
            isLast={i === PANELS.length - 1}
          />
        ))}
      </div>
    </section>
  )
}
