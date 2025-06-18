// File: D:\quick\app\creator\dashboard\track\[id]\content\page.tsx

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

import TrackContentHeader from '@/components/trackcontent/TrackContentHeader'
import EditTrackInfoForm from '@/components/trackcontent/EditTrackInfoForm'
import TrackDaySummaryList from '@/components/trackcontent/TrackDaySummaryList'

interface TaskItem {
  id: string
  dayIndex: number
  type: string
  content?: string
}

interface DayMeta {
  dayIndex: number
  goalType: string
  unlockMode: string
}

interface TrackData {
  id: string
  title: string
  description?: string
  coverImage?: string
  days: DayMeta[]
  tasks: TaskItem[]
}

export default function TrackContentPage() {
  const { id: trackId } = useParams()
  const router = useRouter()

  const [track, setTrack] = useState<TrackData | null>(null)
  const [loading, setLoading] = useState(true)

const fetchTrack = async () => {
  setLoading(true) // 确保初始状态设置
  try {
    const token = localStorage.getItem('token')
    if (!token) {
      throw new Error('未找到登录令牌，请重新登录')
    }

    const res = await fetch(`/api/create/track/${trackId}/content`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`请求失败 ${res.status}：${text}`)
    }

    const data = await res.json()
    setTrack(data)
  } catch (err) {
    console.error('❌ 加载失败:', err)
    setTrack(null) // 防止 stale 状态
  } finally {
    setLoading(false)
  }
}




  useEffect(() => {
    fetchTrack()
  }, [trackId])

  if (loading) return <p className="p-4">加载中...</p>
  if (!track) return <p className="p-4 text-red-600">无法加载训练营数据</p>

  return (
    <div className="space-y-8 p-6 max-w-4xl mx-auto">
      {/* 顶部封面和标题区 */}
      <TrackContentHeader
        title={track.title}
        description={track.description}
        coverImage={track.coverImage}
        onEditClick={() => {
          const el = document.getElementById('edit-info')
          el?.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {/* 编辑表单 */}
      <div id="edit-info">
        <h2 className="text-xl font-semibold mb-2">🛠 编辑基本信息</h2>
        <EditTrackInfoForm
          trackId={trackId as string}
          initialTitle={track.title}
          initialDescription={track.description}
          initialCoverImage={track.coverImage}
          onSaved={fetchTrack}
        />
      </div>

      {/* 每日任务概览 */}
      <div>
        <h2 className="text-xl font-semibold mb-2">📆 每日任务结构</h2>
        <TrackDaySummaryList
          days={track.days}
          tasks={track.tasks}
          onEditDay={(dayIndex) => {
            router.push(`/creator/dashboard/track/${trackId}/edit`)
          }}
        />
      </div>
    </div>
  )
}
