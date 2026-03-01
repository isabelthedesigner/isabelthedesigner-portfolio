import { useState, useRef } from 'react'
import Button from '@/components/ui/Button'

interface SongPlayerProps {
  className?: string
}

export default function SongPlayer({ className = '' }: SongPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  function handleToggle() {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
    } else {
      audioRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div className={`flex w-[320px] flex-col items-start gap-6 md:items-end ${className}`}>
      <div className="flex flex-col gap-2 w-full">
        <p className="text-meta-large whitespace-nowrap text-left text-content-default md:text-right">
          NOW PLAYING
        </p>
        <div className="h-56 w-full overflow-hidden">
          <div
            className="inline-flex whitespace-nowrap"
            style={{ animation: 'marquee-song 16s linear infinite' }}
          >
            <span className="text-title-default text-content-default">
              {`Pet Shop Boys - Opportunities (Let's Make Lots of Money) \u2022\u00A0 `}
            </span>
            <span className="text-title-default text-content-default">
              {`Pet Shop Boys - Opportunities (Let's Make Lots of Money) \u2022\u00A0 `}
            </span>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src="/audio/opportunities.mp3" loop />
      <Button iconLeft={isPlaying ? 'Pause' : 'Play'} onClick={handleToggle}>
        {isPlaying ? 'PAUSE' : 'PLAY'}
      </Button>
    </div>
  )
}
