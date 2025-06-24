'use client'

import { UnlockModeType } from './UnlockModeSelector'
import { ModuleType } from './ModuleTypeSelector'

interface SettingSummaryProps {
  unlockMode: UnlockModeType
  moduleTypes: ModuleType[]
  onEdit: () => void
}

export default function SettingSummary({
  unlockMode,
  moduleTypes,
  onEdit,
}: SettingSummaryProps) {
  return (
    <div className="flex items-center gap-4">
      {/* Selected Unlock Mode */}
      <span className="px-4 py-1.5 rounded-full bg-yellow-400 text-black text-sm font-semibold shadow-sm">
        {unlockMode}
      </span>

      {/* Selected Module Types */}
      {moduleTypes.map((type) => (
        <span
          key={type}
          className="px-4 py-1.5 rounded-full bg-green-400 text-black text-sm font-semibold shadow-sm"
        >
          {type}
        </span>
      ))}

      {/* Edit Button */}
      <button
        onClick={onEdit}
        className="px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-medium transition"
      >
        ✏️ Edit
      </button>
    </div>
  )
}
