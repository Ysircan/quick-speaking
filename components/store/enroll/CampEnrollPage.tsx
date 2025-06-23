'use client'

import { useEffect, useState } from 'react'

interface User {
  id: string
  role: 'CREATOR' | 'PARTICIPANT'
}

interface CampEnrollPageProps {
  trackId: string
  user: User | null
}

export default function CampEnrollPage({ trackId, user }: CampEnrollPageProps) {
  const [enrolled, setEnrolled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

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

  // 非登录用户或未传入身份
  if (!user) {
    return <div className="text-red-500">请先登录后再报名</div>
  }

  // 不是学生账号
  if (user.role !== 'PARTICIPANT') {
    return <div className="text-yellow-600">只有学生账号才能报名该训练营</div>
  }

  return (
    <div className="space-y-4">
      {enrolled ? (
        <div className="text-green-600 font-semibold">🎉 你已成功报名本训练营</div>
      ) : (
        <button
          onClick={handleEnroll}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-sm font-semibold disabled:bg-gray-400"
        >
          {loading ? '报名中...' : '立即报名'}
        </button>
      )}
      {message && <p className="text-sm text-gray-700">{message}</p>}
    </div>
  )
}
