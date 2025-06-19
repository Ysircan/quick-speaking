'use client'

import { useParams } from 'next/navigation'
import EnrollButton from '@/components/store/enroll/EnrollButton'
import TrackDetail from '@/components/store/enroll/TrackDetail'

export default function StoreTrackPage() {
  const { id } = useParams()

  if (!id || typeof id !== 'string') {
    return <div className="p-8 text-red-500">无效的训练营 ID</div>
  }

  return (
    <div className="p-8 space-y-6">
      {/* Track 详情组件 */}
      <TrackDetail />

      {/* 报名按钮 */}
      <EnrollButton trackId={id} />
    </div>
  )
}
