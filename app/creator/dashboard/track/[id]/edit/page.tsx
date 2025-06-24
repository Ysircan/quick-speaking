'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import DefaultBackground from '@/components/default/background'
import TrackSidebar from '@/components/sidebar/TrackSidebar'
import VerticalSplitPanel from '@/components/layout/VerticalSplitPanel'
import TopSettingPanel from '@/components/content/Topsetting/TopSettingPanel'

export default function TrackEditPage() {
  const params = useParams()
  const trackId = params?.id as string

  // 当前选中的 dayId 和 dayIndex（未来 Sidebar 切换时传入）
  const [activeDayId, setActiveDayId] = useState<string | null>(null)
  const [activeDayIndex, setActiveDayIndex] = useState<number>(0)

  // ⚠️ 示例：默认 dayId = trackId + '_day0'（你应替换为实际 dayId）
  useEffect(() => {
    if (trackId) {
      setActiveDayId(`${trackId}_day0`)
      setActiveDayIndex(0)
    }
  }, [trackId])

  if (!trackId) return <div className="text-white">Missing track ID</div>
  if (!activeDayId) return <div className="text-white">Loading day...</div>

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      <DefaultBackground />

      <div className="relative z-10 flex h-full">
        {/* Sidebar 区域 */}
        <aside className="w-64 shrink-0 overflow-hidden z-20 border-r border-white/10">
          <TrackSidebar
            trackId={trackId}
            // 将来这里可以加 onDaySelect={(id, index) => { ... }}
          />
        </aside>

        {/* 主画布区域 */}
        <main className="flex-1 overflow-hidden">
          <VerticalSplitPanel
            top={
              <div className="p-6">
                <TopSettingPanel
                  trackId={trackId}
                  dayId={activeDayId}
                  dayIndex={activeDayIndex}
                />
              </div>
            }
            bottom={
              <div className="p-6">
                👇 Task editing area goes here.
              </div>
            }
          />
        </main>
      </div>
    </div>
  )
}
