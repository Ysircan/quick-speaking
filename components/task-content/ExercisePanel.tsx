'use client'

import { useEffect, useState } from 'react'
import TaskDropConfigurator from '@/components/track/TaskDropConfigurator'

interface Question {
  id: string
  type: string
  content: string
  answer: string
  explanation: string
  selected?: boolean
  saved?: boolean
}

export default function ExercisePanel({
  trackId,
  dayIndex,
}: {
  trackId: string
  dayIndex: number
}) {
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [saving, setSaving] = useState(false)
  const [savedTasks, setSavedTasks] = useState<Question[]>([])
  const [configuringTaskId, setConfiguringTaskId] = useState<string | null>(null)

  // 生成题目
  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'EXERCISE', topic: 'Simple Arithmetic', count: 10 }),
      })
      const data = await res.json()
      if (data.questions) {
        const newQs = data.questions.map((q: any, i: number) => ({
          ...q,
          id: `${Date.now()}-${i}`,
          selected: false,
          saved: false,
        }))
        setQuestions((prev) => [...prev, ...newQs])
      }
    } catch (err) {
      console.error('生成失败', err)
    } finally {
      setLoading(false)
    }
  }

  // 切换选中题目
  const toggleSelection = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, selected: !q.selected } : q))
    )
  }

  // 批量保存
  const handleSave = async () => {
    const selected = questions.filter((q) => q.selected && !q.saved)
    if (selected.length === 0) return alert('请先选择题目')
    setSaving(true)
    try {
      const tasks = selected.map((q, i) => ({
        type: '填空题',
        content: q.content,
        correctAnswer: q.answer,
        explanation: q.explanation,
        dayIndex,
        isAIgenerated: true,
        order: i + 1,
      }))

      const res = await fetch('/api/create/task/batch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trackId, tasks }),
      })

      const data = await res.json()
      if (data.success) {
        const updated = questions.map((q) =>
          q.selected && !q.saved ? { ...q, saved: true, selected: false } : q
        )
        setQuestions(updated)
        loadSavedTasks() // 更新右侧
        alert('保存成功')
      } else {
        alert('保存失败：' + data.error)
      }
    } catch (err) {
      console.error('保存失败', err)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  // 加载已保存任务
  const loadSavedTasks = async () => {
    try {
      const res = await fetch(`/api/create/task?trackId=${trackId}&dayIndex=${dayIndex}`)
      const data = await res.json()
      setSavedTasks(data || [])
    } catch (err) {
      console.error('加载题目失败', err)
    }
  }

  const handleDelete = async (taskId: string) => {
    if (!confirm('确定删除？')) return
    try {
      const res = await fetch(`/api/create/task/${taskId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        setSavedTasks((prev) => prev.filter((t) => t.id !== taskId))
      } else {
        alert('删除失败：' + data.error)
      }
    } catch (err) {
      console.error('删除失败', err)
    }
  }

  useEffect(() => {
    loadSavedTasks()
  }, [trackId, dayIndex])

  return (
    <div className="flex w-full gap-4 mt-6 text-white">
      {/* 左侧生成区 */}
      <div className="w-1/3 bg-gray-800 p-4 rounded-xl border border-gray-700 space-y-4">
        <h2 className="text-lg font-semibold">📘 生成题目</h2>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500"
        >
          {loading ? '生成中...' : '🎲 生成 10 道题'}
        </button>
      </div>

      {/* 中间预览区 */}
      <div className="w-1/3 bg-gray-800 p-4 rounded-xl border border-gray-700 flex flex-col justify-between">
        <div>
          <h2 className="text-lg font-semibold mb-2">📋 题目预览</h2>
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {questions.map((q, idx) => (
              <div key={q.id} className="p-3 rounded border bg-gray-900">
                <div className="flex justify-between text-sm text-purple-400">
                  <span>题目 {idx + 1}</span>
                  {!q.saved ? (
                    <button
                      onClick={() => toggleSelection(q.id)}
                      className="text-xs text-yellow-300"
                    >
                      {q.selected ? '取消预选' : '预选'}
                    </button>
                  ) : (
                    <span className="text-green-400">✅ 已保存</span>
                  )}
                </div>
                <div className="text-sm text-white mt-1">
                  <strong>题干：</strong> {q.content}
                </div>
                <div className="text-sm text-green-400">
                  <strong>答案：</strong> {q.answer}
                </div>
                <div className="text-sm text-gray-400">
                  <strong>解析：</strong> {q.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="text-right mt-4">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-green-600 hover:bg-green-500"
          >
            {saving ? '保存中...' : '💾 保存题目'}
          </button>
        </div>
      </div>

      {/* 右侧配置区 */}
      <div className="w-1/3 bg-gray-800 p-4 rounded-xl border border-gray-700 relative">
        <h2 className="text-lg font-semibold mb-2">⚙️ 配置已保存题目</h2>
        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
          {savedTasks.map((task, idx) => (
            <div key={task.id} className="p-3 rounded border border-gray-600 bg-gray-900">
              <div className="flex justify-between text-sm text-purple-400">
                <span>题目 {idx + 1}</span>
                <div className="flex gap-2">
                  <button
                    className="text-xs text-blue-400 hover:underline"
                    onClick={() => setConfiguringTaskId(task.id)}
                  >
                    配置
                  </button>
                  <button
                    className="text-xs text-red-400 hover:underline"
                    onClick={() => handleDelete(task.id)}
                  >
                    删除
                  </button>
                </div>
              </div>
              <div className="text-sm mt-1 text-white">
                <strong>题干：</strong> {task.content}
              </div>
            </div>
          ))}
        </div>

        {/* 配置浮窗 */}
        {configuringTaskId && (
          <div className="absolute bottom-2 left-2 right-2 bg-gray-900 border border-gray-600 p-3 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-2">
             
              <button
                onClick={() => setConfiguringTaskId(null)}
                className="text-xs text-red-400 hover:underline"
              >
                关闭
              </button>
            </div>
            {configuringTaskId && (
  <div className="absolute bottom-2 left-2 right-2 bg-gray-900 border border-gray-600 p-3 rounded-lg shadow-lg">
    <div className="flex justify-between items-center mb-2">
      
      <button
        onClick={() => setConfiguringTaskId(null)}
        className="text-xs text-red-400 hover:underline"
      >
        关闭
      </button>
    </div>

    {savedTasks.find((t) => t.id === configuringTaskId) && (
      <TaskDropConfigurator
        task={savedTasks.find((t) => t.id === configuringTaskId)!}
        availableCards={[]} // 你后面可以改成 cards（创作者卡片列表）
      />
    )}
  </div>
)}

          </div>
        )}
      </div>
    </div>
  )
}
