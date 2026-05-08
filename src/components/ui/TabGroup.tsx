interface TabGroupProps {
  tabs: { label: string; value: string }[]
  activeValue: string
  onChange: (value: string) => void
  className?: string
}

export default function TabGroup({
  tabs,
  activeValue,
  onChange,
  className = '',
}: TabGroupProps) {
  return (
    <div
      className={`flex border-2 border-border-default ${className}`}
      role="tablist"
    >
      {tabs.map((tab, i) => (
        <button
          key={tab.value}
          type="button"
          role="tab"
          aria-selected={tab.value === activeValue}
          className={`flex-1 flex items-center justify-center p-16 text-label-small cursor-pointer  relative focus-visible:z-10 focus-visible:outline-none focus-visible:shadow-[0_0_0_2px_var(--color-border-default),0_0_0_4px_var(--color-bg-default),0_0_0_6px_var(--color-electric-periwinkle)] ${
            i < tabs.length - 1
              ? 'border-r-2 border-r-border-default focus-visible:border-r-transparent'
              : ''
          } ${
            tab.value === activeValue
              ? 'bg-bg-strong text-content-default-inverse'
              : 'bg-bg-default text-content-default hover:bg-baby-charcoal'
          }`}
          onClick={() => onChange(tab.value)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}
