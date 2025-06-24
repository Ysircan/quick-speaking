'use client'

import { useParams } from 'next/navigation'
import DefaultBackground from '@/components/default/background'
import TrackSidebar from '@/components/sidebar/TrackSidebar'
import VerticalSplitPanel from '@/components/layout/VerticalSplitPanel'

export default function TrackEditPage() {
  const params = useParams()
  const trackId = params?.id as string

  if (!trackId) return <div className="text-white">Missing track ID</div>

  return (
    <div className="relative w-full h-screen overflow-hidden text-white">
      <DefaultBackground />

      <div className="relative z-10 flex h-full">
        {/* Sidebar：无背景，仅控制宽度与边框 */}
        <aside className="w-64 shrink-0 overflow-hidden z-20 border-r border-white/10">
          <TrackSidebar trackId={trackId} />
        </aside>

        {/* 主内容区：不要加 padding，内容内部控制 */}
        <main className="flex-1 overflow-hidden">
          <VerticalSplitPanel
            top={<div className="p-6">☝️ 上方任务配置区域</div>}
            bottom={<div className="p-6">👇 下方任务编辑区域</div>}
          />
        </main>
      </div>
    </div>
  )
}
