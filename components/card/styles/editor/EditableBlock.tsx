'use client'

import { useState } from 'react'
import { Block } from './useCardBlocks'

interface EditableBlockProps {
  block: Block
  onStartDrag: (e: React.MouseEvent, id: string) => void
  onUpdate: (id: string, content: string) => void
  onDelete: (id: string) => void
}

export default function EditableBlock({
  block,
  onStartDrag,
  onUpdate,
  onDelete,
}: EditableBlockProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="absolute pointer-events-auto group"
      style={{
        left: block.x,
        top: block.y,
        width: block.width ?? 140,
        height: block.height ?? 'auto',
        zIndex: 10,
      }}
      onMouseDown={(e) => onStartDrag(e, block.id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="relative bg-transparent resize rounded-lg overflow-hidden"
        style={{
          width: '100%',
          height: '100%',
          minWidth: 80,
          minHeight: 40,
        }}
      >
        {/* 删除按钮，仅在 hover 显示 */}
        {isHovered && (
          <button
            onClick={() => onDelete(block.id)}
            className="absolute -top-2 -right-2 z-20 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center hover:bg-red-600"
          >
            ×
          </button>
        )}

        {/* 内容区域 */}
        <div className="w-full h-full p-2 bg-white/90 rounded shadow-md">
          {/* 文本块 */}
          {block.type === 'text' && (
            isEditing ? (
              <input
                autoFocus
                value={block.content}
                onChange={(e) => onUpdate(block.id, e.target.value)}
                onBlur={() => setIsEditing(false)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setIsEditing(false)
                }}
                className="text-black bg-transparent w-full text-sm focus:outline-none"
              />
            ) : (
              <div
                className="text-sm text-black cursor-text"
                onClick={() => setIsEditing(true)}
              >
                {block.content || '点击输入文字'}
              </div>
            )
          )}

          {/* 图片块 */}
          {block.type === 'image' && (
            <img
              src={block.content}
              alt="图片"
              className="w-full h-auto object-contain rounded"
            />
          )}

          {/* 音频块 */}
          {block.type === 'audio' && (
            <audio controls src={block.content} className="w-full" />
          )}

          {/* 动图块 */}
          {block.type === 'gif' && (
            <img
              src={block.content}
              alt="动图"
              className="w-full h-auto object-contain rounded"
            />
          )}
        </div>
      </div>
    </div>
  )
}
