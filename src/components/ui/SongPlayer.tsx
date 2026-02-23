import Button from '@/components/ui/Button'

interface SongPlayerProps {
  className?: string
}

export default function SongPlayer({ className = '' }: SongPlayerProps) {
  return (
    <div className={`flex w-[320px] flex-col items-start gap-6 md:items-end ${className}`}>
      <div className="flex flex-col gap-2 w-full">
        <p className="text-meta-large whitespace-nowrap text-left text-content-default md:text-right">
          NOW PLAYING
        </p>
        <div className="h-56 w-full overflow-hidden">
          <p
            className="text-title-default whitespace-nowrap text-content-default"
            style={{ animation: 'marquee-song 6s linear infinite' }}
          >
            {`Pet Shop Boys - Opportunities (Let's Make Lots of Money) \u2022 Pet Shop Boys - Opportunities (Let's Make Lots of Money) \u2022 `}
          </p>
        </div>
      </div>
      <Button iconLeft="Play">PLAY</Button>
    </div>
  )
}
