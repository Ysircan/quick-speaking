'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'

interface TaskDayMetaPanelProps {
  dayIndex: number
  onMetaSaved: (dayIndex: number, goalType: string) => void
}

const goalTypeOptions = [
  { value: 'STUDY', label: '学习任务' },
  { value: 'EXERCISE', label: '练习任务' },
  { value: 'READING', label: '阅读任务' },
  { value: 'CHECKIN', label: '打卡任务' },
  { value: 'TEST', label: '测试任务' },
  { value: 'CUSTOM', label: '自定义' },
]

const unlockModeOptions = [
  { value: 'DAILY', label: '每日解锁' },
  { value: 'LINEAR', label: '完成前一题后解锁' },
  { value: 'MANUAL', label: '手动解锁' },
  { value: 'AFTER_X_DAYS', label: 'X天后解锁' },
  { value: 'MILESTONE', label: '达成条件后解锁' },
]

export default function TaskDayMetaPanel({ dayIndex, onMetaSaved }: TaskDayMetaPanelProps) {
  const { id: trackId } = useParams()
  const [goalType, setGoalType] = useState('STUDY')
  const [unlockMode, setUnlockMode] = useState('DAILY')
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSave = async () => {
    if (!trackId) return
    setLoading(true)

    try {
      const res = await fetch('/api/create/track/daymeta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trackId,
          dayIndex,
          goalType,
          unlockMode,
          note,
        }),
      })

      const data = await res.json()
      if (data.success) {
        onMetaSaved(dayIndex, goalType) // ✅ 通知父组件刷新
      }
    } catch (err) {
      console.error('保存失败', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-gray-900 text-white p-4 rounded-xl space-y-4 border border-gray-700">
      <h2 className="text-xl font-semibold">📌 第 {dayIndex} 天任务配置</h2>

      {/* 任务类型 */}
      <div>
        <label className="block mb-1 text-sm text-gray-400">任务类型</label>
        <div className="flex flex-wrap gap-2">
          {goalTypeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`px-3 py-1 rounded-full text-sm border ${
                goalType === opt.value
                  ? 'bg-purple-600 text-white border-purple-400'
                  : 'bg-gray-800 text-gray-300 border-gray-600'
              }`}
              onClick={() => setGoalType(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 解锁模式 */}
      <div>
        <label className="block mb-1 text-sm text-gray-400">解锁模式</label>
        <div className="flex flex-wrap gap-2">
          {unlockModeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              className={`px-3 py-1 rounded-full text-sm border ${
                unlockMode === opt.value
                  ? 'bg-green-600 text-white border-green-400'
                  : 'bg-gray-800 text-gray-300 border-gray-600'
              }`}
              onClick={() => setUnlockMode(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* 备注 */}
      <div>
        <label className="block mb-1 text-sm text-gray-400">备注</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full px-3 py-2 rounded bg-gray-800 border border-gray-600 text-white"
          placeholder="选填，对本日任务的补充说明"
        />
      </div>

      {/* 保存按钮 */}
      <button
        type="button"
        onClick={handleSave}
        disabled={loading}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white"
      >
        {loading ? '保存中...' : '💾 保存任务配置'}
      </button>
    </div>
  )
}
