'use client'

import { useState } from 'react'
import CardTemplateSelector from '@/components/card/CardTemplateSelector'
import EditableCardCanvas from '@/components/card/styles/editor/EditableCardCanvas'

export default function CardEditorPage() {
  const [selected, setSelected] = useState<{
    id: string
    name: string
    mediaUrl: string
    variant: 'default' | 'gold' | 'silver'
  } | null>(null)

  return (
    <div className="min-h-screen bg-neutral-900 text-white px-8 py-6">
      {!selected ? (
        <>
          <h1 className="text-2xl font-bold mb-4">🎴 选择一个卡牌模板</h1>
          <CardTemplateSelector onSelect={(tpl) => setSelected({
            id: tpl.id,
            name: tpl.name,
            mediaUrl: tpl.mediaUrl,
            variant: tpl.rarity === 'RARE' ? 'gold' :
                     tpl.rarity === 'LEGENDARY' ? 'silver' : 'default',
          })} />
        </>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="text-sm text-gray-300">
            <p>已选择模板：<strong className="text-white">{selected.name}</strong></p>
            <p className="text-xs text-gray-500">模板 ID: {selected.id}</p>
          </div>

          <EditableCardCanvas
            mediaUrl={selected.mediaUrl}
            variant={selected.variant}
          />
        </div>
      )}
    </div>
  )
}
