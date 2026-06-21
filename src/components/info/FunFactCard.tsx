import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal'
import Image from '@/components/ui/Image'

interface FunFactCardProps {
  image: string
  text: string
}

const GRADIENT_COLORS: [string, string, string] = ['#d10000', '#ffca41', '#6781ff']

export default function FunFactCard({ image, text }: FunFactCardProps) {
  return (
    <div className="border-2 border-border-default overflow-hidden">
      <ScratchToReveal
        fluidHeight
        minScratchPercentage={80}
        gradientColors={GRADIENT_COLORS}
        className="w-full h-full"
      >
        <div className="flex flex-col items-center gap-24 p-24">
          <Image
            src={image}
            alt=""
            className="max-h-[160px] w-full object-contain rounded-8"
          />
          <p className="text-body-default text-content-default text-center">{text}</p>
        </div>
      </ScratchToReveal>
    </div>
  )
}
