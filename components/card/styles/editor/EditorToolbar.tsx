'use client'

import { useRef } from 'react'

interface EditorToolbarProps {
  onAddText: () => void
  onAddImage: (url: string) => void
  onAddAudio: (url: string) => void
  onAddGif: (url: string) => void
}

export default function EditorToolbar({
  onAddText,
  onAddImage,
  onAddAudio,
  onAddGif,
}: EditorToolbarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'audio' | 'gif') => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      if (type === 'image') onAddImage(result)
      else if (type === 'audio') onAddAudio(result)
      else if (type === 'gif') onAddGif(result)
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className="flex gap-4">
      <button onClick={onAddText} className="btn btn-sm btn-primary">+ 文本</button>

      <label className="btn btn-sm btn-secondary cursor-pointer">
        + 图片
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'image')}
        />
      </label>

      <label className="btn btn-sm btn-secondary cursor-pointer">
        + 音频
        <input
          type="file"
          accept="audio/*"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'audio')}
        />
      </label>

      <label className="btn btn-sm btn-secondary cursor-pointer">
        + 动图
        <input
          type="file"
          accept="image/gif"
          className="hidden"
          onChange={(e) => handleFileChange(e, 'gif')}
        />
      </label>
    </div>
  )
}
