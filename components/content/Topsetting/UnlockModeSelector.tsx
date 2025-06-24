'use client'

import clsx from 'clsx'

export type UnlockModeType = 'DAILY' | 'LINEAR' | 'FREE'

interface UnlockModeSelectorProps {
  value: UnlockModeType
  onChange: (mode: UnlockModeType) => void
  disabled?: boolean
}

const modes: UnlockModeType[] = ['DAILY', 'LINEAR', 'FREE']

export default function UnlockModeSelector({
  value,
  onChange,
  disabled,
}: UnlockModeSelectorProps) {
  return (
    <div className="flex gap-3 items-center">
      <span className="text-sm text-white/60">Unlock Mode:</span>
      {modes.map((mode) => (
        <button
          key={mode}
          disabled={disabled}
          onClick={() => onChange(mode)}
          className={clsx(
            'px-4 py-2 rounded-full text-sm font-semibold transition',
            value === mode
              ? 'bg-yellow-400 text-black shadow-md'
              : 'bg-white/10 text-white hover:bg-white/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          {mode}
        </button>
      ))}
    </div>
  )
}
