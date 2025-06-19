'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import StudyPanel from '@/components/task-content/StudyPanel'
import ExercisePanel from '@/components/task-content/ExercisePanel'
import ReadingPanel from '@/components/task-content/ReadingPanel'
import CheckinPanel from '@/components/task-content/CheckinPanel'
import TestPanel from '@/components/task-content/TestPanel'

import {fetchWithToken} from '@/lib/fetchWithToken'

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
  const [totalDays, setTotalDays] = useState(1)
  const [activeDay, setActiveDay] = useState(1)
  const [panelVisible, setPanelVisible] = useState(false)
  const [currentGoalType, setCurrentGoalType] = useState<string | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // 拉取训练营信息（含天数和 dayMetas）
  useEffect(() => {
    if (!trackId) return

    fetchWithToken(`/api/create/track/${trackId}`)
      .then((res) => {
        if (!res.ok) throw new Error('获取失败')
        return res.json()
      })
      .then((data) => {
        setTrack(data.track)
        setDayMetas(data.dayMetas || [])
        setTotalDays(data.track.durationDays || 1)
        setActiveDay(1)
      })
      .catch((err) => {
        console.error('❌ 加载 Track 失败:', err)
      })
  }, [trackId])

  // 同步更新天数到数据库
  const updateDurationDays = async (newDays: number) => {
    setTotalDays(newDays)
    if (!trackId) return
    try {
      await fetchWithToken(`/api/create/track/${trackId}/duration`, {
        method: 'PUT',
        body: JSON.stringify({ durationDays: newDays }),
      })
    } catch (err) {
      console.error('更新天数失败', err)
    }
    setActiveDay((prev) => (prev > newDays ? newDays : prev))
  }

  // 切换天数
  const handleDayChange = (day: number) => {
    setActiveDay(day)
    setPanelVisible(true)
    const found = dayMetas.find((d) => d.dayIndex === day)
    setCurrentGoalType(found?.goalType || null)
  }

  // 保存一天的配置
  const handleMetaSaved = (dayIndex: number, goalType: string) => {
    setDayMetas((prev) => {
      const others = prev.filter((d) => d.dayIndex !== dayIndex)
      return [...others, { dayIndex, goalType }]
    })
    setCurrentGoalType(goalType)
  }

  // 点击空白区域关闭配置面板
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setPanelVisible(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // 渲染对应任务类型面板
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
        return <div className="text-gray-500">Please configure a task type first</div>
    }
  }

  if (!track) return <div className="text-white">Loading...</div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Edit Bootcamp: {track.title}</h1>

      <DayTabs
        totalDays={totalDays}
        activeDay={activeDay}
        dayMetas={dayMetas}
        onDayChange={handleDayChange}
        onAddDay={() => updateDurationDays(totalDays + 1)}
        onRemoveDay={() => updateDurationDays(Math.max(1, totalDays - 1))}
      />

      <div ref={panelRef} className={panelVisible ? 'block' : 'hidden'}>
        <TaskDayMetaPanel dayIndex={activeDay} onMetaSaved={handleMetaSaved} />
      </div>

      <div className="mt-4">{renderGoalPanel(currentGoalType || '')}</div>
    </div>
  )
}
