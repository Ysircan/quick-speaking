'use client'

import { useState } from 'react'
import { Block } from './useCardBlocks'

interface SaveCardButtonProps {
  templateId: string
  title: string
  description?: string
  mediaUrl?: string
  blocks: Block[]
  creatorId: string
}

export default function SaveCardButton({
  templateId,
  title,
  description,
  mediaUrl,
  blocks,
  creatorId,
}: SaveCardButtonProps) {
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    if (!templateId || !title || !creatorId) {
      setMessage('请填写完整信息后再保存')
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/card/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          title,
          description,
          mediaUrl,
          blocks, // 重点：所有自定义内容（文字、图像、音频等）
          creatorId,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setMessage('✅ 保存成功！卡牌 ID：' + data.cardId)
      } else {
        setMessage('❌ 保存失败：' + data.error)
      }
    } catch (error) {
      setMessage('🚫 网络错误，保存失败')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-4 text-center">
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        {saving ? '保存中...' : '保存卡牌'}
      </button>
      {message && <p className="mt-2 text-sm text-gray-600">{message}</p>}
    </div>
  )
}
