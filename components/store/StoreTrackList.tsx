'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Track {
  id: string
  title: string
  description: string | null
  coverImage: string | null
}

export default function StoreTrackList() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/store')
      .then((res) => res.json())
      .then((data) => setTracks(data))
      .catch((err) => console.error('❌ 获取训练营失败:', err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <p className="text-gray-500">加载中...</p>
  }

  return (
    <section className="space-y-8">
      <h2 className="text-2xl font-semibold text-gray-900">🛒 热门训练营</h2>
      {tracks.length === 0 ? (
        <p className="text-gray-500">暂无训练营</p>
      ) : (
        <div className="grid grid-cols-3 gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() => router.push(`/camp/${track.id}`)}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                {track.coverImage ? (
                  <img
                    src={track.coverImage}
                    alt={track.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  '暂无封面'
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-base mb-1 text-gray-900">
                  {track.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {track.description || '暂无简介'}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
