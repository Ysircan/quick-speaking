'use client'

import clsx from 'clsx'

export type ModuleType = 'EXERCISE' | 'TEST'

interface ModuleMultiSelectorProps {
  value: ModuleType[]
  onChange: (types: ModuleType[]) => void
  disabled?: boolean
}

const types: ModuleType[] = ['EXERCISE', 'TEST']

export default function ModuleMultiSelector({
  value,
  onChange,
  disabled,
}: ModuleMultiSelectorProps) {
  const handleToggle = (type: ModuleType) => {
    if (disabled) return
    if (value.includes(type)) {
      onChange(value.filter((t) => t !== type))
    } else {
      onChange([...value, type])
    }
  }

  return (
    <div className="flex gap-3 items-center">
      <span className="text-sm text-white/60">Module Type:</span>
      {types.map((type) => (
        <button
          key={type}
          onClick={() => handleToggle(type)}
          disabled={disabled}
          className={clsx(
            'px-4 py-2 rounded-full text-sm font-semibold transition',
            value.includes(type)
              ? 'bg-green-400 text-black shadow-md'
              : 'bg-white/10 text-white hover:bg-white/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {type}
        </button>
      ))}
    </div>
  )
}
