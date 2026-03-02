import { usePortraitStore } from '@/hooks/usePortraitStore'
import { HairSVG, GlassesSVG, LipstickSVG } from './PortraitSVGs'
import SwatchGroup from './SwatchGroup'
import RandomizeButton from './RandomizeButton'
import ResetButton from './ResetButton'

export default function PortraitColorPicker() {
  const { hairColor, glassesColor, lipstickColor, setHairColor, setGlassesColor, setLipstickColor } =
    usePortraitStore()

  return (
    <div className="flex flex-col md:flex-row gap-48">
      {/* Portrait */}
      <div className="w-full md:w-[55%] desktop:w-[50%] xl:w-[40%] md:h-[55%] desktop:h-[50%] xl:h-[40%] flex justify-center">
        <div className="relative w-full aspect-square border-2 border-border-default">
          <img
            src="/images/info/isabel-portrait.png"
            alt="Isabel's portrait"
            className="absolute object-contain"
            style={{ left: '7.75%', top: '7.75%', width: '84.5%', height: '84.5%' }}
          />
          <HairSVG
            className="absolute"
            style={{ left: '11.25%', top: '8.75%', width: '74.15%', height: '75%' }}
          />
          <GlassesSVG
            className="absolute"
            style={{ left: '27.25%', top: '24.5%', width: '56.5%', height: '55.25%' }}
          />
          <LipstickSVG
            className="absolute"
            style={{ left: '53.5%', top: '63.5%', width: '18%', height: '18%' }}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="w-full md:w-[45%] desktop:w-[50%] xl:w-[60%] flex flex-col justify-center gap-36">
        <div className="flex flex-col gap-24 desktop:gap-36">
          <SwatchGroup label="HAIR" currentColor={hairColor} onSelect={setHairColor} />
          <SwatchGroup label="GLASSES" currentColor={glassesColor} onSelect={setGlassesColor} />
          <SwatchGroup label="LIPSTICK" currentColor={lipstickColor} onSelect={setLipstickColor} />
        </div>

        <div className="flex flex-col gap-16">
          <RandomizeButton />
          <ResetButton />
        </div>
      </div>
    </div>
  )
}
