'use client'

interface StatCardProps {
  label: string
  value: string | number
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md p-5 rounded-lg">
      <div className="text-xs text-white/60">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  )
}
