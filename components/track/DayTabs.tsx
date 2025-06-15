// components/track/DayTabs.tsx

interface DayTabsProps {
  totalDays: number
  activeDay: number
  onChange: (day: number) => void
  dayMetas?: { [dayIndex: number]: string } // e.g. { 1: "CHECKIN", 2: "STUDY", ... }
}

// 合法枚举对应的图标和标签（与 schema.prisma 一致）
const typeLabels: Record<string, { icon: string; label: string }> = {
  CHECKIN: { icon: "📍", label: "打卡" },
  STUDY: { icon: "📘", label: "学习" },
  EXERCISE: { icon: "📝", label: "练习" },
  READING: { icon: "📖", label: "阅读" },
  TEST: { icon: "🧪", label: "测试" },
  CUSTOM: { icon: "✨", label: "自定义" },
}

export default function DayTabs({ totalDays, activeDay, onChange, dayMetas = {} }: DayTabsProps) {
  return (
    <div className="flex flex-wrap gap-3 py-4">
      {Array.from({ length: totalDays }).map((_, i) => {
        const day = i + 1
        const isActive = activeDay === day
        const metaType = dayMetas[day]
        const meta = typeLabels[metaType]

        return (
          <button
            key={day}
            onClick={() => onChange(day)}
            className={`flex flex-col items-center justify-center px-4 py-2 rounded-full border text-sm font-medium transition-all duration-150 min-w-[72px]
              ${isActive
                ? "bg-purple-500 border-purple-300 text-white shadow-md"
                : "bg-neutral-800 border-neutral-600 text-gray-300 hover:bg-neutral-700 hover:border-purple-400"
              }`}
          >
            <span className="font-semibold">Day {day}</span>
            {meta && (
              <span className="text-xs mt-1 text-gray-300 opacity-80">
                {meta.icon} {meta.label}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}
