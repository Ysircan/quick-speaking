'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import DayTabs from './DayTabs'
import TaskDayMetaPanel from './TaskDayMetaPanel'

interface Track {
  id: string
  title: string
  durationDays: number
}

interface DayMeta {
  dayIndex: number
  goalType: string
}

export default function EditTrackPanel() {
  const { id: trackId } = useParams()
  const [track, setTrack] = useState<Track | null>(null)
  const [dayMetas, setDayMetas] = useState<DayMeta[]>([])
  const [activeDay, setActiveDay] = useState(1)

  useEffect(() => {
    if (!trackId) return

    fetch(`/api/create/track/${trackId}`)
      .then((res) => res.json())
      .then((data) => {
        setTrack(data.track)
        if (data.dayMetas) {
          setDayMetas(data.dayMetas)
        }
      })
      .catch((err) => console.error('加载失败', err))
  }, [trackId])

  const handleMetaSaved = (dayIndex: number, goalType: string) => {
    setDayMetas((prev) => {
      const others = prev.filter((d) => d.dayIndex !== dayIndex)
      return [...others, { dayIndex, goalType }]
    })
  }

  if (!track) return <div className="text-white">加载中...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">编辑训练营：{track.title}</h1>

      {/* 顶部 Tabs：第 1 天 ~ 第 N 天 */}
      <DayTabs
        totalDays={track.durationDays}
        activeDay={activeDay}
        onDayChange={(day) => setActiveDay(day)}
        dayMetas={dayMetas}
      />

      {/* 任务节奏设置区 */}
      <TaskDayMetaPanel
        dayIndex={activeDay}
        onMetaSaved={handleMetaSaved}
      />
    </div>
  )
}
