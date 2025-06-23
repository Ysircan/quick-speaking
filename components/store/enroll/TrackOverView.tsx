'use client'

import { useEffect, useState } from 'react'

interface Track {
  id: string
  title: string
  coverImage: string | null
  description?: string
}

export default function TrackOverview({ trackId }: { trackId: string }) {
  const [track, setTrack] = useState<Track | null>(null)
  const [enrolled, setEnrolled] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch(`/api/store/track/${trackId}`)
        const data = await res.json()
        setTrack(data)
      } catch (err) {
        console.error('❌ 拉取训练营失败:', err)
      }
    }

    const checkEnroll = async () => {
      try {
        const res = await fetch(`/api/store/enroll/status?trackId=${trackId}`)
        const data = await res.json()
        setEnrolled(data.enrolled ?? false)
      } catch (err) {
        console.error('❌ 查询报名状态失败:', err)
        setEnrolled(false)
      }
    }

    fetchTrack()
    checkEnroll()
  }, [trackId])

  const handleEnroll = async () => {
    setLoading(true)
    setMessage('')
    try {
      const res = await fetch('/api/store/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setEnrolled(true)
        setMessage('✅ 报名成功，训练营已加入你的库中！')
      } else {
        setMessage(data.error || '报名失败')
      }
    } catch (err) {
      console.error('报名异常:', err)
      setMessage('❌ 网络错误，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  if (!track) {
    return <div className="text-gray-500 p-10">加载中...</div>
  }

  return (
    <div>
      <div className="w-full h-56 bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow">
        🎯 欢迎来到训练营「{track.title}」
      </div>

      <main className="p-10 max-w-4xl mx-auto space-y-6">
        {track.description && (
          <p className="text-base text-gray-700">{track.description}</p>
        )}

        {enrolled === null ? (
          <p className="text-gray-400 text-sm">状态加载中...</p>
        ) : enrolled ? (
          <p className="text-green-600 font-semibold text-sm">🎉 你已报名该训练营</p>
        ) : (
          <button
            disabled={loading}
            onClick={handleEnroll}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded text-sm font-semibold disabled:bg-gray-400"
          >
            {loading ? '报名中...' : '加入我的课程'}
          </button>
        )}

        {message && <p className="text-sm text-gray-700 mt-2">{message}</p>}
      </main>
    </div>
  )
}
