interface DayTabsProps {
  totalDays: number
  activeDay: number
  onDayChange: (day: number) => void
  dayMetas: { dayIndex: number; goalType: string }[]  // ✅ Daily goal type per day
}

export default function DayTabs({
  totalDays,
  activeDay,
  onDayChange,
  dayMetas,
}: DayTabsProps) {
  const getLabel = (day: number) => {
    const meta = dayMetas.find((m) => m.dayIndex === day)
    if (!meta) return ''
    const labelMap: Record<string, string> = {
      STUDY: 'Study',
      EXERCISE: 'Exercise',
      READING: 'Reading',
      CHECKIN: 'Check-in',
      TEST: 'Test',
      CUSTOM: 'Custom',
    }
    return labelMap[meta.goalType] || ''
  }

  return (
    <div className="flex gap-2 flex-wrap">
      {Array.from({ length: totalDays }, (_, i) => {
        const day = i + 1
        const isActive = day === activeDay
        const label = getLabel(day)

        return (
          <button
            key={day}
            className={`px-4 py-2 rounded border text-sm text-left ${
              isActive ? 'bg-purple-500 text-white' : 'bg-gray-800 text-gray-300'
            }`}
            onClick={() => onDayChange(day)}
          >
            <div>Day {day}</div>
            {label && <div className="text-xs text-gray-300">{label}</div>}
          </button>
        )
      })}
    </div>
  )
}
