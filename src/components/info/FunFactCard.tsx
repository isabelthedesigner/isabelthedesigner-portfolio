import { ScratchToReveal } from '@/components/magicui/scratch-to-reveal'

interface FunFactCardProps {
  image: string
  text: string
}

const GRADIENT_COLORS: [string, string, string] = ['#d10000', '#ffca41', '#6781ff']

export default function FunFactCard({ image, text }: FunFactCardProps) {
  return (
    <div className="border-2 border-border-default overflow-hidden">
      <ScratchToReveal
        width={400}
        height={320}
        minScratchPercentage={80}
        gradientColors={GRADIENT_COLORS}
        className="w-full"
      >
        <div className="flex flex-col items-center gap-24 p-24">
          <img
            src={image}
            alt=""
            className="max-w-[207px] w-full aspect-[207/160] object-cover rounded-8"
          />
          <p className="text-body-default text-content-default text-center">{text}</p>
        </div>
      </ScratchToReveal>
    </div>
  )
}
