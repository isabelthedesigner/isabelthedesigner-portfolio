import { type InputHTMLAttributes } from 'react'

type FieldProps = InputHTMLAttributes<HTMLInputElement>

export default function Field({ className = '', ...props }: FieldProps) {
  return (
    <input
      className={`w-full bg-bg-default border-2 border-border-default px-16 py-12 text-body-default text-content-default placeholder:text-charcoal ${className}`}
      {...props}
    />
  )
}
