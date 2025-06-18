'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchWithToken } from '@/lib/fetchWithToken'

// UI + 控制面板组件
import DayTabs from './DayTabs'
import TaskDayMetaPanel from './TaskDayMetaPanel'

// 各类任务类型面板组件
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

  // ✅ 拉取 Track 内容（含 dayMetas）
  useEffect(() => {
    if (!trackId) return

    fetchWithToken(`/api/create/track/${trackId}`)
      .then((res) => {
        if (!res.ok) throw new Error('获取失败')
        return res.json()
      })
      .then((data) => {
        setTrack(data.track)
        if (data.dayMetas) setDayMetas(data.dayMetas)
      })
      .catch((err) => {
        console.error('❌ 加载 Track 失败:', err)
      })
  }, [trackId])

  // 切换天数（显示上方配置面板）
  const handleDayChange = (day: number) => {
    setActiveDay(day)
    setPanelVisible(true)
    const found = dayMetas.find((d) => d.dayIndex === day)
    setCurrentGoalType(found?.goalType || null)
  }

  // 保存某一天的配置
  const handleMetaSaved = (dayIndex: number, goalType: string) => {
    setDayMetas((prev) => {
      const others = prev.filter((d) => d.dayIndex !== dayIndex)
      return [...others, { dayIndex, goalType }]
    })
    setCurrentGoalType(goalType)
  }

  // 点击空白区域关闭上方面板
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 渲染目标任务类型对应的内容面板
  const renderGoalPanel = (goalType: string) => {
    switch (goalType) {
      case 'STUDY':
        return <StudyPanel />
      case 'EXERCISE':
        return <ExercisePanel trackId={track!.id} dayIndex={activeDay} />
      case 'READING':
        return <ReadingPanel />
      case 'CHECKIN':
        return <CheckinPanel />
      case 'TEST':
        return <TestPanel />
      default:
        return <div className="text-gray-500">No matching task type</div>
    }
  }

  // 加载状态
  if (!track) return <div className="text-white">Loading...</div>

  // ✅ 正常渲染
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Edit Bootcamp: {track.title}</h1>

      {/* Tab 切换每一天 */}
      <DayTabs
        totalDays={track.durationDays}
        activeDay={activeDay}
        dayMetas={dayMetas}
        onDayChange={handleDayChange}
      />

      {/* 顶部任务类型配置浮层 */}
      <div ref={panelRef} className={panelVisible ? 'block' : 'hidden'}>
        <TaskDayMetaPanel
          dayIndex={activeDay}
          onMetaSaved={handleMetaSaved}
        />
      </div>

      {/* 底部内容任务区域 */}
      <div className="mt-4">
        {currentGoalType ? (
          renderGoalPanel(currentGoalType)
        ) : (
          <div className="text-gray-500">Please configure a task type first</div>
        )}
      </div>
    </div>
  )
}
