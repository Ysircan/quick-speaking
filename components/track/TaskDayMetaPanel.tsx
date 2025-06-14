"use client"

import { useState, useEffect } from "react"

interface TaskDayMetaPanelProps {
  dayIndex: number
  unlockMode: string
  onMetaChange: (meta: {
    type: string
    isUnlockDay: boolean
  }) => void
}

const TASK_TYPES = ["Check-in", "Reading", "Practice", "Exam"]

export default function TaskDayMetaPanel({
  dayIndex,
  unlockMode,
  onMetaChange,
}: TaskDayMetaPanelProps) {
  const [type, setType] = useState("Check-in")
  const [isUnlockDay, setIsUnlockDay] = useState(false)

  useEffect(() => {
    onMetaChange({ type, isUnlockDay })
  }, [type, isUnlockDay])

  const requiresUnlock = unlockMode === "LINEAR" || unlockMode === "DAILY"

  return (
    <div className="bg-neutral-900 border border-neutral-700 p-4 rounded-xl mb-4">
      <h2 className="text-lg font-semibold mb-2">Day {dayIndex} — Task Meta</h2>

      <div className="mb-3">
        <label className="text-sm mb-1 block">Today’s Task Type:</label>
        <select
          className="w-full p-2 bg-neutral-800 rounded-md border border-neutral-600"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {TASK_TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="mb-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isUnlockDay}
            onChange={(e) => setIsUnlockDay(e.target.checked)}
          />
          Require completion to unlock next day
        </label>
      </div>

      {requiresUnlock && isUnlockDay && (
        <div className="text-yellow-400 text-sm mt-2">
          ⚠️ This day requires a drop card to unlock the next day.
        </div>
      )}
    </div>
  )
}
