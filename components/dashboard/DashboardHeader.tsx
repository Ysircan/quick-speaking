'use client'

import { useRouter } from 'next/navigation'

interface DashboardHeaderProps {
  userName: string
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const router = useRouter()

  return (
    <div className="text-center space-y-4 px-4 sm:px-0">
      <div className="text-xs sm:text-sm uppercase tracking-widest text-white/50">
        Welcome back
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold tracking-tight drop-shadow text-purple-100">
        {userName || '...'}
      </h1>

      <p className="text-white/60 text-sm max-w-md mx-auto px-2">
        You're shaping the future of learning. Continue where you left off.
      </p>

      <button
        onClick={() => router.push('/creator/dashboard/track/new')}
        className="mt-4 bg-purple-600 hover:bg-purple-700 px-5 py-2 text-sm sm:text-base text-white rounded-lg shadow-lg transition-all"
      >
        + Create New Track
      </button>
    </div>
  )
}
