'use client'

import { useState } from 'react'

interface Task {
  id: string
  appearanceWeight?: number
}

interface Card {
  id: string
  title: string
}

export default function TaskConfigPanel({
  task,
  availableCards,
}: {
  task: Task
  availableCards: Card[]
}) {
  const [weight, setWeight] = useState<number>(task.appearanceWeight ?? 100)
  const [selectedCardId, setSelectedCardId] = useState<string>('')
  const [probability, setProbability] = useState<number>(100)
  const [requireCorrect, setRequireCorrect] = useState(false)

  const [savingWeight, setSavingWeight] = useState(false)
  const [savingCardBinding, setSavingCardBinding] = useState(false)
  const [savingDrop, setSavingDrop] = useState(false)

  const handleSaveWeight = async () => {
    if (isNaN(weight) || !Number.isInteger(weight) || weight < 0 || weight > 100) {
      alert('❗请输入 0-100 之间的整数作为权重')
      return
    }
    setSavingWeight(true)
    try {
      const token = localStorage.getItem('token')
      await fetch(`/api/create/task/${task.id}/weight`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
        body: JSON.stringify({ appearanceWeight: weight }),
      })
      alert('✅ 出现概率已保存')
    } catch (err) {
      console.error('❌ 保存权重失败:', err)
      alert('❌ 保存失败，请稍后重试')
    } finally {
      setSavingWeight(false)
    }
  }

  const handleSaveCardBinding = async () => {
    if (!selectedCardId) return
    setSavingCardBinding(true)
    try {
      await fetch(`/api/create/task/${task.id}/drop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId: selectedCardId, probability: 100 }),
      })
      alert('✅ 卡牌已绑定')
    } catch (err) {
      console.error('❌ 卡牌绑定失败:', err)
      alert('❌ 绑定失败，请稍后重试')
    } finally {
      setSavingCardBinding(false)
    }
  }

  const handleSaveDropConfig = async () => {
    if (
      !selectedCardId ||
      isNaN(probability) ||
      !Number.isInteger(probability) ||
      probability < 0 ||
      probability > 100
    ) {
      alert('❗请输入 0-100 之间的整数作为掉落概率')
      return
    }

    setSavingDrop(true)
    try {
      await fetch(`/api/create/task/${task.id}/drop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: selectedCardId,
          probability,
          requireCorrectAnswer: requireCorrect,
        }),
      })
      alert('✅ 掉落配置已保存')
    } catch (err) {
      console.error('❌ 掉落配置失败:', err)
      alert('❌ 保存失败，请稍后重试')
    } finally {
      setSavingDrop(false)
    }
  }

  return (
    <div className="bg-gray-900 p-6 rounded-xl border border-gray-700 text-white space-y-6 w-full max-w-sm">
      <h2 className="text-xl font-bold mb-2">🎯 Task Configuration</h2>

      {/* 1. 出现概率 */}
      <div>
        <label className="block text-sm font-medium mb-1">📊 Appearance Weight (% 0 - 100)</label>
        <input
          type="number"
          step="1"
          min="0"
          max="100"
          value={isNaN(weight) ? '' : weight}
          onChange={(e) => {
            const val = parseInt(e.target.value)
            setWeight(isNaN(val) ? 0 : val)
          }}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
        />
        <button
          onClick={handleSaveWeight}
          disabled={savingWeight}
          className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {savingWeight ? 'Saving...' : '💾 Save Task Weight'}
        </button>
      </div>

      {/* 2. 卡牌绑定 */}
      <div>
        <label className="block text-sm font-medium mb-1">🎴 Select Card</label>
        <select
          value={selectedCardId}
          onChange={(e) => setSelectedCardId(e.target.value)}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
        >
          <option value="">-- No Card Selected --</option>
          {availableCards.map((card) => (
            <option key={card.id} value={card.id}>
              {card.title}
            </option>
          ))}
        </select>
        <button
          onClick={handleSaveCardBinding}
          disabled={!selectedCardId || savingCardBinding}
          className="mt-2 w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {savingCardBinding ? 'Saving...' : '💾 Bind Card'}
        </button>
      </div>

      {/* 3. 掉落概率 */}
      <div>
        <label className="block text-sm font-medium mb-1">🎲 Drop Probability (% 0 - 100)</label>
        <input
          type="number"
          step="1"
          min="0"
          max="100"
          value={isNaN(probability) ? '' : probability}
          onChange={(e) => {
            const val = parseInt(e.target.value)
            setProbability(isNaN(val) ? 0 : val)
          }}
          className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2"
        />
        <div className="flex items-center mt-2 gap-2">
          <input
            type="checkbox"
            checked={requireCorrect}
            onChange={(e) => setRequireCorrect(e.target.checked)}
          />
          <label className="text-sm">Only drop when answered correctly</label>
        </div>
        <button
          onClick={handleSaveDropConfig}
          disabled={!selectedCardId || savingDrop}
          className="mt-2 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded font-semibold disabled:opacity-50"
        >
          {savingDrop ? 'Saving...' : '💾 Save Drop Settings'}
        </button>
      </div>
    </div>
  )
}
