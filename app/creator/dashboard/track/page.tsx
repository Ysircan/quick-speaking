'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import MyTrackList, { TrackItem } from '@/components/tracklist/MyTrackList'
import { fetchWithToken } from '@/lib/fetchWithToken'

export default function TrackDashboardPage() {
  const [tracks, setTracks] = useState<TrackItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchTracks = () => {
    setLoading(true)
    fetchWithToken('/api/create/tracklist')
      .then((res) => res.json())
      .then((data) => {
        setTracks(data.tracks)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchTracks()
  }, [])

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">我的训练营</h1>
        <button
          onClick={() => router.push('/creator/dashboard/track/new')}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          ➕ 新建训练营
        </button>
      </div>

      {loading ? (
        <p className="text-gray-300">加载中...</p>
      ) : (
        <MyTrackList tracks={tracks} onRefresh={fetchTracks} />
      )}
    </div>
  )
}
