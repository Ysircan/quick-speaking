'use client'

import { useEffect, useState } from 'react'

interface Question {
  id: string
  type: string
  content: string
  answer: string
  explanation: string
  selected?: boolean     // ✅ 是否已被勾选用于保存
  saved?: boolean        // ✅ 是否已保存至数据库
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


  // ✅ 生成题目
  const handleGenerate = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'EXERCISE',
          topic: 'Simple Arithmetic',
          count: 10,
        }),
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

  // ✅ 切换题目的选中状态
  const toggleSelection = (id: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === id ? { ...q, selected: !q.selected } : q
      )
    )
  }

  // ✅ 保存选中题目至数据库
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
        dayIndex: dayIndex,
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
          q.selected && !q.saved
            ? { ...q, saved: true, selected: false }
            : q
        )
        setQuestions(updated)
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
  function SavedTasks({ trackId, dayIndex }: { trackId: string; dayIndex: number }) {
  const [tasks, setTasks] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/create/task?trackId=${trackId}&dayIndex=${dayIndex}`)
        const data = await res.json()
        setTasks(data || [])
      } catch (err) {
        console.error('加载题目失败', err)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [trackId, dayIndex])

  const handleDelete = async (taskId: string) => {
    if (!confirm('确定要删除这道题吗？')) return

    try {
      const res = await fetch(`/api/create/task/${taskId}`, {
        method: 'DELETE',
      })
      const data = await res.json()
      if (data.success) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId))
      } else {
        alert('删除失败：' + data.error)
      }
    } catch (err) {
      console.error('删除失败', err)
      alert('删除出错')
    }
  }

  if (loading) {
    return <p className="text-gray-400">加载中...</p>
  }

  if (tasks.length === 0) {
    return <p className="text-gray-400">暂无已保存题目</p>
  }

  return (
    <div className="space-y-4 max-h-[420px] overflow-y-auto pr-1">
      {tasks.map((task, idx) => (
        <div
          key={task.id}
          className="p-3 rounded border border-gray-600 bg-gray-900"
        >
          <div className="flex justify-between items-center">
            <span className="text-sm text-purple-400">题目 {idx + 1}</span>
            <div className="flex gap-2">
              <button
                className="text-xs text-blue-400 hover:underline"
                onClick={() => alert(`这里可以配置 taskId=${task.id}`)}
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
          <div className="text-sm text-white mt-1">
            <strong>题干：</strong> {task.content}
          </div>
          <div className="text-sm text-green-400">
            <strong>答案：</strong> {task.answer}
          </div>
          <div className="text-sm text-gray-400">
            <strong>解析：</strong> {task.explanation}
          </div>
        </div>
      ))}
    </div>
  )
}


  return (
    <div className="w-full flex flex-col gap-4 mt-6">
      {/* 三栏容器 */}
      <div className="w-full flex justify-between items-start gap-4 min-h-[300px]">
        {/* 左侧 */}
        <div className="w-1/3 bg-gray-800 p-4 rounded-xl border border-gray-700 text-white space-y-4">
          <h2 className="text-lg font-semibold">📘 生成练习任务</h2>
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 disabled:opacity-50"
          >
            {loading ? '生成中...' : '🎲 生成 10 道算数题'}
          </button>
        </div>

      {/* 中间栏：题目预览 */}
<div className="w-1/3 bg-gray-800 p-4 rounded-xl border border-gray-700 text-white flex flex-col justify-between">
  <div>
    <h2 className="text-lg font-semibold mb-2">📋 题目预览</h2>

    {questions.length === 0 ? (
      <p className="text-gray-400">暂无题目</p>
    ) : (
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={`p-3 rounded-lg border ${
              q.saved
                ? 'border-green-600 bg-gray-900'
                : 'border-gray-600 bg-gray-900'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-400">
                题目 {idx + 1}
              </span>
              {!q.saved && (
                <button
                  onClick={() => toggleSelection(q.id)}
                  className={`text-xs ${
                    q.selected
                      ? 'text-yellow-300'
                      : 'text-gray-400 hover:text-yellow-300'
                  }`}
                >
                  {q.selected ? '取消预选' : '预选'}
                </button>
              )}
              {q.saved && (
                <span className="text-xs text-green-400">✅ 已保存</span>
              )}
            </div>
            <div className="text-sm mt-1 text-white">
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
    )}
  </div>

  {/* ✅ 按钮始终靠下，属于中间卡片 */}
  <div className="text-right mt-4">
    <button
      onClick={handleSave}
      disabled={saving}
      className="px-4 py-2 rounded bg-green-600 hover:bg-green-500 text-white disabled:opacity-50"
    >
      {saving ? '保存中...' : '💾 保存选中题目'}
    </button>
  </div>
</div>


       {/* 右侧：配置已保存题目 */}
<div className="w-1/3 bg-gray-800 p-4 rounded-xl border border-gray-700 text-white">
  <h2 className="text-lg font-semibold mb-3">⚙️ 配置题目</h2>

  <SavedTasks trackId={trackId} dayIndex={dayIndex} />
</div>

      </div>
      
  
    </div>
  )
}
