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
      className="bg-white/5 backdrop-blur-md p-5 rounded-lg cursor-pointer hover:bg-white/10 transition"
    >
      <div className="font-semibold">{title}</div>
      {subtitle && <div className="text-xs text-white/60 mt-1">{subtitle}</div>}
    </div>
  )
}
