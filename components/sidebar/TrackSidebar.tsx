'use client'

import { useEffect, useState } from 'react'
import SidebarHeader from './SidebarHeader'
import DayList from './DayList'
import AddDayButton from './AddDayButton'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface TrackSidebarData {
  title: string
  description: string | null
  isPublished: boolean
  dayMetas: { dayIndex: number }[]
}

export default function TrackSidebar({ trackId }: { trackId: string }) {
  const [data, setData] = useState<TrackSidebarData | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const fetchData = async () => {
    const token = localStorage.getItem('token')
    if (!token) return

    try {
      const res = await fetch(`/api/create/track/sidebar/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const json = await res.json()
      if (res.ok) setData(json)
      else console.error('❌ Failed to fetch:', json.error)
    } catch (err) {
      console.error('❌ Network error:', err)
    }
  }

  useEffect(() => {
    fetchData()
  }, [trackId, refreshKey])

  useEffect(() => {
    if (!message) return
    setFadeOut(false)
    const t1 = setTimeout(() => setFadeOut(true), 2000)
    const t2 = setTimeout(() => setMessage(null), 3000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [message])

  const handleDeleteDay = async (dayIndex: number, displayNumber: number) => {
    const token = localStorage.getItem('token')
    if (!token) return

    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch(
        `/api/create/track/sidebar/${trackId}/day/${dayIndex}/delete`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      const json = await res.json()
      if (res.ok) {
        setMessage(`✅ Day ${displayNumber} deleted`)
        setRefreshKey((k) => k + 1)
      } else {
        setMessage(`❌ Failed: ${json.error || 'Unknown error'}`)
      }
    } catch {
      setMessage('❌ Network error while deleting')
    } finally {
      setLoading(false)
    }
  }

  if (!data) return <div className="text-white p-4">Loading Sidebar...</div>

  return (
    <div className="w-full h-full backdrop-blur-md bg-[#1a1a3a]/80 px-4 py-6">
      <div className="mb-6 flex justify-end">
        <button
          className="text-white hover:text-yellow-300 transition"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          <SidebarHeader
            title={data.title}
            description={data.description}
            isPublished={data.isPublished}
          />
          <DayList dayMetas={data.dayMetas} onDelete={handleDeleteDay} />
          <AddDayButton
            trackId={trackId}
            currentDayCount={data.dayMetas.length}
            onSuccess={() => setRefreshKey((k) => k + 1)}
          />
          {message && (
            <p
              className={`text-xs text-white/70 transition-opacity duration-1000 ${
                fadeOut ? 'opacity-0' : 'opacity-100'
              }`}
            >
              {message}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
