interface DayTabsProps {
  totalDays: number
  activeDay: number
  onDayChange: (day: number) => void
  dayMetas: { dayIndex: number; goalType: string }[]
  onAddDay?: () => void
  onRemoveDay?: () => void
}

export default function DayTabs({
  totalDays,
  activeDay,
  onDayChange,
  dayMetas,
  onAddDay,
  onRemoveDay,
}: DayTabsProps) {
  const getLabel = (day: number) => {
    const meta = dayMetas.find((m) => m.dayIndex === day)
    const labelMap: Record<string, string> = {
      STUDY: 'Study',
      EXERCISE: 'Exercise',
      READING: 'Reading',
      CHECKIN: 'Check-in',
      TEST: 'Test',
      CUSTOM: 'Custom',
    }
    return meta ? labelMap[meta.goalType] || '' : ''
  }

  return (
    <>
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

      <div className="flex gap-2 mt-4">
        {onAddDay && (
          <button
            className="px-3 py-1 text-sm rounded bg-green-700 text-white hover:bg-green-800"
            onClick={onAddDay}
            type="button"
          >
            ➕ 增加一天
          </button>
        )}
        {onRemoveDay && (
          <button
            className="px-3 py-1 text-sm rounded bg-red-700 text-white hover:bg-red-800"
            onClick={onRemoveDay}
            type="button"
          >
            ➖ 删除最后一天
          </button>
        )}
      </div>
    </>
  )
}
