'use client'

import { ChangeEvent } from 'react'
import type { ElementItem } from './CardContentLayer'

interface Props {
  onAdd: (el: ElementItem) => void
}

export default function AddImageButton({ onAdd }: Props) {
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 临时用本地 URL，可改成上传到 OSS 后再使用返回链接
    const imageUrl = URL.createObjectURL(file)

    onAdd({
      id: `${Date.now()}`,
      type: 'image',
      content: imageUrl,
      x: 50,
      y: 50,
      width: 120,
      height: 120,
    })
  }

  return (
    <div>
      <label className="cursor-pointer px-4 py-2 bg-blue-600 rounded text-white inline-block">
        ➕ 上传图片
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
    </div>
  )
}
