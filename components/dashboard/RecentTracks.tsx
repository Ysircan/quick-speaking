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

        if (!res.ok) {
          throw new Error(`请求失败：${res.status}`)
        }

        const data = await res.json()
        setTracks(data.tracks || [])
      } catch (err) {
        console.error('拉取最近课程失败', err)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-white/80">Your Recent Tracks</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {tracks.map((track) => (
          <TrackCard
            key={track.id}
            title={track.title}
            subtitle={
              track.status === 'DRAFT'
                ? 'Draft'
                : `Updated: ${new Date(track.updatedAt).toLocaleDateString()}`
            }
            onClick={() => {
              window.location.href = `/creator/dashboard/track/${track.id}/content`
            }}
          />
        ))}
      </div>
    </div>
  )
}
