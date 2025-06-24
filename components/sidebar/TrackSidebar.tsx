'use client'

import { useEffect, useState } from 'react'

interface TrackSidebarData {
  title: string
  description: string | null
  durationDays: number
  isPublished: boolean
}

export default function TrackSidebar({ trackId }: { trackId: string }) {
  const [data, setData] = useState<TrackSidebarData | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        console.error('⚠️ No token found in localStorage')
        return
      }

      try {
        const res = await fetch(`/api/create/track/sidebar/${trackId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const json = await res.json()
        if (res.ok) {
          setData(json)
        } else {
          console.error('❌ Fetch failed:', json.error)
        }
      } catch (err) {
        console.error('❌ Error fetching track sidebar:', err)
      }
    }

    if (trackId) {
      fetchData()
    }
  }, [trackId])

  if (!data) return <div className="text-white">Loading Sidebar...</div>

  return (
    <aside className="w-64 bg-black/30 text-white p-4 space-y-4 border-r border-white/10 backdrop-blur-md">
      <div>
        <h2 className="text-lg font-bold">{data.title}</h2>
        <p className="text-sm text-white/50">{data.description}</p>
      </div>

      <div>
        <h3 className="text-sm font-semibold mb-1">Total Days</h3>
        <div className="flex flex-wrap gap-1">
          {Array.from({ length: data.durationDays }, (_, i) => (
            <div
              key={i}
              className="w-8 h-8 flex items-center justify-center rounded bg-white/10 hover:bg-white/20 cursor-pointer"
            >
              {i + 1}
            </div>
          ))}
        </div>
      </div>

      <div className="text-xs text-white/40">
        {data.isPublished ? '✅ Published' : '🚧 Unpublished'}
      </div>
    </aside>
  )
}
