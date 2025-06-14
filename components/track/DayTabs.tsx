// components/track/DayTabs.tsx

interface DayTabsProps {
  totalDays: number
  activeDay: number
  onChange: (day: number) => void
}

export default function DayTabs({ totalDays, activeDay, onChange }: DayTabsProps) {
  return (
    <div className="flex flex-wrap gap-3 py-4">
      {Array.from({ length: totalDays }).map((_, i) => {
        const day = i + 1;
        const isActive = activeDay === day;

        return (
          <button
            key={day}
            onClick={() => onChange(day)}
            className={`px-5 py-2 rounded-full border text-sm font-medium transition-all duration-150
              ${isActive
                ? "bg-purple-500 border-purple-300 text-white shadow-md"
                : "bg-neutral-800 border-neutral-600 text-gray-300 hover:bg-neutral-700 hover:border-purple-400"
              }`}
          >
            Day {day}
          </button>
        );
      })}
    </div>
  );
}
