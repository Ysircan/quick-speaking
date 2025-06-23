'use client'

interface StatCardProps {
  label: string
  value: string | number
}

export default function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="bg-white/5 backdrop-blur-md p-5 rounded-xl shadow-inner w-full sm:w-auto">
      <div className="text-xs sm:text-sm text-white/60 mb-1">{label}</div>
      <div className="text-2xl sm:text-3xl font-bold text-white">{value}</div>
    </div>
  )
}
