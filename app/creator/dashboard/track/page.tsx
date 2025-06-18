'use client'

import { useRouter } from 'next/navigation'
import useAuth from '@/hooks/useAuth'
import LogoutButton from '@/components/auth/LogoutButton'
import MyTrackList from '@/components/tracklist/MyTrackList'

export default function CreatorDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 space-y-8">
      {/* 顶部欢迎区 */}
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">🎓 Welcome back, {user?.name}!</h1>
        <p className="text-sm text-gray-400">Your role: {user?.role}</p>

        <div className="mt-4 flex justify-center gap-4">
          <button
            onClick={() => router.push('/creator/dashboard/track/new')}
            className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-500"
          >
            ➕ 创建新训练营
          </button>
          <LogoutButton />
        </div>
      </div>

      {/* Track 列表区块 */}
      <div className="max-w-6xl mx-auto">
        <MyTrackList />
      </div>
    </div>
  )
}
