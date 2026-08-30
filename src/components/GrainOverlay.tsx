import { createPortal } from 'react-dom'

export default function GrainOverlay() {
  if (typeof document === 'undefined') return null

  return createPortal(
    <div className="grain-overlay" aria-hidden="true" />,
    document.body,
  )
}
