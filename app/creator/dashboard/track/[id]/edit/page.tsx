"use client"

import { useEffect, useRef, useState } from "react"
import DayTabs from "@/components/track/DayTabs"
import EditTrackPanel from "@/components/track/EditTrackPanel"
import AIQuestionForm from "@/components/ai/AIQuestionForm"
import TaskPreviewPanel from "@/components/track/TaskPreviewPanel"
import DayMetaPanel, { DayMeta } from "@/components/track/TaskDayMetaPanel"
import TaskConfigPanel from "@/components/track/TaskConfigPanel"
import useAuth from "@/hooks/useAuth"
import type { TaskItem, TrackData } from "@/types/task"

export default function EditTrackPage() {
  const { user, loading } = useAuth()
  const [track, setTrack] = useState<TrackData | null>(null)
  const [activeDay, setActiveDay] = useState(1)
  const [localTasks, setLocalTasks] = useState<TaskItem[]>([])
  const [dayMeta, setDayMeta] = useState<DayMeta>({ dayIndex: 1, goalType: "CHECKIN", unlockMode: "DAILY" })
  const [dayMetaMap, setDayMetaMap] = useState<{ [index: number]: string }>({})
  const [showDayMetaPanel, setShowDayMetaPanel] = useState(false)
  const metaPanelRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      setTimeout(() => {
        if (metaPanelRef.current && !metaPanelRef.current.contains(e.target as Node)) {
          setShowDayMetaPanel(false)
        }
      }, 0)
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (!track) return
    const fetchMeta = async () => {
      const res = await fetch(`/api/create/track/day?trackId=${track.id}&dayIndex=${activeDay}`)
      const data = await res.json()
      if (data?.meta) {
        setDayMeta({ ...data.meta, dayIndex: activeDay })
      } else {
        setDayMeta({ dayIndex: activeDay, goalType: "CHECKIN", unlockMode: "DAILY" })
      }
    }
    fetchMeta()
  }, [track, activeDay])

  const handleSaveMeta = async (updatedMeta: DayMeta) => {
    try {
      const res = await fetch("/api/create/track/day", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...updatedMeta, trackId: track?.id }),
      })
      const data = await res.json()
      if (data.success) {
        setDayMeta(updatedMeta)
        setDayMetaMap((prev) => ({
          ...prev,
          [updatedMeta.dayIndex]: updatedMeta.goalType,
        }))
        setShowDayMetaPanel(false)
      }
    } catch (err) {
      console.error("保存失败", err)
    }
  }

  const goalTypeLabel = (type: string) => {
    switch (type) {
      case "CHECKIN": return "打卡任务"
      case "STUDY": return "学习任务"
      case "EXERCISE": return "练习任务"
      case "READING": return "阅读任务"
      case "TEST": return "测试任务"
      case "CUSTOM": return "自定义任务"
      default: return "未知任务"
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-400">加载中...</div>
  if (!user) return <div className="min-h-screen flex items-center justify-center text-red-500">未授权访问，请先登录。</div>

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8 text-white font-sans">
      {track && (
        <div className="bg-gradient-to-br from-purple-800 to-neutral-900 border border-purple-700 rounded-2xl p-6 shadow-xl">
          <h1 className="text-4xl font-bold mb-2">
            🎯 当前训练营：<span className="text-purple-300">{track.title}</span>
          </h1>
          <p className="text-sm text-gray-300">
            共 {track.durationDays} 天 · 当前第 {activeDay} 天（{goalTypeLabel(dayMeta.goalType)}）
          </p>
        </div>
      )}

      <DayTabs
        totalDays={track?.durationDays || 1}
        activeDay={activeDay}
        dayMetas={dayMetaMap}
        onChange={(day) => {
          setActiveDay(day)
          setLocalTasks([])
          setShowDayMetaPanel(true)
        }}
      />

      {track && showDayMetaPanel && (
        <div className="mt-6 relative z-50">
          <div ref={metaPanelRef} className="rounded-2xl border border-gray-700 bg-neutral-800 p-6 shadow-2xl backdrop-blur-md">
            <DayMetaPanel dayMeta={dayMeta} onSave={handleSaveMeta} />
          </div>
        </div>
      )}

      {/* 三栏布局：左中右 */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-8 pt-8">
        {/* 左侧：出题区 */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-purple-200">🧠 创建任务内容</h2>
          {track && dayMeta.goalType === "EXERCISE" ? (
            <AIQuestionForm
              trackId={track.id}
              dayIndex={activeDay}
              onGenerated={(newQuestions) => {
                const withId = newQuestions.map((q, i) => ({ ...q, id: `${Date.now()}-${i}` }))
                setLocalTasks((prev) => [...prev, ...withId])
              }}
            />
          ) : (
            <p className="text-sm text-gray-400">
              🧭 当前为 <strong>{goalTypeLabel(dayMeta.goalType)}</strong>，无需出题。
            </p>
          )}
        </div>

        {/* 中间：任务预览 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-2 text-purple-200">📋 当前任务</h2>
          <TaskPreviewPanel
            tasks={localTasks}
            dayIndex={activeDay}
            trackId={track?.id || ''}
            onUpdate={setLocalTasks}
          />
        </div>

        {/* 右侧：配置卡牌掉落 */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold mb-2 text-purple-200">🎁 掉落设置</h2>
          <TaskConfigPanel
            tasks={localTasks}
            creatorId={user.id}
            trackId={track?.id || ''}
            dayIndex={activeDay}
          />
        </div>
      </div>

      <EditTrackPanel
        activeDay={activeDay}
        onDayChange={(day) => {
          setActiveDay(day)
          setLocalTasks([])
        }}
        onTrackLoaded={(loadedTrack: TrackData) => setTrack(loadedTrack)}
      />
    </div>
  )
}  