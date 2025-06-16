'use client'

import { useState } from 'react'

interface Task {
  id: string
  content: string
}

interface Card {
  id: string
  title: string
}

export default function TaskDropConfigurator({
  task,
  availableCards,
}: {
  task: Task
  availableCards: Card[]
}) {
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
  const [probability, setProbability] = useState(1)
  const [requireCorrect, setRequireCorrect] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!selectedCardId) {
      alert('❗请选择卡牌')
      return
    }

    if (isNaN(probability) || probability < 0 || probability > 1) {
      alert('❗请填写 0~1 之间的掉落概率')
      return
    }

    setSaving(true)
    try {
      const res = await fetch(`/api/create/task/${task.id}/drop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: selectedCardId,
          probability,
          requireCorrectAnswer: requireCorrect,
        }),
      })

      const data = await res.json()
      if (data.success) {
        alert('✅ 掉落配置已保存！')
      } else {
        alert('保存失败：' + data.error)
      }
    } catch (err) {
      console.error('配置失败', err)
      alert('发生错误，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 text-white space-y-4">
      <h2 className="text-lg font-bold mb-2">🎯 配置掉落</h2>

      {availableCards.length === 0 ? (
        <div className="bg-gray-800 border border-gray-600 p-4 rounded text-center">
          <p className="text-sm text-gray-300 mb-2">你还没有创建任何卡片。</p>
          <a
            href="/creator/dashboard/card/new
"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
          >
            ➕ 去制作卡片
          </a>
        </div>
      ) : (
        <>
          <div>
            <label className="block mb-1 text-sm">🎴 选择掉落卡片</label>
            <select
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
              value={selectedCardId ?? ''}
              onChange={(e) => setSelectedCardId(e.target.value)}
            >
              <option value="">-- 请选择卡片 --</option>
              {availableCards.map((card) => (
                <option key={card.id} value={card.id}>
                  {card.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">🎲 掉落概率（0~1）</label>
            <input
              type="number"
              step="0.01"
              max="1"
              min="0"
              value={probability}
              onChange={(e) => setProbability(parseFloat(e.target.value))}
              className="w-full p-2 bg-gray-800 border border-gray-600 rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={requireCorrect}
              onChange={(e) => setRequireCorrect(e.target.checked)}
            />
            <label className="text-sm"> 答对题目才掉落</label>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2 bg-green-600 hover:bg-green-500 rounded text-white font-semibold disabled:opacity-50"
          >
            {saving ? '保存中...' : '💾 保存掉落设置'}
          </button>
        </>
      )}
    </div>
  )
}
