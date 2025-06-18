'use client'

import React from 'react'
import TrackActionButtons from './TrackActionButtons'
import TrackCard from './TrackCard'


export interface TrackItem {
  id: string
  title: string
  coverImage: string | null
  durationDays: number
  isPublished: boolean
  createdAt: string
}

interface MyTrackListProps {
  tracks: TrackItem[]
  onRefresh?: () => void
}

export default function MyTrackList({ tracks, onRefresh }: MyTrackListProps) {
  const draftTracks = tracks.filter((t) => !t.isPublished)
  const publishedTracks = tracks.filter((t) => t.isPublished)

  return (
    <div className="space-y-8">
 {/* 草稿区 */}
<section>
  <h2 className="text-xl font-bold text-white mb-2">📝 草稿区</h2>
  {draftTracks.length === 0 ? (
    <p className="text-gray-400">暂无草稿</p>
  ) : (
    <div className="space-y-4">
      {draftTracks.map((track) => (
        <TrackCard
          key={track.id}
          id={track.id}
          title={track.title}
          coverImage={track.coverImage}
          durationDays={track.durationDays}
          isPublished={track.isPublished}
          onRefresh={onRefresh}
        />
      ))}
    </div>
  )}
</section>

      {/* 已发布区 */}
      <section>
        <h2 className="text-xl font-bold text-white mb-2">📣 已发布</h2>
        {publishedTracks.length === 0 ? (
          <p className="text-gray-400">暂无已发布训练营</p>
        ) : (
          <ul className="space-y-2">
            {publishedTracks.map((track) => (
              <li key={track.id} className="bg-blue-900 p-4 rounded-lg text-white">
                <div className="font-semibold">
                  {track.title}（{track.durationDays}天）
                </div>
                <TrackActionButtons
                  trackId={track.id}
                  isPublished={track.isPublished}
                  onActionComplete={onRefresh}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
