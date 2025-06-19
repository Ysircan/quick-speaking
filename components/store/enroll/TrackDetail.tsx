'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface TrackInfo {
  id: string
  title: string
  description?: string
  coverImage?: string
  durationDays: number
}

export default function TrackDetail() {
  const { id: trackId } = useParams()
  const [track, setTrack] = useState<TrackInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!trackId) return
    const fetchTrack = async () => {
      try {
        const res = await fetch(`/api/store/track/${trackId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || '加载失败')
        setTrack(data)
      } catch (err: any) {
        setError(err.message || '未知错误')
      } finally {
        setLoading(false)
      }
    }
    fetchTrack()
  }, [trackId])

  if (loading) return <p className="text-gray-500">加载中...</p>
  if (error || !track) return <p className="text-red-500">❌ {error || '加载失败'}</p>

  return (
    <section className="max-w-3xl mx-auto bg-white shadow rounded-xl p-6 space-y-4 mt-6">
      {track.coverImage ? (
        <img src={track.coverImage} alt="封面" className="rounded-xl w-full h-64 object-cover" />
      ) : (
        <div className="bg-gray-200 h-64 rounded-xl flex items-center justify-center text-gray-500">
          无封面图
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-800">{track.title}</h1>
      {track.description && <p className="text-gray-600">{track.description}</p>}
      <p className="text-sm text-gray-500">共 {track.durationDays} 天</p>
    </section>
  )
}
