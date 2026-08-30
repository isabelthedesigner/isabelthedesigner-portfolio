import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useMediaQuery } from '@/hooks/useMediaQuery'

/* ─── Panel content ──────────────────────────────────────── */

const PANELS = [
  {
    title: ['I spend my days building', 'design systems,'],
    img: '/images/dot-matrix-design-systems.svg',
    imgMobile: '/images/dot-matrix-design-systems-mobile.svg',
    imgMobileWidth: '150px',
    imgDesktopWidth: '80%',
    alt: 'Design systems illustration',
  },
  {
    title: ['then write the code', 'that ships them.'],
    img: '/images/dot-matrix-code.svg',
    imgMobile: '/images/dot-matrix-code-mobile.svg',
    imgMobileWidth: '200px',
    imgDesktopWidth: '90%',
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
      className={`${isH ? 'h-5 w-full' : 'w-5 self-stretch'} ${className}`}
      style={{
        backgroundColor: 'var(--color-bg-default)',
        WebkitMaskImage: sprocketMask,
        maskImage: sprocketMask,
        WebkitMaskSize: size,
        maskSize: size,
        WebkitMaskRepeat: isH ? 'repeat-x' : 'repeat-y',
        maskRepeat: isH ? 'repeat-x' : 'repeat-y',
        WebkitMaskPosition: isH ? '8px center' : 'center 8px',
        maskPosition: isH ? '8px center' : 'center 8px',
      }}
    />
  )
}

/* ─── Content band ───────────────────────────────────────── */

function PanelContent({
  title,
  img,
  imgMobile,
  imgMobileWidth,
  imgDesktopWidth,
  alt,
  isDesktop,
}: {
  title: readonly string[]
  img: string
  imgMobile: string
  imgMobileWidth: string
  imgDesktopWidth: string
  alt: string
  isDesktop: boolean
}) {
  return (
    <div
      className={`relative flex-1 flex flex-col overflow-hidden ${
        isDesktop ? 'p-9' : 'px-[8px] py-[36px]'
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
        className="mt-9 mx-auto"
        style={isDesktop ? { width: imgDesktopWidth } : { width: imgMobileWidth }}
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
      <div className={`flex flex-col w-[738px] shrink-0 ${!isLast ? 'border-r-1 border-dashed border-content-default' : ''}`}>
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
    <div className={`flex flex-row w-[288px] mx-auto shrink-0 ${!isLast ? 'border-b-1 border-dashed border-content-default' : ''}`}>
      <SprocketStrip orientation="vertical" className="!w-[20px] shrink-0" />
      <div className="flex-1">
        <PanelContent
          {...panel}
          isDesktop={false}
        />
      </div>
      <SprocketStrip orientation="vertical" className="!w-[20px] shrink-0" />
    </div>
  )
}

/* ─── Main PrintBay component ──────────────────────────── */

export default function PrintBay() {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const sectionRef = useScrollProgress<HTMLElement>()

  if (isDesktop) {
    return <DesktopPrintBay sectionRef={sectionRef} />
  }

  return <MobilePrintBay sectionRef={sectionRef} />
}

/* ─── Desktop layout ─────────────────────────────────────── */

function DesktopPrintBay({
  sectionRef,
}: {
  sectionRef: React.RefObject<HTMLElement | null>
}) {
  return (
    <section
      ref={sectionRef}
      className="print-bay relative w-screen ml-[calc(50%-50vw)] overflow-x-clip"
      style={{ height: '300vh' }}
    >
      <div className="sticky top-0 h-dvh flex items-center">
        <div className="relative w-full" style={{ height: 'var(--printer-h)' }}>
          {/* Printer back layer - z-[1] */}
          <div
            className="absolute right-0 z-[1]"
            style={{ height: '100%', aspectRatio: '876 / 966', transform: 'translateX(var(--printer-translate))' }}
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
            className="absolute left-0 z-[2]"
            style={{
              width: 'var(--slot-w)',
              top: '50%',
              transform: 'translateY(-50%)',
              filter: 'drop-shadow(8px 4px 24px rgba(50,49,49,.2))',
            }}
          >
            <div
              className="flex flex-row w-max will-change-transform"
              style={{
                transform: 'translateX(calc(var(--slot-w) - var(--q, 0) * 100%))',
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
            style={{ height: '100%', aspectRatio: '876 / 966', transform: 'translateX(var(--printer-translate))' }}
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
    <section
      ref={sectionRef}
      className="print-bay-mobile relative w-screen ml-[calc(50%-50vw)]"
    >
      {/* Rotated printer */}
      <div
        className="relative overflow-hidden mx-auto"
        style={{ width: 'var(--m-printer-w)', height: 'var(--m-printer-h)' }}
      >
        {/* Printer back layer */}
        <div
          className="absolute z-[1]"
          style={{
            width: 'var(--m-printer-h)',
            height: 'var(--m-printer-w)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
          }}
        >
          <img
            src="/images/printer-back.webp"
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-auto"
          />
        </div>

        {/* Printer front layer */}
        <div
          className="absolute z-[3] pointer-events-none"
          style={{
            width: 'var(--m-printer-h)',
            height: 'var(--m-printer-w)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotate(-90deg)',
          }}
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

      {/* Prints tucked into printer */}
      <div
        className="relative z-[2]"
        style={{
          marginTop: 'calc(var(--m-printer-h) * -0.2)',
          filter: 'drop-shadow(8px 4px 24px rgba(50,49,49,.2))',
        }}
      >
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
