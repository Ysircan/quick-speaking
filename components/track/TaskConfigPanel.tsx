'use client'

import { useEffect, useState } from 'react'
import type { TaskItem } from '@/types/task'

interface TaskConfigPanelProps {
  tasks: TaskItem[]
  creatorId: string
  trackId: string
  dayIndex: number
}

export default function TaskConfigPanel({ tasks, creatorId, trackId, dayIndex }: TaskConfigPanelProps) {
  const [cards, setCards] = useState<any[]>([])
  const [selectedCardIds, setSelectedCardIds] = useState<string[]>([])
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch(`/api/card/list?creatorId=${creatorId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setCards(data.cards)
      })
  }, [creatorId])

  const toggleCard = (cardId: string) => {
    setSelectedCardIds((prev) =>
      prev.includes(cardId) ? prev.filter((id) => id !== cardId) : [...prev, cardId]
    )
  }

  const handleBind = async () => {
    const taskIds = tasks.map(task => task.id).filter(Boolean)

    if (taskIds.length === 0 || selectedCardIds.length === 0) {
      setMessage('请先出题并选择至少一张卡牌')
      return
    }

    const drops = selectedCardIds.map((cardId) => ({
      cardId,
      probability: 1.0,
      requireCorrectAnswer: false,
    }))

    const promises = taskIds.map(taskId =>
      fetch(`/api/create/task/${taskId}/drop`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(drops),
      })
    )

    const results = await Promise.all(promises.map(p => p.then(res => res.json())))
    const allSuccess = results.every(r => r.success)

    setMessage(allSuccess ? '✅ 所有题目已成功绑定卡牌掉落' : '❌ 部分题目绑定失败')
  }

  return (
    <div className="p-4 bg-zinc-900 rounded-lg space-y-4 h-full">
      <h2 className="text-xl font-bold text-white">🎁 绑定卡牌掉落</h2>

      <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => toggleCard(card.id)}
            className={`p-3 rounded border cursor-pointer ${
              selectedCardIds.includes(card.id)
                ? 'border-purple-400 bg-purple-800'
                : 'border-gray-600'
            }`}
          >
            <p className="text-sm text-white font-semibold">{card.content.title}</p>
            <p className="text-xs text-gray-400">{card.template?.rarity}</p>
          </div>
        ))}
      </div>

      <button
        onClick={handleBind}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded text-white"
      >
        保存绑定
      </button>

      {message && <p className="text-green-400 text-sm mt-2">{message}</p>}
    </div>
  )
}
