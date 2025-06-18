'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import TrackHeaderEditor from '@/components/trackcontent/TrackHeaderEditor'
import {fetchWithToken} from '@/lib/fetchWithToken'

export default function TrackContentPage() {
  const params = useParams()
  const trackId = Array.isArray(params.id) ? params.id[0] : params.id

  const [track, setTrack] = useState<{
    id: string
    title: string
    description: string
    coverImage: string
  } | null>(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!trackId) return
    const load = async () => {
      try {
        const res = await fetchWithToken(`/api/create/track/content/${trackId}`)
        const data = await res.json()
        if (!res.ok) throw new Error(data.error || '加载失败')
        setTrack(data)
      } catch (err: any) {
        setError(err.message || '出错了')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [trackId])

  if (loading) return <p>加载中...</p>
  if (error) return <p className="text-red-500">{error}</p>
  if (!track) return <p>未找到训练营</p>

  return (
    <main className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">训练营内容编辑</h1>
      <TrackHeaderEditor
        trackId={track.id}
        initialTitle={track.title}
        initialDescription={track.description}
        initialCoverImage={track.coverImage}
      />
    </main>
  )
}
