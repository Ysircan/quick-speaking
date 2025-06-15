"use client"

import { useState } from "react"
import { TaskItem } from "@/types/task"

interface Props {
  tasks: TaskItem[]
  trackId: string
  dayIndex: number
  onUpdate: (tasks: TaskItem[]) => void
}

export default function TaskPreviewPanel({
  tasks,
  trackId,
  dayIndex,
  onUpdate,
}: Props) {
  const [selectedTasks, setSelectedTasks] = useState<TaskItem[]>([])
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const toggleSelect = (task: TaskItem) => {
    setSelectedTasks((prev) =>
      prev.some((t) => t.id === task.id)
        ? prev.filter((t) => t.id !== task.id)
        : [...prev, task]
    )
  }

  const handleDelete = (index: number) => {
    const updated = tasks.filter((_, i) => i !== index)
    const deleted = tasks[index]
    onUpdate(updated)
    setSelectedTasks((prev) => prev.filter((t) => t.id !== deleted.id))
  }

  const handleSave = async () => {
    if (selectedTasks.length === 0) {
      setMessage("⚠️ 请至少挑选一道题")
      return
    }

    setSaving(true)
    setMessage("")

    const payload = selectedTasks.map((task, i) => ({
      trackId,
      dayIndex,
      order: i + 1,
      type: task.type,
      content: task.content,
      mediaUrl: null,
      optionsJson: task.optionsJson ?? [],
      correctAnswer: task.correctAnswer ?? "",
      explanation: task.explanation ?? null,
      tags: task.tags ?? [],
      difficulty: task.difficulty ?? "MEDIUM",
      isAIgenerated: true,
      appearanceWeight: 100,
    }))

    console.log("🧪 准备保存任务：", payload)

    try {
      const res = await fetch("/api/create/task/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackId, dayIndex, tasks: payload }),
      })

      const data = await res.json()
      if (data.success) {
        setMessage("✅ 任务保存成功")
      } else {
        setMessage("❌ 保存失败：" + data.error)
      }
    } catch (err) {
      console.error("❌ 网络错误", err)
      setMessage("❌ 网络错误，请稍后重试")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-sm text-gray-400">暂无任务，请先生成题目。</p>
      ) : (
        tasks.map((task, i) => (
          <div
            key={task.id || i}
            className={`p-4 border rounded bg-neutral-900 ${
              selectedTasks.some((t) => t.id === task.id)
                ? "border-green-500"
                : "border-neutral-700"
            }`}
          >
            <div className="font-semibold text-purple-300">
              第 {i + 1} 题 · {task.type}
            </div>
            <div className="text-white mt-1">{task.content}</div>

            {/* 选项 */}
            {Array.isArray(task.optionsJson) && task.optionsJson.length > 0 && (
              <ul className="mt-2 list-disc pl-5 text-sm text-gray-400">
                {task.optionsJson.map((opt, j) => (
                  <li key={j}>{opt}</li>
                ))}
              </ul>
            )}

            {/* 答案 */}
            {task.correctAnswer && (
              <p className="mt-2 text-green-400 text-xs">
                答案：{task.correctAnswer}
              </p>
            )}

            {/* 操作按钮 */}
            <div className="mt-3 flex gap-4">
              <button
                onClick={() => toggleSelect(task)}
                className="text-xs text-yellow-300 hover:underline"
              >
                {selectedTasks.some((t) => t.id === task.id)
                  ? "🗑 取消挑选"
                  : "✔ 添加到任务"}
              </button>
              <button
                onClick={() => handleDelete(i)}
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
          当前已挑选{" "}
          <span className="text-green-400">{selectedTasks.length}</span> /{" "}
          {tasks.length} 题
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded text-sm"
        >
          {saving ? "保存中..." : "💾 保存任务"}
        </button>
        {message && <p className="text-xs text-gray-400">{message}</p>}
      </div>
    </div>
  )
}  