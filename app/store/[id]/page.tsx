'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import StoreNavbar from '@/components/store/layout/StoreNavbar'
import TrackOverview from '@/components/store//enroll/TrackOverView'

export default function CampPage() {
  const params = useParams()
  const trackId = params.id as string
  const [trackTitle, setTrackTitle] = useState('')

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const res = await fetch(`/api/store/track/${trackId}`)
        const data = await res.json()
        setTrackTitle(data.title || '')
      } catch (err) {
        console.error('❌ 获取标题失败:', err)
      }
    }

    fetchTitle()
  }, [trackId])

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <StoreNavbar />

    

      {/* 主内容组件（不动） */}
      <main className="p-10 max-w-4xl mx-auto space-y-6">
        <TrackOverview trackId={trackId} />
      </main>
    </div>
  )
}
