'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { fetchWithToken } from '@/lib/fetchWithToken'
import useAuth from '@/hooks/useAuth'

interface EnrollButtonProps {
  trackId: string
}

export default function EnrollButton({ trackId }: EnrollButtonProps) {
  const router = useRouter()
  const { user, loading } = useAuth()
  const [enrolling, setEnrolling] = useState(false)
  const [message, setMessage] = useState('')
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    const checkEnrolled = async () => {
      if (!user || user.role !== 'PARTICIPANT') return
      try {
        const res = await fetchWithToken('/api/store/enroll/status', {
          method: 'POST',
          body: JSON.stringify({ trackId }),
        })
        const data = await res.json()
        if (data.enrolled) setEnrolled(true)
      } catch (err) {
        console.error('❌ 获取报名状态失败')
      }
    }

    checkEnrolled()
  }, [user, trackId])

  const handleEnroll = async () => {
    if (!user) {
      setMessage('⚠️ 请先登录后再报名训练营')
      return
    }

    if (user.role !== 'PARTICIPANT') {
      setMessage('⚠️ 仅学生账号可报名该训练营')
      return
    }

    setEnrolling(true)
    try {
      const res = await fetchWithToken('/api/store/enroll', {
        method: 'POST',
        body: JSON.stringify({ trackId }),
      })
      const data = await res.json()

      if (!res.ok) {
        setMessage(data.error || '报名失败')
        return
      }

      setMessage('✅ 报名成功，准备进入训练营...')
      setTimeout(() => {
        router.push(`/camp/${trackId}`)
      }, 1000)
    } catch (err) {
      setMessage('报名异常，请稍后重试')
    } finally {
      setEnrolling(false)
    }
  }

  if (loading) return null

  return (
    <div className="space-y-2">
      {enrolled ? (
        <button
          onClick={() => router.push(`/camp/${trackId}`)}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          进入训练营
        </button>
      ) : (
        <button
          onClick={handleEnroll}
          disabled={enrolling}
          className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        >
          立即报名训练营
        </button>
      )}
      {message && <div className="text-sm text-gray-600">{message}</div>}
    </div>
  )
}
