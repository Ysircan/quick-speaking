'use client'

import Image from 'next/image'
import TrackActionButtons from './TrackActionButtons'

interface TrackCardProps {
  id: string
  title: string
  coverImage?: string | null
  durationDays: number
  isPublished: boolean
  onRefresh?: () => void
}

export default function TrackCard({
  id,
  title,
  coverImage,
  durationDays,
  isPublished,
  onRefresh,
}: TrackCardProps) {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-md flex flex-col md:flex-row">
      {/* 封面图 */}
      <div className="w-full md:w-40 h-32 md:h-auto bg-gray-700 relative">
        {coverImage ? (
          <Image
            src={coverImage}
            alt="封面"
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            无封面
          </div>
        )}
      </div>

      {/* 右侧信息 */}
      <div className="flex-1 p-4 text-white flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-300">{durationDays} 天训练营</p>
        </div>

        {/* 状态 + 操作 */}
        <div className="mt-3 flex items-center justify-between flex-wrap gap-2">
          <span className={`text-xs px-2 py-1 rounded-full ${isPublished ? 'bg-green-700' : 'bg-yellow-700'}`}>
            {isPublished ? '已发布' : '草稿'}
          </span>
          <TrackActionButtons
            trackId={id}
            isPublished={isPublished}
            onActionComplete={onRefresh}
          />
        </div>
      </div>
    </div>
  )
}
