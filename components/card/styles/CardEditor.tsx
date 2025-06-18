'use client'

import { useState } from 'react'
import BaseCard from '@/components/card/styles/BaseCard'
import CardEditorCanvas, { ElementItem } from '@/components/card/styles/editor/CardContentLayer'
import AddImageButton from '@/components/card/styles/editor/AddImageButton'

interface CardEditorProps {
  templateId: string
  creatorId: string
  onSuccess?: () => void
}

export default function CardEditor({ templateId, creatorId, onSuccess }: CardEditorProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [elements, setElements] = useState<ElementItem[]>([])

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/card/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          templateId,
          creatorId,
          title,
          description,
          imageUrl,
          elements, // ⬅️ 关键：把拖动内容也存下来
        }),
      })
      const data = await res.json()
      if (data.success) {
        setMessage('✅ 卡片已成功创建！')
        if (onSuccess) onSuccess()
      } else {
        setMessage('❗保存失败：' + data.error)
      }
    } catch (err) {
      setMessage('❗系统错误，请稍后重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 左侧：填写内容 */}
      <div className="space-y-4">
        <h3 className="text-white text-lg font-bold">📝 编辑卡片内容</h3>

        <input
          type="text"
          placeholder="卡片标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />

        <textarea
          placeholder="卡片描述（可选）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 h-24 rounded bg-gray-800 text-white border border-gray-600"
        />

        <input
          type="text"
          placeholder="图片 URL（可选）"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600"
        />

        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-white font-semibold"
        >
          {saving ? '保存中...' : '💾 保存卡片'}
        </button>

        {message && <div className="text-sm text-yellow-400">{message}</div>}
      </div>

      {/* 右侧：上传图片 + 拖动编辑 */}
      <div className="flex flex-col items-center">
        <AddImageButton onAdd={(el) => setElements((prev) => [...prev, el])} />
        <CardEditorCanvas elements={elements} onChange={setElements} />
      </div>
    </div>
  )
}
