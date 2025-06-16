'use client'

import { useEffect, useState } from 'react'
import BaseCard from '@/components/card/styles/BaseCard'

interface CardTemplate {
  id: string
  name: string
  label: string
  icon: string
  mediaUrl: string
  rarity: 'COMMON' | 'RARE' | 'LEGENDARY'
  category: string
}

interface Props {
  onSelect?: (template: CardTemplate) => void
}

// rarity → variant 映射
const mapRarityToVariant = (rarity: string): 'default' | 'gold' | 'silver' => {
  switch (rarity) {
    case 'RARE':
      return 'gold'
    case 'LEGENDARY':
      return 'silver'
    default:
      return 'default'
  }
}

export default function CardTemplateSelector({ onSelect }: Props) {
  const [templates, setTemplates] = useState<CardTemplate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await fetch('/api/card/templates')
      const data = await res.json()
      if (data.success) {
        setTemplates(data.templates)
      }
      setLoading(false)
    }
    fetchTemplates()
  }, [])

  if (loading) return <p className="text-gray-400">加载中...</p>

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
      {templates.map((template) => (
        <div
          key={template.id}
          onClick={() => onSelect?.(template)}
          className="cursor-pointer"
        >
          <BaseCard
            icon={template.icon}
            label={template.label}
            variant={mapRarityToVariant(template.rarity)}
          />
          <p className="text-sm text-center text-gray-300 mt-2">{template.name}</p>
        </div>
      ))}
    </div>
  )
}
