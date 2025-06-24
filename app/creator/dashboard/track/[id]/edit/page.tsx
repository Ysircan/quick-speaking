'use client'

import { useParams } from 'next/navigation'
import TrackSidebar from '@/components/sidebar/TrackSidebar'
import Background from '@/components/default/background'

export default function TrackEditPage() {
  const params = useParams()
  const trackId = params?.id as string

  if (!trackId) return <div className="text-white">Missing track ID</div>

  return (
    <>
      {/* 背景层 */}
      <Background />

      {/* 内容层 */}
      <div className="relative z-10 flex h-screen overflow-hidden">
        <TrackSidebar trackId={trackId} />
        <main className="flex-1 p-8 text-white overflow-y-auto">
          <h1 className="text-2xl font-bold mb-2">Track Editing</h1>
        </main>
      </div>
    </>
  )
}
