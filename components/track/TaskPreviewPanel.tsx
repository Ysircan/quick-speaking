"use client"

import { useState } from "react"
import { TaskItem } from "@/types/task"

interface Props {
  tasks: TaskItem[]
  dayIndex: number
  trackId: string
  onUpdate: (tasks: TaskItem[]) => void
}

export default function TaskPreviewPanel({
  tasks,
  dayIndex,
  trackId,
  onUpdate,
}: Props) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [selectedTasks, setSelectedTasks] = useState<TaskItem[]>([])

  const isSelected = (task: TaskItem) => {
    return selectedTasks.some((t) => t.id === task.id)
  }

  const handleToggleSelect = (task: TaskItem) => {
    if (isSelected(task)) {
      setSelectedTasks((prev) => prev.filter((t) => t.id !== task.id))
    } else {
      setSelectedTasks((prev) => [...prev, task])
    }
  }

  const handleDelete = (indexToDelete: number) => {
    const newTasks = tasks.filter((_, i) => i !== indexToDelete)
    const taskToDelete = tasks[indexToDelete]
    onUpdate(newTasks)
    setSelectedTasks((prev) => prev.filter((t) => t.id !== taskToDelete.id))
  }

  const handleSave = async () => {
    if (selectedTasks.length === 0) {
      setMessage("⚠️ 请先挑选至少一道题目")
      return
    }

    setSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/create/task/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trackId,
          dayIndex,
          tasks: selectedTasks,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setMessage("✅ 保存成功！")
      } else {
        setMessage("❌ 保存失败：" + data.error)
      }
    } catch (err) {
      setMessage("❌ 网络错误，请稍后再试")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-500">暂无任务内容。</p>
      ) : (
        tasks.map((task, index) => (
          <div
            key={task.id || index}
            className={`p-3 border rounded-md text-sm bg-neutral-900 ${
              isSelected(task)
                ? "border-green-500"
                : "border-neutral-700"
            }`}
          >
            <div className="font-semibold text-purple-300">
              第 {index + 1} 题 · {task.type}
            </div>

            {/* 题干 */}
            <div className="text-white whitespace-pre-line mt-1">{task.content}</div>

            {/* 选项 */}
            {Array.isArray(task.options) && task.options.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-gray-400 text-sm">
                {task.options.map((opt, i) => (
                  <li key={i}>{opt}</li>
                ))}
              </ul>
            )}

            {/* 答案 */}
            {task.answer && (
              <p className="mt-2 text-green-400 text-xs">答案：{task.answer}</p>
            )}

            {/* 按钮 */}
            <div className="mt-3 flex gap-3">
              <button
                onClick={() => handleToggleSelect(task)}
                className={`text-xs ${
                  isSelected(task)
                    ? "text-yellow-400"
                    : "text-green-400"
                } hover:underline`}
              >
                {isSelected(task) ? "🗑 取消挑选" : "✔ 添加到任务"}
              </button>

              <button
                onClick={() => handleDelete(index)}
                className="text-xs text-red-400 hover:underline"
              >
                删除
              </button>
            </div>
          </div>
        ))
      )}

      <div className="pt-4 space-y-2">
        <p className="text-xs text-gray-400">
          当前已挑选 <span className="text-green-400">{selectedTasks.length}</span> / 共 {tasks.length} 题
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-sm"
        >
          {saving ? "保存中..." : "💾 保存本日任务"}
        </button>
        {message && <p className="text-xs text-gray-400">{message}</p>}
      </div>
    </div>
  )
}
