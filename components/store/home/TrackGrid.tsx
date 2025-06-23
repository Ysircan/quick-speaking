'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Track {
  id: string
  title: string
  coverImage: string | null
  durationDays?: number // ← 后端没返回 durationDays 也不会报错
}

export default function TrackGrid() {
  const [tracks, setTracks] = useState<Track[]>([])

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const res = await fetch('/api/store')
        const data = await res.json()
        setTracks(data || []) // ✅ 修正点：直接取 data（是数组）
      } catch (err) {
        console.error('❌ 拉取课程失败:', err)
      }
    }

    fetchTracks()
  }, [])

  if (tracks.length === 0) {
    return <div className="text-gray-500">暂无训练营</div>
  }

  return (
    <section className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <Link
            key={track.id}
            href={`/store/${track.id}`}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="h-32 bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
              {track.coverImage ? (
                <img
                  src={track.coverImage}
                  className="w-full h-full object-cover"
                  alt={track.title}
                />
              ) : (
                <>暂无封面</>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-base mb-1 text-gray-900">
                {track.title}
              </h3>
              <p className="text-sm text-gray-600">
                {track.durationDays ? `${track.durationDays} 天训练营` : '训练营'}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
