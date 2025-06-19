'use client'

import { useState } from 'react'
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
      <button
        onClick={handleEnroll}
        disabled={enrolling}
        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
      >
        立即报名训练营
      </button>
      {message && <div className="text-sm text-gray-600">{message}</div>}
    </div>
  )
}
