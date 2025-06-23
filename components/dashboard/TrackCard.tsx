'use client'

interface TrackCardProps {
  title: string
  subtitle?: string
  onClick?: () => void
}

export default function TrackCard({ title, subtitle, onClick }: TrackCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white/5 backdrop-blur-md p-4 sm:p-5 rounded-lg cursor-pointer hover:bg-white/10 transition w-full"
    >
      <div className="font-semibold text-base sm:text-lg">{title}</div>
      {subtitle && (
        <div className="text-xs sm:text-sm text-white/60 mt-1">{subtitle}</div>
      )}
    </div>
  )
}
