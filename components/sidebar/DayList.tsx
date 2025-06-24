'use client'

interface DayListProps {
  dayMetas: { dayIndex: number }[]
  onDelete: (dayIndex: number, displayNumber: number) => void
}

export default function DayList({ dayMetas, onDelete }: DayListProps) {
  return (
    <div className="space-y-2">
      {dayMetas.map((day, idx) => (
        <div
          key={day.dayIndex}
          className="flex justify-between items-center bg-white/10 px-3 py-2 rounded hover:bg-white/20 transition"
        >
          <span className="text-sm">Day {idx + 1}</span>

          <button
            onClick={() => onDelete(day.dayIndex, idx + 1)}
            className="text-red-400 hover:text-red-600 text-sm"
            title="Delete this day"
          >
            🗑️
          </button>
        </div>
      ))}
    </div>
  )
}
