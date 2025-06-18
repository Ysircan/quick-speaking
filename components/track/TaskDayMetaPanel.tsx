'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

interface TaskDayMetaPanelProps {
  dayIndex: number
  onMetaSaved: (dayIndex: number, goalType: string) => void
}

const goalTypeOptions = [
  { value: 'STUDY', label: 'Study Task' },
  { value: 'EXERCISE', label: 'Exercise Task' },
  { value: 'READING', label: 'Reading Task' },
  { value: 'CHECKIN', label: 'Check-in Task' },
  { value: 'TEST', label: 'Test Task' },
  { value: 'CUSTOM', label: 'Custom' },
]

const unlockModeOptions = [
  { value: 'DAILY', label: 'Unlock Daily' },
  { value: 'LINEAR', label: 'Unlock After Previous' },
  { value: 'MANUAL', label: 'Manually Unlock' },
  { value: 'AFTER_X_DAYS', label: 'Unlock After X Days' },
  { value: 'MILESTONE', label: 'Unlock After Milestone' },
]

export default function TaskDayMetaPanel({
  dayIndex,
  onMetaSaved,
}: TaskDayMetaPanelProps) {
  const { id: trackId } = useParams()
  const [goalType, setGoalType] = useState('STUDY')
  const [unlockMode, setUnlockMode] = useState('DAILY')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!trackId) return
    setLoading(true)

    try {
      const res = await fetch('/api/create/track/daymeta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId,
          dayIndex,
          goalType,
          unlockMode,
          note,
        }),
      })

      const data = await res.json()
      if (data.success) {
        onMetaSaved(dayIndex, goalType)
      }
    } catch (err) {
      console.error('Failed to save:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl border border-gray-700 space-y-4">
      <h2 className="text-xl font-semibold">📌 Day {dayIndex} Configuration</h2>

      {/* Task Type */}
      <section>
        <label className="block mb-1 text-sm text-gray-400">Task Type</label>
        <div className="flex flex-wrap gap-2">
          {goalTypeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGoalType(opt.value)}
              className={`px-3 py-1 rounded-full text-sm border transition-all ${
                goalType === opt.value
                  ? 'bg-purple-600 text-white border-purple-400'
                  : 'bg-gray-800 text-gray-300 border-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Unlock Mode */}
      <section>
        <label className="block mb-1 text-sm text-gray-400">Unlock Mode</label>
        <div className="flex flex-wrap gap-2">
          {unlockModeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setUnlockMode(opt.value)}
              className={`px-3 py-1 rounded-full text-sm border transition-all ${
                unlockMode === opt.value
                  ? 'bg-green-600 text-white border-green-400'
                  : 'bg-gray-800 text-gray-300 border-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Notes */}
      <section>
        <label className="block mb-1 text-sm text-gray-400">Notes (Optional)</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional description for this day"
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
        />
      </section>

      {/* Save Button */}
      <div>
        <button
          type="button"
          onClick={handleSave}
          disabled={loading}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white"
        >
          {loading ? 'Saving...' : '💾 Save Configuration'}
        </button>
      </div>
    </div>
  )
}