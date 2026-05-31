import type { ReactNode } from 'react'

interface AlertProps {
  children: ReactNode
}

export default function Alert({ children }: AlertProps) {
  return (
    <div className="border-dotted-line flex items-center w-full px-24 py-16">
      <p className="text-body-default-italic text-content-default">{children}</p>
    </div>
  )
}
