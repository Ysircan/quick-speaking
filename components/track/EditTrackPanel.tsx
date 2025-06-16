'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import DayTabs from './DayTabs'
import TaskDayMetaPanel from './TaskDayMetaPanel'

// 各类型任务面板
import StudyPanel from '@/components/task-content/StudyPanel'
import ExercisePanel from '@/components/task-content/ExercisePanel'
import ReadingPanel from '@/components/task-content/ReadingPanel'
import CheckinPanel from '@/components/task-content/CheckinPanel'
import TestPanel from '@/components/task-content/TestPanel'

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
  const [panelVisible, setPanelVisible] = useState(false)
  const [currentGoalType, setCurrentGoalType] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // 获取训练营数据
  useEffect(() => {
    if (!trackId) return

    fetch(`/api/create/track/${trackId}`)
      .then((res) => res.json())
      .then((data) => {
        setTrack(data.track)
        if (data.dayMetas) setDayMetas(data.dayMetas)
      })
      .catch((err) => console.error('加载失败', err))
  }, [trackId])

  // 点击泡泡时，更新当天 + 当前任务类型
  const handleDayChange = (day: number) => {
    setActiveDay(day)
    setPanelVisible(true)
    const found = dayMetas.find((d) => d.dayIndex === day)
    setCurrentGoalType(found?.goalType || null)
  }

  // 保存任务节奏配置 → 刷新右侧面板
  const handleMetaSaved = (dayIndex: number, goalType: string) => {
    setDayMetas((prev) => {
      const others = prev.filter((d) => d.dayIndex !== dayIndex)
      return [...others, { dayIndex, goalType }]
    })
    setCurrentGoalType(goalType)
  }

  // 点击页面空白区域关闭面板
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 渲染任务内容面板
  const renderGoalPanel = (goalType: string) => {
    switch (goalType) {
      case 'STUDY':
        return <StudyPanel />
      case 'EXERCISE':
        return <ExercisePanel />
      case 'READING':
        return <ReadingPanel />
      case 'CHECKIN':
        return <CheckinPanel />
      case 'TEST':
        return <TestPanel />
      default:
        return <div className="text-gray-500">无匹配任务类型</div>
    }
  }

  if (!track) return <div className="text-white">加载中...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">编辑训练营：{track.title}</h1>

      <DayTabs
        totalDays={track.durationDays}
        activeDay={activeDay}
        dayMetas={dayMetas}
        onDayChange={handleDayChange}
      />

      {panelVisible && (
        <div ref={panelRef} className="space-y-4">
          <TaskDayMetaPanel
            dayIndex={activeDay}
            onMetaSaved={handleMetaSaved}
          />
          {currentGoalType && renderGoalPanel(currentGoalType)}
        </div>
      )}
    </div>
  )
}
