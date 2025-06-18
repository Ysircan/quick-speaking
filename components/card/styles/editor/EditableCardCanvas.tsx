'use client'

import { useRef, useState } from 'react'
import BaseCard from '@/components/card/styles/BaseCard'
import EditorToolbar from '@/components/card/styles/editor/EditorToolbar'
import CardContentLayer from '@/components/card/styles/editor/CardContentLayer'
import SaveCardButton from '@/components/card/styles/editor/SaveCardButton'
import useCardBlocks from '@/components/card/styles/editor/useCardBlocks'

interface EditableCardCanvasProps {
  templateId: string
  mediaUrl?: string
  variant?: 'default' | 'gold' | 'silver'
  creatorId: string
}

export default function EditableCardCanvas({
  templateId,
  mediaUrl,
  variant = 'default',
  creatorId,
}: EditableCardCanvasProps) {
  const cardRef = useRef<HTMLDivElement | null>(null)

  const {
    blocks,
    addTextBlock,
    addImageBlock,
    addAudioBlock,
    addGifBlock,
    updateBlockContent,
    resizeBlock,
    deleteBlock,
    startDrag,
  } = useCardBlocks(cardRef)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async () => {
    if (!title.trim()) return setMessage('请输入卡牌标题')
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
          creatorId,
          blocks,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setMessage('✅ 卡牌已成功保存！')
      } else {
        setMessage('❌ 保存失败，请检查字段')
      }
    } catch (err) {
      console.error(err)
      setMessage('❌ 保存出错，请重试')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="p-6 flex flex-col items-center gap-4 w-full max-w-md mx-auto">
      {/* 工具栏 */}
      <EditorToolbar
        onAddText={addTextBlock}
        onAddImage={addImageBlock}
        onAddAudio={addAudioBlock}
        onAddGif={addGifBlock}
      />

      {/* 卡牌画布区域 */}
      <div ref={cardRef} className="relative w-[208px] h-[288px]">
        <BaseCard mediaUrl={mediaUrl} variant={variant} />
        <CardContentLayer
          blocks={blocks}
          onStartDrag={startDrag}
          onUpdate={updateBlockContent}
          onResize={resizeBlock}
          onDelete={deleteBlock}
        />
      </div>

      {/* 标题与描述输入 */}
      <input
        type="text"
        className="mt-4 w-full p-2 rounded border text-sm"
        placeholder="请输入卡牌标题"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        className="w-full p-2 rounded border text-sm"
        placeholder="请输入卡牌描述（可选）"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      {/* 保存按钮 */}
      <SaveCardButton
        templateId={templateId}
        title={title}
        description={description}
        mediaUrl={mediaUrl}
        blocks={blocks}
        creatorId={creatorId}
      />

      {/* 保存反馈 */}
      {message && (
        <p className="text-sm text-gray-500 mt-2">{message}</p>
      )}
    </div>
  )
}
