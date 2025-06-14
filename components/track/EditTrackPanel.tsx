"use client"

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"

interface TaskItem {
  id: string
  dayIndex: number
  type: string
  content?: string
}

interface TrackData {
  id: string
  title: string
  description: string
  durationDays: number
  unlockMode: string
  tags: string[]
  recommendedFor: string[]
  isFree: boolean
  isPublished: boolean
  tasks: TaskItem[]
}

interface EditTrackPanelProps {
  onTrackLoaded?: (track: TrackData) => void
  activeDay?: number
  onDayChange?: (day: number) => void
}

export default function EditTrackPanel({
  onTrackLoaded,
  activeDay: externalActiveDay,
  onDayChange,
}: EditTrackPanelProps) {
  const { id: trackId } = useParams()
  const [internalActiveDay, setInternalActiveDay] = useState(1)
  const [fetched, setFetched] = useState(false)

  const activeDay = externalActiveDay ?? internalActiveDay
  const setActiveDay = onDayChange ?? setInternalActiveDay

  const calledRef = useRef(false)

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch(`/api/create/track/${trackId}`)
        const data = await res.json()

        // 只调用一次 onTrackLoaded（避免父组件反复渲染）
        if (!calledRef.current) {
          onTrackLoaded?.(data.track)
          calledRef.current = true
        }

        setFetched(true)
      } catch (err) {
        console.error("❌ 加载训练营失败：", err)
      }
    }

    fetchTrack()
  }, [trackId, onTrackLoaded])

  return null
}
