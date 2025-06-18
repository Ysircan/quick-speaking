'use client'

import { useState } from 'react'
import { fetchWithToken } from '@/lib/fetchWithToken'

interface TrackActionButtonsProps {
  trackId: string
  isPublished: boolean
  onActionComplete?: () => void // 用于刷新列表
}

export default function TrackActionButtons({
  trackId,
  isPublished,
  onActionComplete,
}: TrackActionButtonsProps) {
  const [loading, setLoading] = useState(false)

  const handlePublish = async () => {
    setLoading(true)
    await fetchWithToken(`/api/create/tracklist/${trackId}/publish`, {
      method: 'PUT',
    })
    setLoading(false)
    onActionComplete?.()
  }

  const handleUnpublish = async () => {
    setLoading(true)
    await fetchWithToken(`/api/create/tracklist/${trackId}/unpublish`, {
      method: 'PUT',
    })
    setLoading(false)
    onActionComplete?.()
  }

  const handleDelete = async () => {
    if (!confirm('确定要删除这个训练营吗？操作不可撤销。')) return
    setLoading(true)
    await fetchWithToken(`/api/create/tracklist/${trackId}`, {
      method: 'DELETE',
    })
    setLoading(false)
    onActionComplete?.()
  }

  return (
    <div className="flex gap-2 mt-2">
      {isPublished ? (
        <>
          <button
            onClick={handleUnpublish}
            disabled={loading}
            className="px-3 py-1 bg-yellow-500 text-white rounded"
          >
            撤销发布
          </button>
        </>
      ) : (
        <>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            发布
          </button>
        </>
      )}

      <button
        onClick={handleDelete}
        disabled={loading}
        className="px-3 py-1 bg-red-600 text-white rounded"
      >
        删除
      </button>
    </div>
  )
}
