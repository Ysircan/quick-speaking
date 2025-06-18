'use client'

import { useEffect, useState } from 'react'
import MyTrackList, { TrackItem } from '@/components/tracklist/MyTrackList'
import { fetchWithToken } from '@/lib/fetchWithToken'

export default function TrackDashboardPage() {
  const [tracks, setTracks] = useState<TrackItem[]>([])
  const [loading, setLoading] = useState(true)

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
      <h1 className="text-3xl font-bold text-white mb-6">我的训练营</h1>
      {loading ? (
        <p className="text-gray-300">加载中...</p>
      ) : (
        <MyTrackList tracks={tracks} onRefresh={fetchTracks} />
      )}
    </div>
  )
}
