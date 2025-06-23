'use client'

import { useEffect, useState } from 'react'
import TrackCard from './TrackCard'

interface Track {
  id: string
  title: string
  updatedAt: string
  status?: string
}

export default function RecentTracks() {
  const [tracks, setTracks] = useState<Track[]>([])

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token')
        if (!token) {
          console.warn('未登录：未找到 token')
          return
        }

        const res = await fetch('/api/create/tracklist', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) throw new Error(`请求失败：${res.status}`)

        const data = await res.json()
        setTracks(data.tracks || [])
      } catch (err) {
        console.error('拉取最近课程失败', err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="px-4 sm:px-0 space-y-4">
      <h3 className="text-base font-semibold text-white/80">
        Your Recent Tracks
      </h3>

      {tracks.length === 0 ? (
        <p className="text-sm text-white/50">No tracks created yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {tracks.map((track) => (
            <div
              key={track.id}
              onClick={() =>
                window.location.href = `/creator/dashboard/track/${track.id}/content`
              }
              className="cursor-pointer rounded-xl bg-white/5 p-4 backdrop-blur-sm hover:bg-white/10 transition-all"
            >
              <TrackCard
                title={track.title}
                subtitle={
                  track.status === 'DRAFT'
                    ? 'Draft'
                    : `Updated: ${new Date(track.updatedAt).toLocaleDateString()}`
                }
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
