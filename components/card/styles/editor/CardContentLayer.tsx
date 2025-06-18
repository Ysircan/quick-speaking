'use client'

import { Block } from './useCardBlocks'
import EditableBlock from './EditableBlock'

interface CardContentLayerProps {
  blocks: Block[]
  onStartDrag: (e: React.MouseEvent, id: string) => void
  onUpdate: (id: string, content: string) => void
  onDelete: (id: string) => void
}

export default function CardContentLayer({
  blocks,
  onStartDrag,
  onUpdate,
  onDelete,
}: CardContentLayerProps) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {blocks.map((block) => (
        <EditableBlock
          key={block.id}
          block={block}
          onStartDrag={onStartDrag}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}
