'use client'

import { useState } from 'react'
import { fetchWithToken } from '@/lib/fetchWithToken'

interface Task {
  id: string
  type: string
  order: number
  appearanceWeight: number
  createdAt: string
  content?: string
  correctAnswer?: string // ✅ 加上它！
}

interface DayTaskListProps {
  trackId: string
  durationDays: number
}

export default function DayTaskList({ trackId, durationDays }: DayTaskListProps) {
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTasks = async (dayIndex: number) => {
    setSelectedDay(dayIndex)
    setLoading(true)
    setError(null)

    try {
      const res = await fetchWithToken(`/api/create/track/content/${trackId}/day/${dayIndex}/tasks`)
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || '任务获取失败')
      }

      setTasks(data)
    } catch (err: any) {
      console.error('获取任务失败:', err)
      setError(err.message || '未知错误')
      setTasks([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Day 按钮 */}
      <div className="flex flex-wrap gap-2">
        {Array.from({ length: durationDays }).map((_, i) => {
          const day = i + 1
          return (
            <button
  key={day}
  onClick={() => fetchTasks(day)}
  className={`px-3 py-1 rounded border font-medium text-sm transition ${
    selectedDay === day
      ? 'bg-blue-600 text-white border-blue-600'
      : 'bg-white text-gray-800 border-gray-300 hover:border-blue-500'
  }`}
>
  Day {day}
</button>

          )
        })}
      </div>

      {/* 加载状态 */}
      {loading && <p className="text-gray-400">加载中...</p>}

      {/* 错误提示 */}
      {error && <p className="text-red-500">❌ {error}</p>}

      {/* 任务列表 */}
      {!loading && selectedDay && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Day {selectedDay} 的任务列表：</h3>
          {tasks.length === 0 ? (
            <p className="text-gray-500">暂无任务</p>
          ) : (
          <ul className="list-disc list-inside space-y-2">
  {tasks.map((task) => (
    <li key={task.id}>
      <div className="text-sm font-mono">
        [{task.type}] 顺序：{task.order}，权重：{task.appearanceWeight}
      </div>
      <div className="ml-4 text-sm text-gray-400">
        题干：{task.content || '（无内容）'}
      </div>
      <div className="ml-4 text-sm text-green-500">
        答案：{task.correctAnswer || '（无答案）'}
      </div>
    </li>
  ))}
</ul>

          )}
        </div>
      )}
    </div>
  )
}
