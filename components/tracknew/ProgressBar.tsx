'use client'

interface ProgressBarProps {
  step: number
  total: number
}

export default function ProgressBar({ step, total }: ProgressBarProps) {
  const percent = Math.floor((step / (total - 1)) * 100)
  return (
    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-yellow-400 transition-all duration-500"
        style={{ width: `${percent}%` }}
      />
    </div>
  )
}
