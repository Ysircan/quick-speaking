'use client'

import { useState } from "react"

export interface DayMeta {
  id?: string
  dayIndex: number
  goalType: string
  unlockMode: string
  unlockParam?: any
  note?: string
}

interface Props {
  dayMeta: DayMeta
  onSave: (meta: DayMeta) => void
}

const GOAL_OPTIONS = [
  { value: "CHECKIN", label: "打卡", icon: "📍" },
  { value: "STUDY", label: "学习", icon: "📘" },
  { value: "EXERCISE", label: "练习", icon: "📝" },
  { value: "TEST", label: "测试", icon: "🧪" },
]

export default function DayMetaPanel({ dayMeta, onSave }: Props) {
  const [goalType, setGoalType] = useState(dayMeta.goalType || "CHECKIN")
  const [unlockMode, setUnlockMode] = useState(dayMeta.unlockMode || "DAILY")
  const [unlockParam, setUnlockParam] = useState(dayMeta.unlockParam || "")
  const [note, setNote] = useState(dayMeta.note || "")

  return (
    <div className="space-y-4 border rounded-xl p-4 bg-gray-800 text-white">
      <h2 className="text-lg font-bold">📅 第 {dayMeta.dayIndex} 天设置</h2>

      {/* 🎯 圆圈选择器 */}
      <div>
        <label className="block text-sm mb-2">🎯 任务类型</label>
        <div className="flex flex-wrap gap-2">
          {GOAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setGoalType(opt.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border 
                ${goalType === opt.value
                  ? "bg-purple-600 text-white border-purple-400"
                  : "bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600"
                }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 🔓 解锁方式 */}
      <div>
        <label className="block text-sm mb-1">🔓 解锁方式</label>
        <select
          className="w-full bg-gray-700 p-2 rounded"
          value={unlockMode}
          onChange={(e) => setUnlockMode(e.target.value)}
        >
          <option value="DAILY">每日自动解锁</option>
          <option value="LINEAR">完成前一日解锁</option>
          <option value="AFTER_X_DAYS">第X天后解锁</option>
          <option value="MANUAL">手动控制</option>
        </select>
      </div>

      {/* 解锁参数 */}
      {unlockMode === "AFTER_X_DAYS" && (
        <div>
          <label className="block text-sm mb-1">解锁天数参数</label>
          <input
            type="number"
            className="w-full bg-gray-700 p-2 rounded"
            value={unlockParam}
            onChange={(e) => setUnlockParam(Number(e.target.value))}
          />
        </div>
      )}

      {/* 备注 */}
      <div>
        <label className="block text-sm mb-1">📝 老师备注</label>
        <textarea
          className="w-full bg-gray-700 p-2 rounded"
          rows={3}
          placeholder="可选说明备注..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* 保存按钮 */}
      <button
        type="button"
        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded"
        onClick={() => {
          onSave({
            ...dayMeta,
            goalType,
            unlockMode,
            unlockParam,
            note,
          })
        }}
      >
        💾 保存任务配置
      </button>
    </div>
  )
}
