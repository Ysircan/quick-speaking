'use client'

import BaseCard from '@/components/card/styles/BaseCard'
import { useState } from 'react'

const presets = [
  {
    name: '基础款 · 蓝边',
    label: '蓝色边框',
    icon: '📘',
    mediaUrl: 'https://cdn.example.com/cards/blue.png',
    rarity: 'COMMON',
    category: '基础样式',
  },
  {
    name: '荣耀款 · 金边',
    label: '金色边框',
    icon: '👑',
    mediaUrl: 'https://cdn.example.com/cards/gold.png',
    rarity: 'RARE',
    category: '荣誉奖励',
  },
  {
    name: '纪念款 · 红色',
    label: '黑银边框',
    icon: '🖤',
    mediaUrl: 'https://cdn.example.com/cards/silver.png',
    rarity: 'EPIC',
    category: '纪念系列',
  },
]

export default function NewCardTemplatePage() {
  const [message, setMessage] = useState('')
  const [loadingId, setLoadingId] = useState<string | null>(null)

  const handleClick = async (preset: any) => {
    setLoadingId(preset.name)
    setMessage(`正在保存 ${preset.name}...`)

    const res = await fetch('/api/admin/card/template/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: preset.name,
        mediaUrl: preset.mediaUrl,
        mediaType: 'image',
        rarity: preset.rarity,
        isAutoDropAllowed: true,
        isHidden: false,
        weight: 100,
        category: preset.category,
      }),
    })

    const data = await res.json()
    if (data.success) {
      setMessage(`✅ 成功保存：${preset.name}`)
    } else {
      setMessage(`❌ 保存失败：${data.error || '未知错误'}`)
    }

    setLoadingId(null)
  }

  const mapRarityToVariant = (rarity: string): 'default' | 'gold' | 'silver' => {
    if (rarity === 'RARE') return 'gold'
    if (rarity === 'EPIC') return 'silver'
    return 'default'
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 space-y-6">
      <h1 className="text-2xl font-bold">🎴 点击卡牌样式，将其保存到模板库</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {presets.map((preset, index) => (
          <div key={index} onClick={() => handleClick(preset)} className="cursor-pointer">
            <BaseCard
              icon={preset.icon}
              label={preset.label}
              variant={mapRarityToVariant(preset.rarity)}
            />
            {loadingId === preset.name && (
              <p className="text-sm text-gray-400 mt-2">上传中...</p>
            )}
          </div>
        ))}
      </div>

      {message && <p className="text-green-400 text-sm mt-4">{message}</p>}
    </div>
  )
}
