import Button from '@/components/ui/Button'

interface SongPlayerProps {
  className?: string
}

export default function SongPlayer({ className = '' }: SongPlayerProps) {
  return (
    <div className={`flex w-80 flex-col items-end gap-6 ${className}`}>
      <div className="flex flex-col gap-2">
        <p className="text-meta-large text-right text-content-default">
          NOW PLAYING
        </p>
        <div className="h-48 w-80 overflow-hidden">
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
