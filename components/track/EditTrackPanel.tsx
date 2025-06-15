'use client'

import { useEffect, useRef, useState } from "react"
import { useParams } from "next/navigation"
import type { TrackData } from "@/types/task"

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
  const setActiveDay = onDayChange ?? setInternalActiveDay
  const calledRef = useRef(false)

  useEffect(() => {
    const fetchTrack = async () => {
      try {
        const res = await fetch(`/api/create/track/${trackId}`)
        const data = await res.json()
        if (data?.track && !calledRef.current) {
          onTrackLoaded?.(data.track)
          calledRef.current = true
        }
      } catch (err) {
        console.error("❌ 加载训练营失败：", err)
      }
    }

    if (trackId) fetchTrack()
  }, [trackId, onTrackLoaded])

  return null
}
