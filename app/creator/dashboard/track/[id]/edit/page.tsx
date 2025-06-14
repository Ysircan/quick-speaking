"use client"

import { useState } from "react"
import DayTabs from "@/components/track/DayTabs"
import EditTrackPanel from "@/components/track/EditTrackPanel"
import AIQuestionForm from "@/components/ai/AIQuestionForm"
import TaskPreviewPanel from "@/components/track/TaskPreviewPanel"
import useAuth from "@/hooks/useAuth"
import { TaskItem, TrackData } from "@/types/task"

export default function EditTrackPage() {
  const { user, loading } = useAuth()
  const [track, setTrack] = useState<TrackData | null>(null)
  const [activeDay, setActiveDay] = useState<number>(1)
  const [localTasks, setLocalTasks] = useState<TaskItem[]>([])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        加载中...
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        未授权访问，请先登录。
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 text-white space-y-6">
      {track && (
        <div className="bg-neutral-900 border border-neutral-700 rounded-xl p-6 shadow text-white">
          <h1 className="text-2xl md:text-3xl font-bold">
            🎯 当前训练营：<span className="text-purple-300">{track.title}</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            共 {track.durationDays} 天 · 当前第 {activeDay} 天
          </p>
        </div>
      )}

      <DayTabs
        totalDays={track?.durationDays || 1}
        activeDay={activeDay}
        onChange={(day) => {
          setActiveDay(day)
          setLocalTasks([])
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">🧠 创建任务内容</h2>
          {track && (
            <AIQuestionForm
              trackId={track.id}
              dayIndex={activeDay}
              onGenerated={(newQuestions: TaskItem[]) => {
                const withId = newQuestions.map((q, i) => ({
                  ...q,
                  id: `${Date.now()}-${i}`,
                }))
                setLocalTasks((prev) => [...prev, ...withId])
              }}
            />
          )}
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">⚙️ 当前任务配置</h2>
          {track ? (
            <TaskPreviewPanel
              tasks={localTasks}
              dayIndex={activeDay}
              trackId={track.id}
              onUpdate={(updated: TaskItem[]) => setLocalTasks(updated)}
            />
          ) : (
            <p className="text-sm text-gray-500">请等待训练营加载完成...</p>
          )}
        </div>
      </div>

      <EditTrackPanel
        activeDay={activeDay}
        onDayChange={(day) => {
          setActiveDay(day)
          setLocalTasks([])
        }}
        onTrackLoaded={(trackData: TrackData) => {
          setTrack(trackData)
        }}
      />
    </div>
  )
}
